import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../constants/constant";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const city = useSelector((state) => state.user.city);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const query = city ? `?city=${encodeURIComponent(city)}` : "";
        const { data } = await axios.get(`${serverUrl}/api/shops${query}`);
        setShops(Array.isArray(data) ? data : []);
      } catch (error) {
        console.log("Fetch shops error:", error?.response?.data || error.message);
        setShops([]);
      } finally {
        setLoading(false);
      }
    };

    fetchShops();
  }, [city]);

  if (loading) {
    return <div className="p-6 text-orange-600 font-semibold">Loading restaurants...</div>;
  }

  if (!shops.length) {
    return (
      <div className="p-6 text-gray-600">
        No restaurants found for your area yet.
      </div>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {shops.map((shop) => (
        <div
          key={shop._id}
          className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition"
          onClick={() => navigate(`/shop/${shop._id}`)}
        >
          <img
            src={shop.image || "https://placehold.co/600x300?text=Restaurant"}
            alt={shop.name}
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-bold text-gray-800">{shop.name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {shop.address}, {shop.city}, {shop.state}
            </p>
            <p className="text-sm text-orange-600 mt-3 font-medium">
              {shop.items?.length || 0} items available
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserDashboard;
