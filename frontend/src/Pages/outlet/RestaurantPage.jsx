import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  FiArrowLeft,
  FiStar,
  FiClock,
  FiMapPin,
  FiPlus,
  FiMinus,
  FiAlertTriangle,
} from "react-icons/fi";
import {
  addToCart,
  removeFromCart,
  confirmClearAndAdd,
  dismissConflict,
  selectCartItems,
  selectPendingItem,
  selectCartRestaurantName,
  selectTotalItems,
  selectTotalPrice,
} from "../../redux/cartSlice";
import Nav from "../../components/Nav";

// ─── Conflict Popup ───────────────────────────────────────────
const ConflictModal = ({ pendingItem, currentRestaurantName }) => {
  const dispatch = useDispatch();
  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0"
      style={{ background: "rgba(0,0,0,0.4)" }}
    >
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
            <FiAlertTriangle size={18} className="text-orange-500" />
          </div>
          <h3 className="font-bold text-gray-800">Start new cart?</h3>
        </div>
        <p className="text-sm text-gray-500 mb-5 leading-relaxed">
          You have items from{" "}
          <span className="font-semibold text-gray-700">
            {currentRestaurantName}
          </span>
          . Adding from{" "}
          <span className="font-semibold text-gray-700">
            {pendingItem.restaurantName}
          </span>{" "}
          will clear your current cart.
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => dispatch(dismissConflict())}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition"
          >
            Keep Cart
          </button>
          <button
            onClick={() => dispatch(confirmClearAndAdd())}
            className="flex-1 py-2.5 rounded-xl bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition"
          >
            Clear & Add
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Main Page ────────────────────────────────────────────────
const RestaurantPage = () => {
  const { restaurantId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux store se restaurant data
  const restaurant = useSelector((state) =>
    state.user.shopInMyCity?.find((shop) => shop._id === restaurantId),
  );

  // Cart state from Redux
  const cartItems = useSelector(selectCartItems);
  const pendingItem = useSelector(selectPendingItem);
  const cartRestName = useSelector(selectCartRestaurantName);
  const totalItems = useSelector(selectTotalItems);
  const totalPrice = useSelector(selectTotalPrice);

  // Sirf role=user ke liye cart dikhao
  const isUser = useSelector((state) => state.user.userData?.role === "user");

  const items = restaurant?.items || [];

  // Quantity Calculator Helper Function
  const getQty = (itemId) =>
    cartItems.find((i) => i._id === itemId)?.quantity || 0;

  const handleAdd = (item) => {
    dispatch(
      addToCart({ item, restaurantId, restaurantName: restaurant.name }),
    );
  };

  const handleRemove = (itemId) => {
    dispatch(removeFromCart(itemId));
  };

  // if Restauran not found
  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 text-lg font-semibold">
          Restaurant not found.
        </p>
        <button
          onClick={() => navigate(-1)}
          className="text-orange-500 font-bold underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      <Nav />

      {/* Conflict popup — show in case of pendingItem  */}
      {pendingItem && (
        <ConflictModal
          pendingItem={pendingItem}
          currentRestaurantName={cartRestName}
        />
      )}

      {/* Restaurant Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-5">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-orange-600 hover:text-orange-700 transition mb-4 text-md font-medium"
          >
            <FiArrowLeft size={22} /> Back
          </button>

          <div className="flex gap-4 items-start">
            {restaurant.image && (
              <img
                src={restaurant.image}
                alt={restaurant.name}
                onError={(e) => (e.target.src = "/placeholder.png")}
                className="w-20 h-20 rounded-xl object-cover shrink-0"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-800">
                  {restaurant.name}
                </h1>
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    restaurant.isOpen
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {restaurant.isOpen ? "Open" : "Closed"}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-2">
                {restaurant.cuisine || "Various Cuisines"}
              </p>
              <div className="flex items-center gap-4 text-sm flex-wrap">
                {restaurant.rating && (
                  <span className="flex items-center gap-1 bg-green-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                    <FiStar size={10} className="fill-current" />
                    {restaurant.rating}
                  </span>
                )}
                <span className="flex items-center gap-1 text-gray-500">
                  <FiClock size={13} /> {restaurant.deliveryTime || "30"} min
                </span>
                <span className="text-gray-500">
                  ₹{restaurant.priceForTwo || "200"} for two
                </span>
                {restaurant.address && (
                  <span className="flex items-center gap-1 text-gray-500">
                    <FiMapPin size={13} /> {restaurant.address}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          Menu <span className="text-orange-500">({items.length})</span>
        </h2>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              No items available right now.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {items.map((item) => {
              const qty = getQty(item._id);
              return (
                <div
                  key={item._id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition flex overflow-hidden"
                >
                  {item.image && (
                    <div className="w-28 h-28 shrink-0 bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.name}
                        onError={(e) => (e.target.src = "/placeholder.png")}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-4 flex flex-1 items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-gray-800 text-base truncate">
                        {item.name}
                      </h3>
                      {item.description && (
                        <p className="text-xs text-gray-400 line-clamp-2 mt-0.5">
                          {item.description}
                        </p>
                      )}
                      {item.category && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {item.category}
                        </p>
                      )}
                      <p className="text-orange-500 font-bold mt-1">
                        ₹{item.price}
                      </p>
                    </div>

                    {/* Cart controls — sirf isUser ke liye */}
                    {isUser && (
                      <div className="shrink-0">
                        {!restaurant.isOpen ? (
                          <span className="text-xs text-gray-400 font-medium">
                            Unavailable
                          </span>
                        ) : qty > 0 ? (
                          <div className="flex items-center gap-2 border border-orange-400 rounded-lg overflow-hidden">
                            <button
                              onClick={() => handleRemove(item._id)}
                              className="px-2.5 py-1.5 bg-orange-50 text-orange-500 hover:bg-orange-100 hover:cursor-pointer transition"
                            >
                              <FiMinus size={14} />
                            </button>
                            <span className="text-sm font-bold text-gray-700 w-5 text-center">
                              {qty}
                            </span>
                            <button
                              onClick={() => handleAdd(item)}
                              className="px-2.5 py-1.5 bg-orange-50 text-orange-500 hover:bg-orange-100 hover:cursor-pointer transition"
                            >
                              <FiPlus size={14} />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleAdd(item)}
                            className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 hover:cursor-pointer transition"
                          >
                            <FiPlus size={13} /> Add
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default RestaurantPage;