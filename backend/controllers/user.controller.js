import User from "../model/user.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req?.user?.id;
    if (!userId) {
      return res.status(400).json({ message: "userId is not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: "user is not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Get Current User error", error });
  }
};