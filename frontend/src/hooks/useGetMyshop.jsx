import { useDispatch, useSelector } from "react-redux";
import { serverUrl } from "../constants/constant";
import axios from "axios";
import { setShopData } from "../redux/shopSlice";
import { useEffect } from "react";

const useGetMyShop = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);

  useEffect(() => {
    if (!userData) return; // guard

    const fetchShops = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/api/shop/get-my-shop`, {
          withCredentials: true,
        });
        console.log("data:", data);
        dispatch(setShopData(data?.shops));
      } catch (error) {
        console.log("fetch shop error:", error.response.data);
      }
    };

    fetchShops();
  }, [userData]);
};

export default useGetMyShop;