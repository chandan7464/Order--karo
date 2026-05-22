import { useState } from "react";
import {
  FiMapPin,
  FiUser,
  FiLogOut,
  FiSearch,
  FiShoppingCart,
  FiFileText,
  FiHeart,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { serverUrl } from "../constants/constant";
import { Link, useNavigate } from "react-router-dom";
import { setCity, setUserData } from "../redux/userSlice";
import { selectTotalItems } from "../redux/cartSlice";

const Nav = ({ onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { city, address, state } = useSelector((state) => state.user);
  const userData = useSelector((state) => state.user.userData);
  const totalItems = useSelector(selectTotalItems);
  const isUser = userData?.role === "user";

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });
      navigate("/login", { replace: true });
      dispatch(setUserData(null));
      dispatch(setCity(null));
    } catch (error) {
      console.log("Logout Error:", error.response?.data);
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-6">
          <div className="shrink-0">
            <Link to="/">
              <h1 className="text-2xl font-bold text-orange-600">
                🛵 Order Karo
              </h1>
            </Link>
          </div>

          <div className="grow flex px-4 py-2 items-center gap-6 max-w-2xl border border-orange-600 rounded-lg">
            <div className="flex items-center gap-2 text-gray-700">
              <FiMapPin className="text-orange-600 text-xl shrink-0" />
              <span className="text-sm truncate text-gray-500 font-medium max-w-30">
                {city || "Location"} {state || ""} {address || ""}
              </span>
            </div>
            <div className="grow border-orange-600 border-l-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search restaurants, food..."
                  className="w-full px-4 py-1 pr-10 border-none outline-none"
                  onChange={(e) => onSearch && onSearch(e.target.value)}
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <FiSearch className="text-lg text-orange-600" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 shrink-0">
            {/* Cart icon — sirf user ke liye, count badge ke saath */}
            {isUser && (
              <div
                className="relative cursor-pointer group"
                onClick={() => navigate("/cart")}
              >
                <FiShoppingCart className="text-2xl text-gray-700 group-hover:text-orange-600 transition" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </div>
            )}

            <button
              onClick={() => navigate("/my-orders")}
              className="text-gray-700 font-medium hover:text-orange-600 transition whitespace-nowrap hover:cursor-pointer"
            >
              My Orders
            </button>

            <div className="relative flex items-center gap-2">
              <div
                className="w-12 h-12 rounded-full overflow-hidden bg-orange-600 text-white flex items-center justify-center font-bold text-lg cursor-pointer hover:bg-orange-700 transition ring-2 ring-orange-400"
                onClick={() => setIsOpen((prev) => !prev)}
              >
                {userData?.profilePic ? (
                  <img
                    src={userData.profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => (e.target.style.display = "none")}
                  />
                ) : (
                  userData?.fullname
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                )}
              </div>

              {isOpen && (
                <div className="absolute right-0 top-14 w-52 bg-white rounded-2xl shadow-2xl border border-gray-100 p-3 z-50 flex flex-col gap-1">
                  <div className="px-3 py-2 border-b border-gray-100 mb-1">
                    <p className="text-sm font-semibold text-gray-800">
                      {userData?.fullname}
                    </p>
                    <p className="text-xs text-gray-400">{userData?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-gray-700 text-sm font-medium hover:bg-orange-50 hover:text-orange-600 transition-all duration-150 text-left w-full cursor-pointer"
                  >
                    <FiUser className="text-base" /> Profile
                  </button>
                  <button
                    onClick={() => {
                      navigate("/order-history");
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-gray-700 text-sm font-medium hover:bg-orange-50 hover:text-orange-600 transition-all duration-150 text-left w-full cursor-pointer"
                  >
                    <FiFileText className="text-base" /> Order History
                  </button>
                  <button
                    onClick={() => {
                      navigate("/favourites");
                      setIsOpen(false);
                    }}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-gray-700 text-sm font-medium hover:bg-orange-50 hover:text-orange-600 transition-all duration-150 text-left w-full cursor-pointer"
                  >
                    <FiHeart className="text-base" /> Favourites
                  </button>
                  <button
                    className="flex items-center justify-center gap-2 mt-1 w-full bg-orange-600 hover:bg-orange-700 text-white text-sm font-semibold py-2.5 rounded-xl transition-all duration-200 shadow-sm cursor-pointer"
                    onClick={handleLogout}
                  >
                    <FiLogOut className="text-base" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;