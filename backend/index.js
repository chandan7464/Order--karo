import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import shopRoutes from "./routes/shop.routes.js";
import itemRoutes from "./routes/item.routes.js";
import orderRoutes from "./routes/order.routes.js";
import favouriteRoutes from "./routes/favourite.routes.js";

dotenv.config();
const app = express();

const corsOption = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per 15 min
  message: "Too many requests, please try again later.",
});

app.use("/api", limiter);

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/shop", shopRoutes);
app.use("/api/item", itemRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/favourite", favouriteRoutes);

const startServer = async () => {
  try {
    // step-1 connect db
    await connectDB();

    // step-2 start server
    app.listen(process.env.PORT, () => {
      console.log(`Server is running at: http://localhost:${process.env.PORT}`);
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

startServer();