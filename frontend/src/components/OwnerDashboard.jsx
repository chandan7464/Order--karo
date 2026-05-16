import React, { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiShoppingBag,
  FiMenu,
  FiClock,
  FiHome,
  FiHelpCircle,
  FiLogOut,
} from "react-icons/fi";
import { serverUrl } from "../constants/constant";
import { clearShopState, setShopData } from "../redux/shopSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setCity, setUserData } from "../redux/userSlice";

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await axios.get(`${serverUrl}/api/auth/logout`, {
        withCredentials: true,
      });

      dispatch(setUserData(null));
      dispatch(setCity(null));
      dispatch(setShopData(null));
      dispatch(clearShopState());
      navigate("/login", { replace: true });
    } catch (error) {
      console.log("Logout Error:", error.response?.data || error.message);
    }
  };

  return (
    <div className="h-screen overflow-hidden bg-linear-to-br from-emerald-100 via-sky-100 to-slate-100">
      <div className="flex h-full w-full overflow-hidden bg-white">
        <aside className="h-screen w-64 shrink-0 overflow-y-auto border-r border-slate-200 bg-white">
          <div className="px-8 py-7">
            <h1 className="text-3xl font-black tracking-tight text-orange-600">
              Order Karo
            </h1>
            <p className="mt-1 text-xs font-medium text-slate-500">
              Restaurant Partner
            </p>
          </div>

          {/* sidebar routes change*/}
          <div className="space-y-1 px-4">
            <NavLink
              to="/dashboard/my-shops"
              className={({ isActive }) =>
                `flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                  isActive
                    ? "bg-orange-50 text-orange-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <FiHome className="text-xl" />
              My Shops
            </NavLink>

            <NavLink
              to="/dashboard/create-shop"
              className={({ isActive }) =>
                `flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                  isActive
                    ? "bg-orange-50 text-orange-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <FiHome className="text-xl" />
              Create Shop
            </NavLink>

            <NavLink
              to="/dashboard/orders"
              className={({ isActive }) =>
                `flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                  isActive
                    ? "bg-orange-50 text-orange-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <FiShoppingBag className="text-xl" />
              Orders
            </NavLink>

            <NavLink
              to="/dashboard/order-history"
              className={({ isActive }) =>
                `flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                  isActive
                    ? "bg-orange-50 text-orange-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <FiClock className="text-xl" />
              Order history
            </NavLink>

            <NavLink
              to="/dashboard/help"
              className={({ isActive }) =>
                `flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left text-sm font-semibold transition ${
                  isActive
                    ? "bg-orange-50 text-orange-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`
              }
            >
              <FiHelpCircle className="text-xl" />
              Help Center
            </NavLink>
          </div>

          <div className="mt-8 px-4">
            <button
              className="flex w-full items-center gap-4 rounded-2xl px-4 py-3 text-left text-sm font-semibold text-slate-600 transition hover:cursor-pointer hover:bg-red-50 hover:text-red-600"
              onClick={handleLogout}
            >
              <FiLogOut className="text-xl" />
              Logout
            </button>
          </div>
        </aside>

        <section className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden bg-slate-50">
          <main className="flex min-h-0 flex-1 flex-col overflow-hidden ">
            <div className="min-h-0 flex-1 space-y-5 overflow-y-auto ">
              <Outlet />
            </div>
          </main>
        </section>
      </div>
    </div>
  );
};

export default OwnerDashboard;