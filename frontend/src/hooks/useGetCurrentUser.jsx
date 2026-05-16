import { useEffect } from "react";
import axios from "axios";
import { serverUrl } from "../constants/constant";
import { useDispatch } from "react-redux";
import { setUserData, setLoading } from "../redux/userSlice"; // ← fixed name

const useGetCurrentUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const { data } = await axios.get(`${serverUrl}/api/user/current`, {
          withCredentials: true,
        });
        console.log("data:", data);
        dispatch(setUserData(data));
      } catch (error) {
        dispatch(setUserData(null));  // ← fixed brackets
        dispatch(setLoading(false));  // ← fixed name
      }
    };

    getCurrentUser(); // ← was missing, hook never actually ran
  }, []); // ← was missing
};

export default useGetCurrentUser;