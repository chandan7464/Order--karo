import React from "react";
import UserDashboard from "../../components/UserDashboard";
import AdminDashboard from "../../components/AdminDashboard";
import RiderDashboard from "../../components/RiderDashboard";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Home = () => {
  const userData = useSelector((state) => state.user.userData);

  if (userData?.role === "owner") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="w-full min-h-screen">
      {userData?.role === "user" && <UserDashboard />}
      {userData?.role === "admin" && <AdminDashboard />}
      {userData?.role === "rider" && <RiderDashboard />}
    </div>
  );
};

export default Home;