import { verifyToken } from "../utils/jwt.utils.js";

export const isAuth = async (req, res, next) => {
  try {
    const token = req?.cookies?.token;
    if (!token) {
      return res.status(400).json({ message: "Token not found" });
    }

    const decodedToken = verifyToken(token);
    if (!decodedToken) {
      return res.status(400).json({ message: "Token not verify" });
    }

    req.user = decodedToken;
    next();
  } catch (error) {
    return res.status(500).json({ message: "isAuth Error", error });
  }
};