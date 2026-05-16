import React from "react";
import UserDashboard from "../components/UserDashboard";
import AdminDashboard from "../components/AdminDashboard";
import RiderDashboard from "../components/RiderDashboard";
import OwnerDashboard from "../components/OwnerDashboard";
import { useSelector } from "react-redux";
import Nav from "../components/Nav";

const Home = () => {
  const userData = useSelector((state) => state.user.userData);

  return (
    <div className="w-full min-h-screen ">
      {userData?.role === "user" && <Nav />}
      {userData?.role === "user" && <UserDashboard />}

      {userData?.role === "admin" && <AdminDashboard />}
      {userData?.role === "rider" && <RiderDashboard />}
      {userData?.role === "owner" && <OwnerDashboard />}
    </div>
  );
};

export default Home;