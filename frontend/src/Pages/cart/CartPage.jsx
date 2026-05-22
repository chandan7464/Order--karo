import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiArrowLeft,
  FiPlus,
  FiMinus,
  FiTrash2,
  FiShoppingBag,
  FiMapPin,
  FiTag,
  FiEdit2,
} from "react-icons/fi";

import {
  selectCartItems,
  selectTotalItems,
  selectTotalPrice,
  selectCartRestaurantName,
  addToCart,
  removeFromCart,
  clearCart,
} from "../../redux/cartSlice";
import { serverUrl } from "../../constants/constant";

const DELIVERY_FEE = 30;
const PLATFORM_FEE = 5;

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const items = useSelector(selectCartItems);
  const totalItems = useSelector(selectTotalItems);
  const totalPrice = useSelector(selectTotalPrice);
  const restaurantName = useSelector(selectCartRestaurantName);
  const restaurantId = useSelector((state) => state.cart.restaurantId);
  const address = useSelector((state) => state.user.address);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const grandTotal = totalPrice + DELIVERY_FEE + PLATFORM_FEE;

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    try {
      setLoading(true);
      setError("");
      await axios.post(
        `${serverUrl}/api/order/create`,
        {
          shopId: restaurantId,
          items: items.map((i) => ({ itemId: i._id, quantity: i.quantity })),
          totalAmount: grandTotal,
        },
        { withCredentials: true },
      );
      dispatch(clearCart());
      navigate("/order"); // Create Order Page
    } catch (err) {
      setError(err.response?.data?.message || "Order not placed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 px-4">
        <div className="w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center mb-2">
          <FiShoppingBag size={40} className="text-orange-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-700">Your cart is empty</h2>
        <p className="text-gray-400 text-sm text-center">
          Add items from a restaurant to get started
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-2 px-6 py-2.5 bg-orange-500 text-white font-semibold rounded-xl hover:bg-orange-600 hover:cursor-pointer transition"
        >
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-36">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-600"
          >
            <FiArrowLeft size={20} />
          </button>
          <div>
            <h1 className="font-bold text-gray-800 text-lg leading-tight">
              Your Cart
            </h1>
            <p className="text-xs text-gray-400">{restaurantName}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-5 space-y-4">
        {/* Delivery address */}
        <div className="bg-white rounded-xl p-4 flex items-center gap-3 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center shrink-0 mt-0.5">
            <FiMapPin size={15} className="text-orange-500" />
          </div>
          <div className="flex-1">
            <p className="text-xs text-gray-400 font-medium mb-0.5">
              Delivering to
            </p>
            <p className="text-sm font-semibold text-gray-800">
              {address || "Your saved address"}
            </p>
          </div>
          <div className="w-9 h-9 hover:cursor-pointer rounded-md flex justify-center items-center border border-orange-500">
            <FiEdit2 className="text-orange-600" />
          </div>
        </div>

        {/* Cart Items */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 pt-4 pb-2 border-b border-gray-100">
            <h2 className="font-bold text-gray-800">
              {restaurantName}
              <span className="text-orange-500 font-normal text-sm ml-2">
                ({totalItems} item{totalItems > 1 ? "s" : ""})
              </span>
            </h2>
          </div>

          <div className="divide-y divide-gray-50">
            {items.map((item) => (
              <div key={item._id} className="flex items-center gap-3 px-4 py-3">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => (e.target.src = "/placeholder.png")}
                    className="w-14 h-14 rounded-lg object-cover shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm truncate">
                    {item.name}
                  </p>
                  <p className="text-orange-500 font-bold text-sm mt-0.5">
                    ₹{item.price}
                  </p>
                </div>

                {/* Qty controls */}
                <div className="flex items-center gap-2 border border-orange-400 rounded-lg overflow-hidden shrink-0">
                  <button
                    onClick={() => dispatch(removeFromCart(item._id))}
                    className="px-2 py-1.5 bg-orange-50 text-orange-500 hover:bg-orange-100 transition"
                  >
                    {item.quantity === 1 ? (
                      <FiTrash2 size={13} />
                    ) : (
                      <FiMinus size={13} />
                    )}
                  </button>
                  <span className="text-sm font-bold text-gray-700 w-5 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      dispatch(
                        addToCart({
                          item,
                          restaurantId,
                          restaurantName,
                        }),
                      )
                    }
                    className="px-2 py-1.5 bg-orange-50 text-orange-500 hover:bg-orange-100 transition"
                  >
                    <FiPlus size={13} />
                  </button>
                </div>

                {/* Line total */}
                <p className="text-sm font-bold text-gray-700 w-14 text-right shrink-0">
                  ₹{item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Offers placeholder */}
        <div className="bg-white rounded-xl px-4 py-3 shadow-sm flex items-center gap-3">
          <FiTag size={16} className="text-orange-500 shrink-0" />
          <span className="text-sm text-gray-500">Apply coupon / offers</span>
          <span className="ml-auto text-orange-500 font-semibold text-sm cursor-pointer">
            View all
          </span>
        </div>

        {/* Bill Summary */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 pt-4 pb-2 border-b border-gray-100">
            <h2 className="font-bold text-gray-800">Bill Summary</h2>
          </div>
          <div className="px-4 py-3 space-y-2.5 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Item total</span>
              <span>₹{totalPrice}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery fee</span>
              <span>₹{DELIVERY_FEE}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Platform fee</span>
              <span>₹{PLATFORM_FEE}</span>
            </div>
            <div className="border-t border-dashed border-gray-200 pt-2.5 flex justify-between font-bold text-gray-800 text-base">
              <span>To pay</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>
        </div>

        {/* Cancellation note */}
        <p className="text-xs text-gray-400 text-center px-4">
          Review your order and address before placing. Cancellations may not be
          possible once order is accepted.
        </p>
      </div>

      {/* Place Order — fixed bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 px-4 py-4">
        <div className="max-w-2xl mx-auto space-y-2">
          {error && (
            <p className="text-red-500 text-sm text-center font-medium">
              {error}
            </p>
          )}
          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl py-4 flex justify-between items-center px-5 transition hover:cursor-pointer"
          >
            <span className="bg-orange-600 text-xs font-bold px-2 py-0.5 rounded">
              {totalItems} item{totalItems > 1 ? "s" : ""}
            </span>
            <span className="text-base">
              {loading ? "Placing Order..." : "Place Order"}
            </span>
            <span>₹{grandTotal}</span>
          </button>
          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold rounded-xl py-4 items-center px-5 transition hover:cursor-pointer"
          >
            Confirm Your Address
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
