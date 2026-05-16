import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
    },
    category: {
      type: String,
      enum: [
        "snacks",
        "Main Course",
        "Desserts",
        "Pizza",
        "Burgers",
        "Sandwiches",
        "South Indian",
        "Chinese",
        "Fast Food",
        "Others",
      ],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      required: true,
    },
    foodType: {
      type: String,
      enum: ["veg", "non veg"],
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const Item = mongoose.model("Item", itemSchema);
export default Item;

