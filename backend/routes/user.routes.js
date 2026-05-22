import express from "express";
import { isAuth } from "../middleware/auth.js";
import {
  getCurrentUser,
  updateProfile,
  uploadProfilePic,
} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.js";

const userRoutes = express.Router();

userRoutes.get("/current", isAuth, getCurrentUser);

// Profile fields update
userRoutes.patch("/update-profile", isAuth, updateProfile);

// Profile pic upload — multer chahiye
userRoutes.patch(
  "/update-profile-pic",
  isAuth,
  upload.single("profilePic"),
  uploadProfilePic,
);

export default userRoutes;