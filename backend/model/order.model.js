import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Item",
    required: true,
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
    },
    items: {
      type: [orderItemSchema],
      validate: {
        validator: (v) => v.length > 0,
        message: "Order must have at least one item",
      },
    },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: [
        "pending",
        "accepted", // confirm replaced with accepted
        "preparing",
        "ready",
        "outfordelievery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      default: "cod",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
    },
    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    note: { type: String, default: "" },
  },
  { timestamps: true },
);

const Order = mongoose.model("Order", orderSchema);
export default Order;