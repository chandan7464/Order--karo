import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { serverUrl } from "../../constants/constant";
import { FiUpload } from "react-icons/fi";
import { MdDelete } from "react-icons/md";

const ITEM_CATEGORIES = [
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
];

const FOOD_TYPES = ["veg", "non veg"];

const EditItem = () => {
  const navigate = useNavigate();
  const { itemId } = useParams();
  const currentUser = useSelector((state) => state.user.userData);
  const [formData, setFormData] = useState({
    name: "",
    category: "snacks",
    foodType: "veg",
    price: "",
    image: null,
    currentImage: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        // Get all shops and their items to find the current item
        const { data } = await axios.get(`${serverUrl}/api/shop/get-my-shop`, {
          withCredentials: true,
        });

        let foundItem = null;
        let shopOwner = null;
        for (const shop of data.shops) {
          if (shop.items) {
            foundItem = shop.items.find((item) => item._id === itemId);
            if (foundItem) {
              shopOwner = shop.owner._id;
              break;
            }
          }
        }

        if (foundItem) {
          // Check if current user is the shop owner
          if (currentUser?._id !== shopOwner) {
            setError("❌ You are not authorized to edit this item");
            setIsOwner(false);
          } else {
            setIsOwner(true);
            setFormData({
              name: foundItem.name,
              category: foundItem.category,
              foodType: foundItem.foodType,
              price: foundItem.price,
              image: null,
              currentImage: foundItem.image,
            });
            setImagePreview(foundItem.image);
          }
        } else {
          setError("Item not found");
        }
      } catch (err) {
        setError("Error fetching item details");
        console.error(err);
      } finally {
        setPageLoading(false);
      }
    };

    fetchItem();
  }, [itemId, currentUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({
        ...prev,
        image: file,
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !formData.name ||
      !formData.category ||
      !formData.foodType ||
      !formData.price
    ) {
      setError("All text fields are required");
      return;
    }

    if (isNaN(formData.price) || parseFloat(formData.price) < 0) {
      setError("Price must be a valid positive number");
      return;
    }

    try {
      setLoading(true);
      const form = new FormData();
      form.append("name", formData.name);
      form.append("category", formData.category);
      form.append("foodType", formData.foodType);
      form.append("price", formData.price);
      if (formData.image) {
        form.append("image", formData.image);
      }

      const { data } = await axios.put(
        `${serverUrl}/api/item/edit-item/${itemId}`,
        form,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      alert(data.message);
      navigate("/my-shops");
    } catch (error) {
      setError(error.response?.data?.message || "Error updating item");
      console.error("Edit Item Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);
      const { data } = await axios.delete(
        `${serverUrl}/api/item/remove-item/${itemId}`,
        {
          withCredentials: true,
        },
      );

      alert(data.message);
      navigate("/my-shops");
    } catch (error) {
      setError(error.response?.data?.message || "Error deleting item");
      console.error("Delete Item Error:", error);
    } finally {
      setDeleteLoading(false);
      setShowDeleteConfirm(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <p className="text-orange-600 text-xl font-bold">
          Loading item details...
        </p>
      </div>
    );
  }

  if (!isOwner) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50 px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
          <p className="text-2xl font-bold text-red-600 mb-3">
            ❌ Access Denied
          </p>
          <p className="text-gray-600 font-semibold mb-6">
            You don't have permission to edit this item. Only the shop owner can
            edit it.
          </p>
          <button
            onClick={() => navigate("/my-shops")}
            className="py-3 px-8 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-all"
          >
            Back to My Shops
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 px-4 py-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-orange-600 mb-2">
          Edit Item
        </h1>
        <h2 className="text-center text-gray-500 text-md font-semibold mb-6">
          Update item information
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-600 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Item Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Item Name <sup className="text-orange-600">*</sup>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter item name"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Category <sup className="text-orange-600">*</sup>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
            >
              {ITEM_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Price (₹) <sup className="text-orange-600">*</sup>
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              placeholder="Enter price"
              min="0"
              step="0.01"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
            />
          </div>

          {/* Food Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              Food Type <sup className="text-orange-600">*</sup>
            </label>
            <div className="grid grid-cols-2 gap-3">
              {FOOD_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      foodType: type,
                    }))
                  }
                  className={`py-2 px-3 rounded-lg font-semibold text-sm transition-all duration-300 cursor-pointer ${
                    formData.foodType === type
                      ? "border-2 border-transparent bg-orange-600 text-white"
                      : "border-2 border-gray-300 bg-white text-gray-700 hover:border-orange-600 hover:text-orange-600"
                  }`}
                >
                  {type === "veg" ? "🥬" : "🍗"}{" "}
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Item Image (Optional - Leave empty to keep current)
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="item-image"
              />
              <label
                htmlFor="item-image"
                className="cursor-pointer flex items-center justify-center gap-2 w-full px-4 py-4 border-2 border-dashed border-orange-300 rounded-lg bg-orange-50 hover:bg-orange-100 transition-all duration-300"
              >
                <FiUpload className="text-orange-600 text-lg" />
                <span className="text-orange-600 font-semibold">
                  {formData.image ? "Change Image" : "Upload New Image"}
                </span>
              </label>
            </div>
            {imagePreview && (
              <div className="mt-3 relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.image ? "New image selected" : "Current item image"}
                </p>
              </div>
            )}
          </div>

          {/* Update Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Updating Item..." : "Update Item"}
          </button>

          {/* Delete Button */}
          {!showDeleteConfirm ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full py-3 px-4 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <MdDelete className="text-lg" />
              Delete Item
            </button>
          ) : (
            <div className="p-4 bg-red-50 border-2 border-red-300 rounded-lg">
              <p className="text-red-800 font-semibold mb-3">
                Are you sure? This cannot be undone.
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="py-2 px-3 bg-red-600 text-white font-bold rounded hover:bg-red-700 transition-all disabled:opacity-50"
                >
                  {deleteLoading ? "Deleting..." : "Yes, Delete"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="py-2 px-3 bg-gray-400 text-white font-bold rounded hover:bg-gray-500 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate("/my-shops")}
            className="w-full py-2 px-4 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-all duration-300"
          >
            Back
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditItem;