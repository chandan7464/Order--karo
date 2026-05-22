import User from "../model/user.model.js";

export const toggleFavourite = async (req, res) => {
  try {
    const userId = req.user.id;
    const { shopId } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const index = user.favourites.indexOf(shopId);

    if (index === -1) {
      user.favourites.push(shopId);
    } else {
      user.favourites.splice(index, 1);
    }

    await user.save();

    return res.status(200).json({
      message: index === -1 ? "Added to favourites" : "Removed from favourites",
      favourites: user.favourites,
    });
  } catch (error) {
    return res.status(500).json({ message: "Toggle favourite error", error });
  }
};

export const getFavourites = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId).populate("favourites");
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ favourites: user.favourites });
  } catch (error) {
    return res.status(500).json({ message: "Get favourites error", error });
  }
};