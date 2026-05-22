import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Auth Pages
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import ForgetPassword from "./pages/auth/ForgetPassword";

// App Pages
import Home from "./pages/auth/Home";

// Shop Pages
import MyShops from "./pages/shop/MyShops";
import CreateShop from "./pages/shop/CreateShop";
import EditShop from "./pages/shop/EditShop";
import ShopDetails from "./pages/shop/ShopDetails";

// Item Pages
import CreateItem from "./pages/item/CreateItem";
import EditItem from "./pages/item/EditItem";

// Orders Page
import ShopOrders from "./pages/orders/ShopOrders";
import ShopOrderHistory from "./pages/orders/ShopOrderHistory";
import UserOrders from "./pages/orders/UserOrders";
import UserOrderHistory from "./pages/orders/UserOrderHistory";

// Outlet Page
import HelpCenter from "./pages/outlet/HelpCenter";

// Routes
import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";
import OwnerRoute from "./routes/OwnerRoutes";

// Hooks
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import useGetCity from "./hooks/useGetCity";
import useGetMyShop from "./hooks/useGetMyShop";

import OwnerDashboard from "./components/OwnerDashboard";
import useGetShopInMyCity from "./hooks/useGetShopInMyCity";

// Restaurant Page
import RestaurantPage from "./pages/outlet/RestaurantPage";

// Cart Page
import CartPage from "./pages/cart/CartPage";
import Profile from "./pages/outlet/Profile";

// Favourites Page
import Favourites from "./pages/outlet/Favourites";

const App = () => {
  useGetCurrentUser();
  useGetCity();
  useGetMyShop();
  useGetShopInMyCity();
  const loading = useSelector((state) => state.user.loading);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-orange-600 text-xl font-bold">Loading...</p>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/restaurant/:restaurantId" element={<RestaurantPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-orders" element={<UserOrders />} />
        <Route path="/order-history" element={<UserOrderHistory />} />
        <Route path="/favourites" element={<Favourites />} />

        {/* Owner Only Routes */}
        <Route element={<OwnerRoute />}>
          <Route path="/dashboard" element={<OwnerDashboard />}>
            {/* Dashboard pages */}
            <Route path="/dashboard/create-shop" element={<CreateShop />} />
            <Route path="/dashboard/orders" element={<ShopOrders />} />
            <Route path="/dashboard/my-shops" element={<MyShops />} />
            <Route path="/dashboard/shop/:shopId" element={<ShopDetails />} />
            <Route
              path="/dashboard/order-history"
              element={<ShopOrderHistory />}
            />
            <Route path="/dashboard/help" element={<HelpCenter />} />

            <Route path="/dashboard/edit-shop/:shopId" element={<EditShop />} />
            <Route path="/dashboard/create-item" element={<CreateItem />} />
            <Route path="/dashboard/edit-item/:itemId" element={<EditItem />} />

            {/* Default redirect */}
            <Route
              index
              element={<Navigate to="/dashboard/my-shops" replace />}
            />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default App;