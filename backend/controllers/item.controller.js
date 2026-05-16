import Shop from "../model/shop.model.js";
import Item from "../model/item.model.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

export const createItem = async (req, res) => {
  try {
    const { name, category, foodType, price, description, shopId } = req.body; // shopId add kiya
    const userId = req?.user?.id;

    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    } else {
      return res.status(400).json({ message: "Item image is required" });
    }

    const shop = await Shop.findOne({ _id: shopId, owner: userId }); // fix
    if (!shop) {
      return res.status(400).json({ message: "Shop not found" });
    }

    const item = await Item.create({
      name,
      category,
      foodType,
      price,
      description,
      image,
      shop: shop._id,
    });

    shop.items.push(item._id);
    await shop.save();
    await shop.populate("items owner");

    return res.status(201).json({ message: "Item created successfully", item });
  } catch (error) {
    return res.status(500).json({ message: "Create Item Error", error });
  }
};

export const editItem = async (req, res) => {
  try {
    const itemId = req.params.itemId;
    const { name, category, foodType, price } = req.body;
    const userId = req?.user?.id;
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }

    const item = await Item.findByIdAndUpdate(
      itemId,
      {
        name,
        category,
        foodType,
        price,
        image,
      },
      { new: true },
    );

    if (!item) {
      return res.status(400).json({ message: "Item not found" });
    }

    return res.status(200).json({ message: "Item updated successfully", item });
  } catch (error) {
    return res.status(500).json({ message: "Edit item error", error });
  }
};

export const removeItem = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req?.user?.id;

    const item = await Item.findByIdAndDelete(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    await Shop.findByIdAndUpdate(item.shop, {
      $pull: { items: itemId },
    });

    return res.status(200).json({ message: "Item removed successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Remove item error", error });
  }
};


// get item by id controller for edit help