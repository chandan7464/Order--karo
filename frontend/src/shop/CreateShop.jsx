import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { serverUrl } from "../../constants/constant";
import { FiUpload } from "react-icons/fi";
import { useSelector } from "react-redux";

const CreateShop = () => {
  const navigate = useNavigate();
  const {
    userData,
    city: userCity,
    state: userState,
    address: userAddress,
  } = useSelector((state) => state.user);

  // Ye add karo
  useEffect(() => {
    if (userCity) setCity(userCity);
    if (userState) setState(userState);
    if (userAddress) setAddress(userAddress);
  }, [userCity, userState, userAddress]);

  const [name, setName] = useState("");
  const [city, setCity] = useState(userCity || "");
  const [state, setState] = useState(userState || "");
  const [address, setAddress] = useState(userAddress || "");
  const [image, setImage] = useState(null);

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
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
      !name.trim() ||
      !city.trim() ||
      !state.trim() ||
      !address.trim() ||
      !image
    ) {
      setError("All fields including image are required");
      return;
    }

    try {
      setLoading(true);
      const form = new FormData();
      form.append("name", name);
      form.append("city", city);
      form.append("state", state);
      form.append("address", address);
      form.append("image", image);

      const { data } = await axios.post(
        `${serverUrl}/api/shop/create-shop`,
        form,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      alert(data.message);
      navigate("/dashboard/my-shops");
    } catch (error) {
      setError(error.response?.data?.message || "Error creating shop");
      console.error("Create Shop Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 px-4 py-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl text-center gap-16 font-bold text-orange-600 mb-2">
          Create Your Shop
        </h1>
        <h2 className="text-center text-gray-500 text-md font-semibold mb-6">
          Add a new shop to your account
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
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              value={city}
              onChange={(e) => setCity(e.target.value)}
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
              value={state}
              onChange={(e) => setState(e.target.value)}
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
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter complete address"
              rows="3"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Shop Image <sup className="text-orange-600">*</sup>
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
                  {image ? "Change Image" : "Upload Image"}
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
                <p className="text-xs text-gray-500 mt-1">Image selected</p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Shop..." : "Create Shop"}
          </button>

          {/* Back Button */}
          <button
            type="button"
            className="w-full py-2 px-4 bg-gray-300 text-gray-800 font-semibold rounded-lg hover:bg-gray-400 transition-all duration-300"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateShop;