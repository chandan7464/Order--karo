import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../constants/constant";

const UserOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState("");

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${serverUrl}/api/order/my-orders`, {
        withCredentials: true,
      });
      setOrders(data.orders || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to load your orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const cancelOrder = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      setActionLoading(orderId);
      await axios.delete(`${serverUrl}/api/order/${orderId}/cancel`, {
        withCredentials: true,
      });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, status: "cancelled" } : order,
        ),
      );
    } catch (err) {
      setError(err.response?.data?.message || "Unable to cancel the order.");
    } finally {
      setActionLoading("");
    }
  };

  const formatDate = (value) =>
    new Date(value).toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-orange-600 text-xl font-semibold">
          Loading orders...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-6 rounded-3xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
          <p className="mt-2 text-sm text-gray-500">
            Review all of your placed orders, status updates, and payment
            details.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {orders.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-semibold text-gray-700">
              No orders found yet.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Place an order from a shop to see it listed here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order._id}
                className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-orange-600">
                      Order ID
                    </p>
                    <h2 className="mt-1 text-xl font-semibold text-gray-900">
                      {order._id}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="space-y-2 text-right">
                    <p className="text-sm text-gray-500">
                      Shop: {order.shop?.name || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-500">
                      Total: ₹{order.totalAmount?.toFixed(2) || 0}
                    </p>
                    <div className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-gray-700">
                      <span>Status:</span>
                      <span className="text-orange-600">{order.status}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-[1fr_1fr]">
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-gray-700">
                      Delivery Address
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                      {order.deliveryAddress || "No delivery address provided"}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-gray-700">
                      Payment
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                      Method: {order.paymentMethod?.toUpperCase() || "COD"}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      Paid: {order.paymentStatus?.toUpperCase() || "PENDING"}
                    </p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="mb-3 text-sm font-semibold text-gray-700">
                    Items
                  </p>
                  <div className="space-y-3">
                    {order.items?.map((item) => (
                      <div
                        key={item._id || item.item}
                        className="flex flex-col gap-2 rounded-3xl border border-gray-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            Qty: {item.quantity} • ₹{item.price?.toFixed(2)}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          ₹{(item.price * item.quantity)?.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {order.status === "pending" && (
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                    <button
                      onClick={() => cancelOrder(order._id)}
                      disabled={actionLoading === order._id}
                      className="inline-flex items-center justify-center rounded-2xl bg-red-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {actionLoading === order._id
                        ? "Cancelling..."
                        : "Cancel Order"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrders;