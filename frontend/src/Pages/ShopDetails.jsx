import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../constants/constant";

const ShopDetails = () => {
  const { shopId } = useParams();
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/api/shops/${shopId}`);
        setShop(data);
      } catch (error) {
        console.log("Fetch shop details error:", error?.response?.data || error.message);
        setShop(null);
      } finally {
        setLoading(false);
      }
    };

    if (shopId) fetchShop();
  }, [shopId]);

  if (loading) {
    return <div className="p-6 text-orange-600 font-semibold">Loading menu...</div>;
  }

  if (!shop) {
    return (
      <div className="p-6">
        <p className="text-gray-700 font-semibold">Shop not found.</p>
        <Link to="/" className="text-orange-600 font-semibold underline">
          Back to restaurants
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        <Link to="/" className="text-orange-600 font-semibold">
          ← Back
        </Link>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mt-4">
          <div className="h-52 w-full">
            <img
              src={shop.image || "https://placehold.co/1200x400?text=Restaurant"}
              alt={shop.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-5">
            <h1 className="text-2xl font-bold text-gray-900">{shop.name}</h1>
            <p className="text-sm text-gray-600 mt-1">
              {shop.address}, {shop.city}, {shop.state}
            </p>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="text-lg font-bold text-gray-900 mb-3">Menu</h2>
          {!shop.items?.length ? (
            <div className="bg-white border border-gray-200 rounded-xl p-5 text-gray-600">
              No items added yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {shop.items.map((item) => (
                <div
                  key={item._id}
                  className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm"
                >
                  <img
                    src={item.image || "https://placehold.co/600x400?text=Food"}
                    alt={item.name}
                    className="w-full h-36 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{item.category}</p>
                      </div>
                      <p className="font-bold text-orange-600">₹{item.price}</p>
                    </div>

                    <button
                      type="button"
                      className="mt-4 w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 rounded-lg transition"
                      onClick={() => alert("Cart will be added next")}
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopDetails;

