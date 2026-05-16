import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    isOpen: {
      type: Boolean,
      default: false,
    },
    openTime: {
      type: String,
      default: "11:00",
    },
    closeTime: {
      type: String,
      default: "23:00",
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
      },
    ],
  },
  {
    timestamps: true,
  },
);

shopSchema.index({ owner: 1, name: 1 }, { unique: true });

const Shop = mongoose.model("Shop", shopSchema);
export default Shop;