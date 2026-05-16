import { useState } from "react";
import { Link,useNavigate } from "react-router-dom";
import { validRoles,serverUrl } from "../constants/constant";
import { FcGoogle } from "react-icons/fc";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import axios from "axios";
import {signInWithPopup} from "firebase/auth";
import {provider,auth} from "../../firebase"

const Signup = () => {
  const [role, setRole] = useState("user");
  const [showPassword, setShowPassword] = useState(false);
  const [fullname, setFullname] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate()

  const handleSignupForm = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${serverUrl}/api/auth/register`,
        {
          fullname,
          email,
          mobile,
          password,
          role,
        },
        { withCredential: true },
      );

      console.log("response:",response);
      navigate("/login",{replace:true})
      
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoogleAuthSignup = async () => {
    try {
          if(!mobile)
          {
            return alert("Please enter mobile number first");
          }
          
          const result = await signInWithPopup(auth,provider);
          const {data} = await axios.post(`${serverUrl}/api/auth/google-auth-signup`,{
            fullname: result?.user?.displayName,
            email:result?.user?.email,
            mobile,
            role
          },{withCredentials: true});

          console.log("data:",data);
    } catch (error) {
        console.log("Google Signup Error:",error?.response?.data?.message);
        console.log("Full Error Data:", error.response?.data);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 px-4 py-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-orange-600 mb-2">
          Order Karo
        </h1>
        <h2 className="text-center text-gray-600 text-sm font-bold mb-6">
          Create Account - Sign Up
        </h2>

        <form className="space-y-5" onSubmit={handleSignupForm}>
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullname"
              className="block text-sm font-semibold text-gray-800 mb-2"
            >
              Full Name<sup className="text-orange-600 text-[16px]">*</sup>
            </label>
            <input
              type="text"
              id="fullname"
              name="fullname"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
              required
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label
              htmlFor="mobile"
              className="block text-sm font-semibold text-gray-800 mb-2"
            >
              Mobile Number<sup className="text-orange-600 text-[16px]">*</sup>
            </label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="Enter 10 digit mobile number"
              maxLength="10"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
              required
            />
          </div>

          {/* Email */}
          <div>
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
            className="w-full mt-2 bg-orange-600 text-white font-semibold py-3 rounded-lg hover:bg-orange-700 hover:cursor-pointer transition-all duration-300"
          >
            Sign Up
          </button>

          <button
            type="button"
            className="w-full bg-white border-2 border-gray-300 text-gray-700 font-semibold py-3 rounded-lg transition-all duration-300 flex justify-center items-center gap-2 hover:cursor-pointer hover:bg-gray-200"
            onClick={handleGoogleAuthSignup}
          >
            <FcGoogle size={25} /> <span>Signup with Google</span>
          </button>
        </form>

        <p className="text-center text-gray-700 text-sm mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-orange-600 font-semibold hover:text-orange-700 transition-colors"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;