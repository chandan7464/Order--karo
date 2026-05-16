import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Disable deprecated warnings & improve connection behavior
        mongoose.set("strictQuery", false);

        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error("Failed to connect DB:", error.message);
        process.exit(1); // Exit process on failure instead of throwing
    }
};

export default connectDB;
