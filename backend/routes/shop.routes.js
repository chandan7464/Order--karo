import express from "express";
import { isAuth } from "../middleware/auth.js";
import {
  createShop,
  editShop,
  getMyShops,
  removeShop,
  toggleShopStatus,
  getAllShops,
} from "../controllers/shop.controller.js";
import { upload } from "../middleware/multer.js";

const shopRoutes = express.Router();

shopRoutes.post("/create-shop", isAuth, upload.single("image"), createShop);
shopRoutes.put("/edit-shop/:shopId", isAuth, upload.single("image"), editShop);
shopRoutes.get("/get-my-shop", isAuth, getMyShops);
shopRoutes.delete("/remove-shop/:shopId", isAuth, removeShop);
shopRoutes.patch("/toggle-status/:shopId", isAuth, toggleShopStatus);
shopRoutes.get("/get-all-shops", isAuth, getAllShops);
export default shopRoutes;