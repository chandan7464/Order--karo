import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { serverUrl } from "../../constants/constant";
import { FiUpload } from "react-icons/fi";

const EditShop = () => {
  const navigate = useNavigate();
  const { shopId } = useParams();
  const currentUser = useSelector((state) => state.user.userData);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    state: "",
    address: "",
    image: null,
    currentImage: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/api/shop/get-my-shop`, {
          withCredentials: true,
        });
        const shop = data.shops.find((s) => s._id === shopId);
        if (shop) {
          // Check if current user is the owner
          if (currentUser?._id !== shop.owner._id) {
            setError("❌ You are not authorized to edit this shop");
            setIsOwner(false);
          } else {
            setIsOwner(true);
            setFormData({
              name: shop.name,
              city: shop.city,
              state: shop.state,
              address: shop.address,
              image: null,
              currentImage: shop.image,
            });
            setImagePreview(shop.image);
          }
        } else {
          setError("Shop not found");
        }
      } catch (err) {
        setError("Error fetching shop details");
        console.error(err);
      } finally {
        setPageLoading(false);
      }
    };

    fetchShop();
  }, [shopId, currentUser]);

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
      !formData.city ||
      !formData.state ||
      !formData.address
    ) {
      setError("All text fields are required");
      return;
    }

    try {
      setLoading(true);
      const form = new FormData();
      form.append("name", formData.name);
      form.append("city", formData.city);
      form.append("state", formData.state);
      form.append("address", formData.address);
      if (formData.image) {
        form.append("image", formData.image);
      }

      const { data } = await axios.put(
        `${serverUrl}/api/shop/edit-shop/${shopId}`,
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
      setError(error.response?.data?.message || "Error updating shop");
      console.error("Edit Shop Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <p className="text-orange-600 text-xl font-bold">
          Loading shop details...
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
            You don't have permission to edit this shop. Only the shop owner can
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
          Edit Your Shop
        </h1>
        <h2 className="text-center text-gray-500 text-md font-semibold mb-6">
          Update shop information
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-600 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Shop Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Shop Name <sup className="text-orange-600">*</sup>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter shop name"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              City <sup className="text-orange-600">*</sup>
            </label>
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="Enter city name"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
            />
          </div>

          {/* State */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              State <sup className="text-orange-600">*</sup>
            </label>
            <input
              type="text"
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              placeholder="Enter state name"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Address <sup className="text-orange-600">*</sup>
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="Enter complete address"
              rows="3"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Shop Image (Optional - Leave empty to keep current)
            </label>
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
                id="shop-image"
              />
              <label
                htmlFor="shop-image"
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
                  {formData.image ? "New image selected" : "Current shop image"}
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Updating Shop..." : "Update Shop"}
          </button>

          {/* Back Button */}
          <button
            type="button"
            onClick={() => navigate("/my-shops")}
            className="w-full py-2 px-4 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-all duration-300"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditShop;