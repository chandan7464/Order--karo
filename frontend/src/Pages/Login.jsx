import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import { validRoles,serverUrl } from "../constants/constant";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {signInWithPopup} from "firebase/auth";
import {provider,auth} from "../../firebase";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

const Login = () => {
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const handleLoginForm = async (e) => {
    e.preventDefault();

     try {
      const {data} = await axios.post(
        `${serverUrl}/api/auth/login`,
        {
          email,          
          password,
          role,
        },
        { withCredentials: true }
      );
          
      dispatch(setUserData(data?.user));
      navigate("/",{replace:true});

    } catch (error) {
      console.log("SERVER SAYS:", error.response?.data);
    }
  };

   const handleGoogleAuthLogin = async () => {
    try {                   
          const result = await signInWithPopup(auth,provider);
          const {data} = await axios.post(`${serverUrl}/api/auth/google-auth-login`,{           
            email:result?.user?.email,            
            role
          },{withCredentials: true});
          dispatch(setUserData(data?.user));
          navigate("/",{replace:true});
    } catch (error) {
        console.log("Google Login Error:",error?.response?.data?.message);
        console.log("Full Error Data:", error.response?.data);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 px-4 py-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-orange-600 mb-2">
          Order Karo
        </h1>
        <h2 className="text-center text-gray-500 text-md font-bold mb-6">
          Login Here for Fresh Food Delievery
        </h2>

        <form className="space-y-1" onSubmit={handleLoginForm}>
          {/* Email */}
          <div className="mb-3">
            <label
              htmlFor="email"
              className="block text-sm font-semibold text-gray-800 mb-2"
            >
              Email ID <sup className="text-orange-600 text-[16px]">*</sup>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none  focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-gray-800 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (min 6 characters)"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none  focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-[50%] right-3 translate-[-50%] cursor-pointer"
              >
                {showPassword ? <FaRegEye /> : <FaRegEyeSlash />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <Link to="/forget-password" className="text-orange-600 font-bold">
              Forget Password
            </Link>
          </div>

          {/* Role Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              Select Role
            </label>
            <div className="grid grid-cols-3 gap-3">
              {validRoles.map((rol, idx) => {
                return (
                  <button
                    key={idx}
                    type="button"
                    className={`py-2 px-2 rounded-lg font-semibold text-md 
                                        transition-all duration-300 cursor-pointer
                                    
                                    ${
                                      role === rol
                                        ? "border-2 border-transparent bg-orange-600 text-gray-50 "
                                        : "border-2 border-gray-300 bg-white text-gray-700 hover:border-orange-600 hover:text-orange-600 "
                                    }
                                    `}
                    onClick={() => setRole(rol)}
                  >
                    {(rol === "user" && "👤") ||
                      (rol === "admin" && "🔐") ||
                      (rol === "rider" && "🚴")}{" "}
                    {rol}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-3 bg-orange-600 text-white font-semibold py-3 rounded-lg hover:bg-orange-700 hover:cursor-pointer transition-all duration-300"
          >
            Login
          </button>

          {/* Google Button */}
          <button
            type="button"
            className="w-full mt-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition-all duration-300 flex justify-center items-center gap-2 hover:cursor-pointer hover:bg-gray-200"
            onClick={handleGoogleAuthLogin}
          >
            <FcGoogle size={25} /> <span>Signup with Google</span>
          </button>
        </form>

        <p className="text-center text-gray-700 text-sm mt-4">
          Create an account?{" "}
          <Link
            to="/signup"
            className="text-orange-600 font-semibold hover:text-orange-700 transition-colors"
          >
            signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;