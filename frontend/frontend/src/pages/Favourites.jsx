// pages/Favourites.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../constants/constant";
import { useNavigate } from "react-router-dom";

const Favourites = () => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/api/favourite`, {
          withCredentials: true,
        });
        setFavourites(data.favourites);
      } catch {
        setFavourites([]);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-xl font-bold text-gray-800 mb-4">My Favourites</h1>
      {favourites.length === 0 ? (
        <p className="text-gray-400 text-center mt-10">No favourites yet.</p>
      ) : (
        <div className="grid gap-4">
          {favourites.map((shop) => (
            <div
              key={shop._id}
              onClick={() => navigate(`/shop/${shop._id}`)}
              className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4 cursor-pointer hover:shadow-md transition"
            >
              <img
                src={shop.image}
                alt={shop.name}
                className="w-16 h-16 rounded-xl object-cover"
              />
              <div>
                <p className="font-bold text-gray-800">{shop.name}</p>
                <p className="text-sm text-gray-400">{shop.city}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favourites;
