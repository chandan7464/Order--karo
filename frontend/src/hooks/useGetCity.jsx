import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setAddress, setCity, setState } from "../redux/userSlice";
import axios from "axios";

const useGetCity = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.userData);

  useEffect(() => {
    if (!userData) return; // guard
    navigator.geolocation.getCurrentPosition(async (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const apiKey = import.meta.env.VITE_GEOAPIFY_APIKEY;

      const { data } = await axios.get(
        `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&format=json&apiKey=${apiKey}`,
      );

      const { state, city, address_line1, address_line2 } = data?.results[0];
      dispatch(setCity(city));
      dispatch(setState(state));
      dispatch(setAddress(address_line1 + " " + address_line2));
    });
  }, [userData]);
};

export default useGetCity;

