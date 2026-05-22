import User from "../model/user.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

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

export const updateProfile = async (req, res) => {
  const { fullname, mobile, address } = req.body;
  const userId = req?.user?.id;
  const updateData = {};

  if (fullname !== undefined) updateData.fullname = fullname;
  if (mobile !== undefined) updateData.mobile = mobile;
  if (address !== undefined) updateData.address = address;

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ message: "Nothing to update" });
  }

  const user = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
  }).select("-password");
  res.json({ user });
};

export const uploadProfilePic = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = await uploadOnCloudinary(req.file.path);

    if (!imageUrl) {
      return res.status(500).json({ message: "Cloudinary upload failed" });
    }

    const userId = req?.user?.id;
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePic: imageUrl },
      { new: true }
    ).select("-password");

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Upload error", error });
  }
};