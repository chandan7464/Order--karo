import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../../constants/constant";

const statusOptions = [
  "all",
  "pending",
  "accepted",
  "preparing",
  "ready",
  "delivered",
  "cancelled",
];

const UserOrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/api/order/my-orders`, {
          withCredentials: true,
        });
        setOrders(data.orders || []);
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load order history.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((order) => order.status === statusFilter);

  const formatDate = (value) =>
    new Date(value).toLocaleString([], {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-5xl mx-auto px-4">
        <div className="mb-6 rounded-3xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-gray-900">Order History</h1>
          <p className="mt-2 text-sm text-gray-500">
            All of your previous orders are stored here for quick review.
          </p>
        </div>

        <div className="mb-5 rounded-3xl bg-white p-5 shadow-sm">
          <p className="mb-3 text-sm font-semibold text-gray-700">
            Filter by status
          </p>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  statusFilter === status
                    ? "bg-orange-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-semibold text-gray-700">
              Loading order history...
            </p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-semibold text-gray-700">
              No orders match this filter.
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Use the status buttons to view different orders.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {filteredOrders.map((order) => (
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
                      {order.deliveryAddress || "Not specified"}
                    </p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-gray-700">
                      Total Amount
                    </p>
                    <p className="mt-2 text-sm text-gray-600">
                      ₹{order.totalAmount?.toFixed(2) || 0}
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
                            Qty: {item.quantity} · ₹{item.price?.toFixed(2)}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-gray-900">
                          ₹{(item.price * item.quantity)?.toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserOrderHistory;