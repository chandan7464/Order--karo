import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { serverUrl } from "../../constants/constant";
import {
  removeShop,
  updateShop,
  removeItemFromShop,
} from "../../redux/shopSlice";
import {
  FiArrowLeft,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiMapPin,
  FiClock,
} from "react-icons/fi";

// "11:00" -> "11:00 AM", "23:00" -> "11:00 PM"
const formatTime = (time) => {
  const [hour, minute] = time.split(":");
  const h = parseInt(hour);
  const ampm = h >= 12 ? "PM" : "AM";
  const displayHour = h % 12 || 12;
  return `${displayHour}:${minute} ${ampm}`;
};

const ShopDetails = () => {
  const { shopId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const shopData = useSelector((state) => state.shop.shopData);
  const shop = shopData?.find((shop) => shop._id === shopId);

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [toggleLoading, setToggleLoading] = useState(false);
  const [error, setError] = useState("");

  if (!shop) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50 gap-4">
        <p className="text-gray-600 text-lg font-semibold">Shop Not Found..!</p>
        <button
          onClick={() => navigate("/dashboard/my-shops")}
          className="text-orange-600 font-bold underline"
        >
          My Shops
        </button>
      </div>
    );
  }

  // Toggle = owner force open/close override
  const handleToggleStatus = async () => {
    dispatch(updateShop({ _id: shopId, isOpen: !shop.isOpen }));
    try {
      setToggleLoading(true);
      const { data } = await axios.patch(
        `${serverUrl}/api/shop/toggle-status/${shopId}`,
        {},
        { withCredentials: true },
      );
      dispatch(updateShop({ _id: shopId, isOpen: data?.isOpen }));
    } catch (err) {
      dispatch(updateShop({ _id: shopId, isOpen: shop.isOpen }));
      setError(err.response?.data?.message || "Status toggle failed");
    } finally {
      setToggleLoading(false);
    }
  };

  const handleDeleteShop = async () => {
    const confirmed = confirm(
      `"${shop.name}" Are you sure you want to delete this shop ?`,
    );
    if (!confirmed) return;

    try {
      setDeleteLoading(true);
      await axios.delete(`${serverUrl}/api/shop/remove-shop/${shopId}`, {
        withCredentials: true,
      });
      dispatch(removeShop(shopId));
      navigate("/dashboard/my-shops");
    } catch (err) {
      setError(err.response?.data?.message || "Delete mein error aaya.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleItemDelete = async (itemId) => {
    const confirmed = confirm("Are you sure you want to delete this item?");
    if (!confirmed) return;

    try {
      await axios.delete(`${serverUrl}/api/item/remove-item/${itemId}`, {
        withCredentials: true,
      });
      dispatch(removeItemFromShop({ shopId, itemId }));
    } catch (error) {
      setError(error.response?.data?.message || "Error deleting item");
      console.error("Delete Item Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
        <button
          onClick={() => navigate("/dashboard/my-shops")}
          className="flex items-center gap-2 text-slate-600 font-semibold hover:text-orange-600 hover:cursor-pointer transition"
        >
          <FiArrowLeft className="text-xl" />
          My Shops
        </button>

        <div className="flex items-center gap-3">
          {/* Toggle - owner force override */}
          <button
            onClick={handleToggleStatus}
            disabled={toggleLoading}
            className={`flex items-center gap-2 px-4 py-2 font-bold rounded-lg transition hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
              shop.isOpen
                ? "bg-gray-400 hover:bg-gray-500 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {toggleLoading
              ? "Updating..."
              : shop.isOpen
                ? "Close Shop"
                : "Open Shop"}
          </button>

          <button
            onClick={() => navigate(`/dashboard/edit-shop/${shopId}`)}
            className="flex items-center gap-2 px-4 py-2 border-2 border-orange-600 text-orange-600 font-bold rounded-lg hover:cursor-pointer hover:bg-orange-50 transition"
          >
            <FiEdit2 />
            Edit Shop
          </button>

          <button
            onClick={handleDeleteShop}
            disabled={deleteLoading}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 hover:cursor-pointer transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiTrash2 />
            {deleteLoading ? "Deleting..." : "Delete Shop"}
          </button>
        </div>
      </header>

      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-100 border-l-4 border-red-600 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Shop Info Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <div className="h-64 w-full overflow-hidden bg-gray-200">
            <img
              src={shop.image}
              alt={shop.name}
              onError={(e) => (e.target.src = "/placeholder.png")}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-800">{shop.name}</h1>
              {/* Show force closed warning if owner manually closed */}
              {shop.isOpen ? (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-500 text-white">
                  Open
                </span>
              ) : (
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-100 text-red-600">
                  Closed
                </span>
              )}
            </div>

            <div className="flex items-start gap-2 text-gray-500 text-sm mt-1">
              <FiMapPin className="mt-0.5 shrink-0 text-orange-600" />
              <span>
                {shop.address}, {shop.state}
              </span>
            </div>

            {shop.openTime && shop.closeTime && (
              <div className="flex items-center gap-2 text-gray-500 text-sm mt-2">
                <FiClock className="shrink-0 text-orange-600" />
                <span>
                  {formatTime(shop.openTime)} - {formatTime(shop.closeTime)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Items Section Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Menu Items{" "}
            <span className="text-orange-600">({shop.items?.length || 0})</span>
          </h2>
          <button
            onClick={() => navigate(`/dashboard/create-item?shopId=${shopId}`)}
            className="flex items-center gap-2 py-2 px-5 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 hover:cursor-pointer transition"
          >
            <FiPlus />
            Add Item
          </button>
        </div>

        {/* Items Grid */}
        {!shop.items || shop.items.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500 font-semibold text-lg mb-4">
              This shop has no items yet.
            </p>
            <button
              onClick={() =>
                navigate(`/dashboard/create-item?shopId=${shopId}`)
              }
              className="py-2 px-6 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 hover:cursor-pointer transition"
            >
              Add Your First Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {shop.items.map((item) => (
              <div
                key={item._id}
                className="bg-white w-full flex rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <div className="h-50 w-50 overflow-hidden bg-gray-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    onError={(e) => (e.target.src = "/placeholder.png")}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4 grow flex items-start justify-between">
                  <div className="flex flex-col items-start mb-1">
                    <h3 className="font-bold text-gray-800 text-lg">
                      {item.name}
                    </h3>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                      {item.description}
                    </p>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                      {item.category}
                    </p>
                    <div className="text-orange-600 font-bold text-lg">
                      ₹{item.price}
                    </div>
                  </div>

                  <div className="self-center flex flex-col gap-3">
                    <button
                      onClick={() =>
                        navigate(`/dashboard/edit-item/${item._id}`)
                      }
                      className="w-12 h-12 flex items-center justify-center py-2 border border-orange-600 text-orange-600 text-sm font-bold rounded-full hover:cursor-pointer hover:bg-orange-50 transition mt-2"
                    >
                      <FiEdit2 size={16} />
                    </button>
                    <button
                      onClick={() => handleItemDelete(item._id)}
                      className="w-12 h-12 flex items-center justify-center py-2 border border-red-500 text-red-500 text-sm font-bold rounded-full hover:cursor-pointer hover:bg-red-50 transition mt-2"
                    >
                      <FiTrash2 size={16} />
                    </button>
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

export default ShopDetails;