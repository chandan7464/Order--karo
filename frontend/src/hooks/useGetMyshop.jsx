import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../constants/constant";
import axios from "axios";
import { setShopData } from "../redux/shopSlice";
import { useEffect } from "react";

const useGetMyShop = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);

  useEffect(() => {
    // FIX: sirf owner ke liye run karo
    if (!userData || userData.role !== "owner") return;

    const fetchShops = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/api/shop/get-my-shop`, {
          withCredentials: true,
        });
        dispatch(setShopData(data?.shops));
      } catch (error) {
        // FIX: error.response undefined ho sakta hai, crash rokha
        console.log("fetch shop error:", error.response?.data);
      }
    };

    fetchShops();
  }, [userData]);
};

export default useGetMyShop;