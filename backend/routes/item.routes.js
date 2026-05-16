import express from "express";
import { isAuth } from "../middleware/auth.js";
import { upload } from "../middleware/multer.js";
import {
  createItem,
  editItem,
  removeItem,
} from "../controllers/item.controller.js";

const itemRoutes = express.Router();

itemRoutes.post("/create-item", isAuth, upload.single("image"), createItem);
itemRoutes.put("/edit-item/:itemId", isAuth, upload.single("image"), editItem);
itemRoutes.delete("/remove-item/:itemId", isAuth, removeItem);

export default itemRoutes;