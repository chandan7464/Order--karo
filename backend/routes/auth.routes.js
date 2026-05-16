import express from "express";
import {signup, login, logout, sendOtp, resetPassword, verifyOtp, googleAuthSinup,googleAuthLogin} from "../controllers/auth.controller.js";
const authRoutes = express.Router()

authRoutes.post("/register",signup);
authRoutes.post("/login",login);
authRoutes.get("/logout",logout);
authRoutes.post("/send-otp",sendOtp);
authRoutes.post("/verify-otp",verifyOtp);
authRoutes.post("/reset-password",resetPassword);
authRoutes.post("/google-auth-signup",googleAuthSinup);
authRoutes.post("/google-auth-login",googleAuthLogin);

export default authRoutes;