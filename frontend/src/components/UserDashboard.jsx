import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FiStar,
  FiClock,
  FiHeart,
  FiTrendingUp,
  FiDollarSign,
  FiFilter,
  FiShoppingCart,
} from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import { selectTotalItems, selectTotalPrice } from "../redux/cartSlice";
import { toggleFavouriteLocal } from "../redux/userSlice";
import { serverUrl } from "../constants/constant";
import axios from "axios";

const UserDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const favourites = useSelector((state) => state.user.favourites);
  const userData = useSelector((state) => state.user.userData);
  const restaurants = useSelector((state) => state.user.shopInMyCity);
  const loading = useSelector((state) => state.user.loading);

 
  const totalItems = useSelector(selectTotalItems);
  const totalPrice = useSelector(selectTotalPrice);
  const isUser = userData?.role === "user";

  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    filterRestaurants();
  }, [searchTerm, activeFilter, restaurants]);

  const filterRestaurants = () => {
    let filtered = [...(restaurants || [])];
    if (searchTerm) {
      filtered = filtered.filter((r) =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    if (activeFilter === "rating") {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (activeFilter === "delivery") {
      filtered.sort(
        (a, b) =>
          (parseInt(a.deliveryTime) || 0) - (parseInt(b.deliveryTime) || 0),
      );
    } else if (activeFilter === "price") {
      filtered.sort((a, b) => {
        const priceA = parseInt(
          (a.priceForTwo || "0").toString().replace(/[^0-9]/g, ""),
        );
        const priceB = parseInt(
          (b.priceForTwo || "0").toString().replace(/[^0-9]/g, ""),
        );
        return priceA - priceB;
      });
    }
    setFilteredRestaurants(filtered);
  };

  const handleToggleFavourite = async (e, shopId) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleFavouriteLocal(shopId));
    try {
      await axios.patch(
        `${serverUrl}/api/favourite/toggle/${shopId}`,
        {},
        { withCredentials: true },
      );
    } catch {
      dispatch(toggleFavouriteLocal(shopId)); // revert on error
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <Nav onSearch={setSearchTerm} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-linear-to-r from-orange-500 to-orange-600 rounded-2xl p-6 mb-8 text-white">
          <h1 className="text-2xl lg:text-3xl font-bold mb-2">
            Hello, {userData?.fullname?.split(" ")[0] || "Foodie"}! 👋
          </h1>
          <p className="text-orange-100">What would you like to order today?</p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${activeFilter === "all" ? "bg-orange-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
          >
            All Restaurants
          </button>
          <button
            onClick={() => setActiveFilter("rating")}
            className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${activeFilter === "rating" ? "bg-orange-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
          >
            <FiTrendingUp /> Top Rated
          </button>
          <button
            onClick={() => setActiveFilter("delivery")}
            className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${activeFilter === "delivery" ? "bg-orange-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
          >
            <FiClock /> Fast Delivery
          </button>
          <button
            onClick={() => setActiveFilter("price")}
            className={`flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${activeFilter === "price" ? "bg-orange-500 text-white" : "bg-white text-gray-700 hover:bg-gray-100"}`}
          >
            <FiDollarSign /> Low to High
          </button>
          <button className="flex items-center gap-1 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-white text-gray-700 hover:bg-gray-100">
            <FiFilter /> Filters
          </button>
        </div>

        {/* Restaurant Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No restaurants found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredRestaurants.map((restaurant) => {
              const isClosed = !restaurant.isOpen;
              return (
                <div
                  key={restaurant._id}
                  className={`group bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 flex flex-col ${isClosed ? "opacity-75" : "hover:shadow-lg"}`}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={
                        restaurant.image ||
                        "https://via.placeholder.com/300x200"
                      }
                      alt={restaurant.name}
                      className={`w-full h-full object-cover transition-transform duration-300 ${isClosed ? "grayscale opacity-60" : "group-hover:scale-105"}`}
                    />
                    <button
                      className="absolute top-2 right-2 p-1.5 bg-white rounded-full shadow-md hover:bg-red-50 transition"
                      onClick={(e) => handleToggleFavourite(e, restaurant._id)}
                    >
                      <FiHeart
                        className={
                          favourites.includes(restaurant._id)
                            ? "fill-red-500 text-red-500"
                            : "text-gray-500 hover:text-red-500"
                        }
                      />
                    </button>
                    {isClosed && (
                      <span className="absolute bottom-2 left-2 text-white text-xs font-bold px-3 py-1 bg-red-600 rounded-full">
                        🚫 Closed Now
                      </span>
                    )}
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-1">
                      <h3
                        className={`font-bold text-lg ${isClosed ? "text-gray-500" : "text-gray-800 group-hover:text-orange-500"} transition`}
                      >
                        {restaurant.name}
                      </h3>
                      <div className="flex items-center gap-1 bg-green-100 px-2 py-0.5 rounded text-sm font-semibold text-green-700">
                        <FiStar className="fill-current text-xs" />
                        <span>{restaurant.rating || "New"}</span>
                      </div>
                    </div>

                    <p
                      className={`text-sm mb-2 line-clamp-1 ${isClosed ? "text-gray-400" : "text-gray-500"}`}
                    >
                      {restaurant.cuisine || "Various"}
                    </p>

                    <div
                      className={`flex justify-between items-center text-sm ${isClosed ? "text-gray-400" : "text-gray-600"}`}
                    >
                      <span>₹{restaurant.priceForTwo || "200"} for two</span>
                      <div className="flex items-center gap-1">
                        <FiClock className="text-gray-400" />
                        <span>{restaurant.deliveryTime || "30"} min</span>
                      </div>
                    </div>

                    <div className="mt-auto pt-4">
                      {isClosed ? (
                        <button
                          className="w-full py-2 bg-gray-300 text-gray-500 rounded-lg font-semibold cursor-not-allowed"
                          disabled
                        >
                          Currently Closed
                        </button>
                      ) : (
                        <Link to={`/restaurant/${restaurant._id}`}>
                          <button className="w-full py-2 bg-orange-500 text-white rounded-lg font-semibold hover:bg-orange-600 hover:cursor-pointer transition">
                            Order Now
                          </button>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default UserDashboard;