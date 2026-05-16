import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

// Auth Pages
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ForgetPassword from "./pages/ForgetPassword";

// App Pages
import Home from "./pages/Home";

// Shop Pages
import MyShops from "./pages/shop/MyShops";
import CreateShop from "./pages/shop/CreateShop";
import EditShop from "./pages/shop/EditShop";
import ShopDetails from "./pages/shop/ShopDetails";

// Item Pages
import CreateItem from "./pages/item/CreateItem";
import EditItem from "./pages/item/EditItem";

// Orders Page
import Orders from "./pages/orders/Orders";

// OrderHistory Page
import OrderHistory from "./pages/orders/OrderHistory";

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

const App = () => {
  useGetCurrentUser();
  useGetCity();
  useGetMyShop();
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

        {/* Owner Only Routes */}
        <Route element={<OwnerRoute />}>
          <Route element={<OwnerDashboard />}>
            {/* Dashboard pages */}
            <Route path="/dashboard/create-shop" element={<CreateShop />} />
            <Route path="/dashboard/orders" element={<Orders />} />
            <Route path="/dashboard/my-shops" element={<MyShops />} />
            <Route path="/dashboard/shop/:shopId" element={<ShopDetails />} />
            <Route path="/dashboard/order-history" element={<OrderHistory />} />
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