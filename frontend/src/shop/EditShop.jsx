import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { serverUrl } from "../../constants/constant";
import { updateShop } from "../../redux/shopSlice";
import { FiUpload, FiArrowLeft } from "react-icons/fi";

const EditShop = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { shopId } = useParams();

  const shopData = useSelector((state) => state.shop.shopData);
  const shop = shopData?.find((shop) => shop._id === shopId);

  const [formData, setFormData] = useState({
    name: shop?.name || "",
    city: shop?.city || "",
    state: shop?.state || "",
    address: shop?.address || "",
    openTime: shop?.openTime || "11:00",
    closeTime: shop?.closeTime || "23:00",
    image: null,
  });

  const [imagePreview, setImagePreview] = useState(shop?.image || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!shop) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-orange-50 gap-4">
        <p className="text-gray-600 text-lg font-semibold">Shop not found.</p>
        <button
          onClick={() => navigate("/dashboard/my-shops")}
          className="text-orange-600 font-bold underline"
        >
          Back to My Shops
        </button>
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

    const { name, city, state, address, openTime, closeTime } = formData;

    // FIX: openTime aur closeTime bhi validate kar rahe hain
    if (
      !name.trim() ||
      !city.trim() ||
      !state.trim() ||
      !address.trim() ||
      !openTime ||
      !closeTime
    ) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      const form = new FormData();
      form.append("name", formData.name);
      form.append("city", formData.city);
      form.append("state", formData.state);
      form.append("address", formData.address);
      form.append("openTime", formData.openTime);
      form.append("closeTime", formData.closeTime);
      if (formData.image) {
        form.append("image", formData.image);
      }

      const { data } = await axios.put(
        `${serverUrl}/api/shop/edit-shop/${shopId}`,
        form,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      dispatch(updateShop(data.shop));

      // FIX: User ko feedback do update hone ka
      alert(data.message || "Shop updated successfully!");

      navigate(`/dashboard/shop/${shopId}`);
    } catch (err) {
      setError(err.response?.data?.message || "Error updating shop.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 px-4 py-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <button
          onClick={() => navigate(`/dashboard/shop/${shopId}`)}
          className="flex items-center gap-2 text-slate-600 font-semibold hover:text-orange-600 transition mb-6"
        >
          <FiArrowLeft />
          Back to Shop
        </button>

        <h1 className="text-3xl font-bold text-center text-orange-600 mb-2">
          Edit Shop
        </h1>
        <p className="text-center text-gray-500 text-sm font-semibold mb-6">
          Update your shop information
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-600 text-red-700 rounded text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Opening Time <sup className="text-orange-600">*</sup>
              </label>
              <input
                type="time"
                name="openTime"
                value={formData.openTime}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Closing Time <sup className="text-orange-600">*</sup>
              </label>
              <input
                type="time"
                name="closeTime"
                value={formData.closeTime}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Shop Image{" "}
              <span className="text-gray-400 font-normal">
                (leave empty to keep current)
              </span>
            </label>
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
            {imagePreview && (
              <div className="mt-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.image ? "New image selected" : "Current image"}
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Update Shop"}
          </button>

          <button
            type="button"
            onClick={() => navigate(`/dashboard/shop/${shopId}`)}
            className="w-full py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all duration-300"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditShop;