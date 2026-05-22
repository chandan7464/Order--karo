import express from "express";
import { isAuth } from "../middleware/auth.js";
import {
  toggleFavourite,
  getFavourites,
} from "../controllers/favourite.controller.js";

const favouriteRoutes = express.Router();

favouriteRoutes.patch("/toggle/:shopId", isAuth, toggleFavourite);
favouriteRoutes.get("/", isAuth, getFavourites);

export default favouriteRoutes;