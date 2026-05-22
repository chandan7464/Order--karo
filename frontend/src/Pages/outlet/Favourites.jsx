import { useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  FiArrowLeft,
  FiCamera,
  FiEdit3,
  FiCheck,
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiShoppingBag,
  FiFileText,
  FiHeart,
  FiShoppingCart
} from "react-icons/fi";
import { setUserData } from "../../redux/userSlice";
import { serverUrl } from "../../constants/constant";

const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);
  const address = useSelector((state) => state.user.address);

  const fileInputRef = useRef(null);

  const [editField, setEditField] = useState(null); // which field is being edited
  const [fieldValue, setFieldValue] = useState("");
  const [imgLoading, setImgLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const avatar = userData?.profilePic || null;
  const initials =
    userData?.fullname
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "U";

  // ── Profile pic upload ──────────────────────────────────────
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("profilePic", file);
    try {
      setImgLoading(true);
      setError("");
      const { data } = await axios.patch(
        `${serverUrl}/api/user/update-profile-pic`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      console.log("data in profile:", data);
      dispatch(setUserData(data.user));
      setSuccess("Profile picture updated!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Image upload failed.");
    } finally {
      setImgLoading(false);
    }
  };

  // ── Inline field edit ───────────────────────────────────────
  const startEdit = (field, currentValue) => {
    setEditField(field);
    setFieldValue(currentValue || "");
    setError("");
  };

  const cancelEdit = () => {
    setEditField(null);
    setFieldValue("");
  };

  const saveField = async () => {
    if (!fieldValue.trim()) return;
    try {
      setSaveLoading(true);
      setError("");
      const { data } = await axios.patch(
        `${serverUrl}/api/user/update-profile`,
        { [editField]: fieldValue },
        { withCredentials: true },
      );
      dispatch(setUserData(data.user));
      setEditField(null);
      setSuccess("Profile updated!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
    } finally {
      setSaveLoading(false);
    }
  };

  const fields = [
    {
      key: "fullname",
      label: "Full Name",
      icon: FiUser,
      value: userData?.fullname,
      editable: true,
    },
    {
      key: "email",
      label: "Email",
      icon: FiMail,
      value: userData?.email,
      editable: false,
    },
    {
      key: "mobile",
      label: "Phone",
      icon: FiPhone,
      value: userData?.mobile || userData?.phone,
      editable: true,
    },
    {
      key: "address",
      label: "Address",
      icon: FiMapPin,
      value: userData?.address || address, // DB first, geoAPI fallback
      editable: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-30">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition text-gray-600"
          >
            <FiArrowLeft size={20} />
          </button>
          <h1 className="font-bold text-gray-800 text-lg">My Profile</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Toast */}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 text-sm font-medium px-4 py-3 rounded-xl flex items-center gap-2">
            <FiCheck size={15} /> {success}
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-medium px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Avatar Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col items-center gap-3">
          <div className="relative">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-full overflow-hidden bg-orange-100 flex items-center justify-center ring-4 ring-orange-100">
              {avatar ? (
                <img
                  src={avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => (e.target.style.display = "none")}
                />
              ) : (
                <span className="text-3xl font-bold text-orange-500">
                  {initials}
                </span>
              )}
            </div>

            {/* Camera button */}
            <button
              type="button"
              onClick={() => fileInputRef.current.click()}
              disabled={imgLoading}
              className="absolute bottom-0 right-0 w-8 h-8 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center shadow-md transition disabled:opacity-60"
            >
              {imgLoading ? (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <FiCamera size={14} />
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <div className="text-center">
            <h2 className="font-bold text-gray-800 text-xl">
              {userData?.fullname}
            </h2>
            <p className="text-sm text-gray-400">{userData?.email}</p>
            <span className="inline-block mt-1.5 text-xs font-semibold px-3 py-0.5 rounded-full bg-orange-100 text-orange-600 capitalize">
              {userData?.role || "user"}
            </span>
          </div>
        </div>

        {/* Profile Fields */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 pt-4 pb-2 border-b border-gray-100">
            <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">
              Personal Info
            </h3>
          </div>

          <div className="divide-y divide-gray-50">
            {fields.map(({ key, label, icon: Icon, value, editable }) => (
              <div key={key} className="px-5 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center shrink-0 mt-0.5">
                      <Icon size={14} className="text-orange-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400 font-medium mb-0.5">
                        {label}
                      </p>

                      {editField === key ? (
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            autoFocus
                            value={fieldValue}
                            onChange={(e) => setFieldValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") saveField();
                              if (e.key === "Escape") cancelEdit();
                            }}
                            className="flex-1 text-sm border border-orange-300 rounded-lg px-3 py-1.5 outline-none focus:ring-2 focus:ring-orange-200"
                          />
                          <button
                            type="button"
                            onClick={saveField}
                            disabled={saveLoading}
                            className="w-7 h-7 bg-orange-500 text-white rounded-full flex items-center justify-center hover:bg-orange-600 transition shrink-0"
                          >
                            {saveLoading ? (
                              <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <FiCheck size={12} />
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="w-7 h-7 bg-gray-100 text-gray-500 rounded-full flex items-center justify-center hover:bg-gray-200 transition shrink-0"
                          >
                            <FiX size={12} />
                          </button>
                        </div>
                      ) : (
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {value || (
                            <span className="text-gray-300 font-normal">
                              Not set
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>

                  {editable && editField !== key && (
                    <button
                      onClick={() => startEdit(key, value)}
                      className="w-7 h-7 rounded-full hover:bg-orange-50 flex items-center justify-center text-gray-400 hover:text-orange-500 transition shrink-0"
                    >
                      <FiEdit3 size={13} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 pt-4 pb-2 border-b border-gray-100">
            <h3 className="font-bold text-gray-700 text-sm uppercase tracking-wide">
              Quick Actions
            </h3>
          </div>

           {/* Order History button */}
          <button
            type="button"
            onClick={() => navigate("/order-history")}
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-orange-50 transition hover:cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
              <FiFileText size={14} className="text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Order History
              </p>
              <p className="text-xs text-gray-400">View your order history</p>
            </div>
          </button>

          {/* Current Order button */}
          <button
            type="button"
            onClick={() => navigate("/my-orders")}
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-orange-50 transition hover:cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
              <FiShoppingBag size={14} className="text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                Current Order
              </p>
              <p className="text-xs text-gray-400">View your Current order</p>
            </div>
          </button>

         {/* Cart Page */}
          <button
            type="button"
            onClick={() => navigate("/cart")}
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-orange-50 transition hover:cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
              <FiShoppingCart size={14} className="text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Cart</p>
              <p className="text-xs text-gray-400">View your Cart</p>
            </div>
          </button>

          {/* Favourites button */}
          <button
            type="button"
            onClick={() => navigate("/favourites")}
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-orange-50 transition hover:cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center">
              <FiHeart size={14} className="text-orange-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Favourites</p>
              <p className="text-xs text-gray-400">
                View your Favourites Restaurants
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;