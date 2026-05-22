import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../constants/constant";
import { useDispatch } from "react-redux";
import { setUserData, setLoading, setFavourites } from "../redux/userSlice";

const useGetCurrentUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/api/user/current`, {
          withCredentials: true,
        });
        dispatch(setUserData(data));
        dispatch(setFavourites((data.favourites || []).map((id) => id.toString())));
      } catch (error) {
        // console.log(error.response.data)
        dispatch(setUserData(null));
        dispatch(setLoading(false)); // error pe bhi loading false karo
      }
    };

    getCurrentUser();
  }, []);
};

export default useGetCurrentUser;