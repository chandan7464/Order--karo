import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setShopInMyCity } from "../redux/userSlice";
import axios from "axios";
import { serverUrl } from "../constants/constant";

const useGetShopInMyCity = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);

  useEffect(() => {
    if (!userData) return; // guard

    const fetchAllShops = async () => {
      try {
        const { data } = await axios.get(
          `${serverUrl}/api/shop/get-all-shops`,
          {
            withCredentials: true,
          },
        );
        dispatch(setShopInMyCity(data?.shops));
      } catch (error) {
        console.error("Error fetching all shops:", error);
      }
    };

    fetchAllShops();
  }, [userData, dispatch]);
};

export default useGetShopInMyCity;