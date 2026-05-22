import { useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  serverUrl,
  ITEM_CATEGORIES,
  FOOD_TYPES,
} from "../../constants/constant";
import { FiUpload } from "react-icons/fi";
import { addItemToShop } from "../../redux/shopSlice";

const CreateItem = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const preselectedShopId = searchParams.get("shopId");

  const shopData = useSelector((state) => state.shop.shopData);

  const [formData, setFormData] = useState({
    name: "",
    category: "snacks",
    foodType: "veg",
    price: "",
    description: "",
    shopId: preselectedShopId || shopData?.[0]?._id || "",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // shopData is null means the hook hasn't resolved yet
  if (shopData === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50">
        <p className="text-orange-600 text-xl font-bold">Loading shops...</p>
      </div>
    );
  }

  // shopData is an empty array means user has no shops
  if (shopData.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-orange-50 px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <p className="text-xl font-bold text-gray-800 mb-4">
            You need to create a shop first before adding items
          </p>
          <button
            onClick={() => navigate("/dashboard/create-shop")}
            className="py-3 px-6 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-all"
          >
            Create Shop
          </button>
        </div>
      </div>
    );
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, image: file }));
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { name, category, foodType, price, description, shopId, image } =
      formData;

    if (
      !name ||
      !category ||
      !foodType ||
      !price ||
      !description ||
      !shopId ||
      !image
    ) {
      setError("All fields including image are required");
      return;
    }

    if (isNaN(price) || parseFloat(price) < 0) {
      setError("Price must be a valid positive number");
      return;
    }

    try {
      setLoading(true);
      const form = new FormData();
      form.append("name", name);
      form.append("category", category);
      form.append("foodType", foodType);
      form.append("price", price);
      form.append("description", description);
      form.append("shopId", shopId);
      form.append("image", image);

      const { data } = await axios.post(
        `${serverUrl}/api/item/create-item`,
        form,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        },
      );

      alert(data.message);
      dispatch(addItemToShop({ shopId: formData.shopId, item: data?.item }));
      navigate(`/dashboard/shop/${shopId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Error creating item");
      console.error("Create Item Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 px-4 py-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-orange-600 mb-2">
          Create Item
        </h1>
        <h2 className="text-center text-gray-500 text-md font-semibold mb-6">
          Add a new item to your shop
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-600 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Select Shop */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Select Shop <sup className="text-orange-600">*</sup>
            </label>
            <select
              name="shopId"
              value={formData.shopId}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
              required
            >
              <option value="">-- Select a shop --</option>
              {shopData.map((shop) => (
                <option key={shop._id} value={shop._id}>
                  {shop.name}
                </option>
              ))}
            </select>
          </div>

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
              className="[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none appearance-none w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Description <sup className="text-orange-600">*</sup>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Enter item description"
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all duration-300 resize-none"
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
                    setFormData((prev) => ({ ...prev, foodType: type }))
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
              Item Image <sup className="text-orange-600">*</sup>
            </label>
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
                {formData.image ? "Change Image" : "Upload Image"}
              </span>
            </label>
            {imagePreview && (
              <div className="mt-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-1">Image selected</p>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 hover:cursor-pointer transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Item..." : "Create Item"}
          </button>

          {/* Cancel */}
          <button
            type="button"
            onClick={() => navigate(`/dashboard/shop/${formData.shopId}`)}
            className="w-full py-2 px-4 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 hover:cursor-pointer transition-all duration-300"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateItem;