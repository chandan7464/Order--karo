import Shop from "../model/shop.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";
import Item from "../model/item.model.js";

export const createShop = async (req, res) => {
  try {
    // FIX: openTime aur closeTime add kiya
    const { name, city, state, address, openTime, closeTime } = req.body;
    const userId = req?.user?.id;
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    } else {
      return res.status(400).json({ message: "Shop image is required" });
    }

    let shop = await Shop.findOne({ owner: userId, name: name });
    if (shop) {
      return res
        .status(400)
        .json({ message: "Shop with this name already exists" });
    }

    shop = await Shop.create({
      name,
      city,
      state,
      address,
      image,
      owner: userId,
      // FIX: openTime aur closeTime save ho rahe hain
      openTime: openTime || "11:00",
      closeTime: closeTime || "23:00",
    });
    await shop.populate("owner");

    return res.status(201).json({ message: "Shop Created", shop });
  } catch (error) {
    return res.status(500).json({ message: "Create Shop error", error });
  }
};

export const editShop = async (req, res) => {
  try {
    const { name, city, state, address, openTime, closeTime } = req.body;
    const { shopId } = req.params;
    const userId = req?.user?.id;
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    const shop = await Shop.findOneAndUpdate(
      { _id: shopId, owner: userId },
      {
        name,
        city,
        state,
        address,
        openTime,
        closeTime,
        ...(image && { image }),
      },
      { new: true },
    ).populate("owner");

    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    return res.status(200).json({ message: "Shop Updated", shop });
  } catch (error) {
    return res.status(500).json({ message: "Edit Shop error", error });
  }
};

// For Single Shop
export const getMyShops = async (req, res) => {
  try {
    const userId = req?.user?.id;
    const shops = await Shop.find({ owner: userId }).populate("owner items");

    if (!shops) {
      return res
        .status(400)
        .json({ message: "shop not found please create your shop" });
    }
    return res.status(200).json({ shops });
  } catch (error) {
    return res.status(500).json({ message: "Get my shops error", error });
  }
};


// For Multiple Shops
export const getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find({})
      .populate("owner", "name email")
      .populate("items");
    return res.status(200).json({shops});
  } catch (error) {
    return res.status(500).json({ message: "Get all shops error", error });
  }
};

export const removeShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const userId = req?.user?.id;

    const shop = await Shop.findOneAndDelete({ _id: shopId, owner: userId });
    if (!shop) {
      return res.status(404).json({ message: "Shop not found" });
    }

    await Item.deleteMany({ shop: shopId });

    return res.status(200).json({ message: "Shop deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Remove shop error", error });
  }
};

export const toggleShopStatus = async (req, res) => {
  try {
    const { shopId } = req.params;
    const userId = req?.user?.id;

    if (!shopId || !userId) {
      return res.status(400).json({
        message: "Missing shopId or user authentication",
      });
    }

    const shop = await Shop.findOne({ _id: shopId, owner: userId });

    if (!shop) {
      return res.status(404).json({
        message: "Shop not found or you don't have permission",
      });
    }

    shop.isOpen = !shop.isOpen;
    await shop.save();

    return res.status(200).json({
      message: "Shop status updated successfully",
      isOpen: shop.isOpen,
      shopId: shop._id,
    });
  } catch (error) {
    console.error("Toggle shop status error:", error);
    return res.status(500).json({
      message: "Internal server error while toggling shop status",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};