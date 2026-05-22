import Order from "../model/order.model.js";
import Shop from "../model/shop.model.js";
import Item from "../model/item.model.js";

// POST /api/order/create
// Customer places an order
export const createOrder = async (req, res) => {
  try {
    const customerId = req?.user?.id;
    const { shopId, items, paymentMethod, deliveryAddress, note } = req.body;

    if (!shopId || !items || !deliveryAddress) {
      return res
        .status(400)
        .json({ message: "shopId, items, and deliveryAddress are required" });
    }

    // Verify shop exists and is open
    const shop = await Shop.findById(shopId);
    if (!shop) return res.status(404).json({ message: "Shop not found" });
    if (!shop.isOpen)
      return res.status(400).json({ message: "Shop is currently closed" });

    // Validate each item and build order items array
    let totalAmount = 0;
    const orderItems = [];

    for (const entry of items) {
      const { itemId, quantity } = entry;
      if (!itemId || !quantity || quantity < 1) {
        return res
          .status(400)
          .json({ message: "Each item must have itemId and quantity >= 1" });
      }

      const dbItem = await Item.findOne({ _id: itemId, shop: shopId });
      if (!dbItem) {
        return res
          .status(404)
          .json({ message: `Item ${itemId} not found in this shop` });
      }
      if (!dbItem.isAvailable) {
        return res
          .status(400)
          .json({ message: `Item "${dbItem.name}" is not available` });
      }

      const lineTotal = dbItem.price * quantity;
      totalAmount += lineTotal;
      orderItems.push({
        item: dbItem._id,
        name: dbItem.name,
        price: dbItem.price,
        quantity,
      });
    }

    const order = await Order.create({
      customer: customerId,
      shop: shopId,
      items: orderItems,
      totalAmount,
      paymentMethod: paymentMethod || "cod",
      deliveryAddress,
      note: note || "",
    });

    await order.populate("customer", "name email");
    await order.populate("shop", "name address");

    return res
      .status(201)
      .json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("Create order error:", error);
    return res
      .status(500)
      .json({ message: "Create order error", error: error.message });
  }
};

// GET /api/order/my-orders
// Logged-in customer sees their own orders
export const getMyOrders = async (req, res) => {
  try {
    const customerId = req?.user?.id;
    const orders = await Order.find({ customer: customerId })
      .populate("shop", "name address image")
      .sort({ createdAt: -1 });

    return res.status(200).json({ orders });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Get my orders error", error: error.message });
  }
};

// GET /api/order/shop/:shopId
// Shop owner sees all orders for their shop
export const getShopOrders = async (req, res) => {
  try {
    const { shopId } = req.params;
    const userId = req?.user?.id;

    // Only the owner can see shop orders
    const shop = await Shop.findOne({ _id: shopId, owner: userId });
    if (!shop) {
      return res
        .status(403)
        .json({ message: "Not authorized or shop not found" });
    }

    const { status } = req.query;
    const filter = { shop: shopId };
    if (status) filter.status = status;

    const orders = await Order.find(filter)
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ orders });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Get shop orders error", error: error.message });
  }
};

// GET /api/order/:orderId
// Get single order - accessible by customer who placed it OR shop owner
export const getSingleOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req?.user?.id;

    const order = await Order.findById(orderId)
      .populate("customer", "name email")
      .populate("shop", "name address image owner");

    if (!order) return res.status(404).json({ message: "Order not found" });

    const isCustomer = order.customer._id.toString() === userId;
    const isShopOwner = order.shop.owner.toString() === userId;

    if (!isCustomer && !isShopOwner) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this order" });
    }

    return res.status(200).json({ order });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Get single order error", error: error.message });
  }
};

// PATCH /api/order/:orderId/status
// Shop owner updates order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const userId = req?.user?.id;

    const validStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "ready",
      "delivered",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({
          message: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
        });
    }

    const order = await Order.findById(orderId).populate("shop", "owner");
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.shop.owner.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Only the shop owner can update order status" });
    }

    if (order.status === "delivered" || order.status === "cancelled") {
      return res
        .status(400)
        .json({ message: `Cannot update a ${order.status} order` });
    }

    order.status = status;

    // Auto-mark payment as paid when delivered (for COD)
    if (status === "delivered" && order.paymentMethod === "cod") {
      order.paymentStatus = "paid";
    }

    await order.save();
    return res.status(200).json({ message: "Order status updated", order });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Update order status error", error: error.message });
  }
};

// DELETE /api/order/:orderId/cancel
// Customer cancels their own order (only if pending)
export const cancelOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req?.user?.id;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.customer.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this order" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({
        message: `Cannot cancel order in "${order.status}" status. Only pending orders can be cancelled`,
      });
    }

    order.status = "cancelled";
    await order.save();

    return res
      .status(200)
      .json({ message: "Order cancelled successfully", order });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Cancel order error", error: error.message });
  }
};
// GET / api/order/shop/:shopId
// Shop owner
