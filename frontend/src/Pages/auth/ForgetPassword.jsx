import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaRegEye } from "react-icons/fa";
import { FaRegEyeSlash } from "react-icons/fa";
import axios from "axios";
import { serverUrl } from "../../constants/constant";

const ForgetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      const response = await axios.post(
        `${serverUrl}/api/auth/send-otp`,
        {
          email,
        },
        { withCredential: true },
      );
      console.log("response:", response);
      setStep(2);
    } catch (error) {
      console.log(error);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(
        `${serverUrl}/api/auth/verify-otp`,
        {
          email,
          otp,
        },
        { withCredential: true },
      );
      console.log("response:", response);
      setStep(3);
    } catch (error) {
      console.log(error);
    }
  };

  const handleResetPassword = async () => {
    try {
      if (newPassword !== confirmPassword) {
        return alert("Password Mismatch");
      }

      const response = await axios.post(
        `${serverUrl}/api/auth/reset-password`,
        {
          email,
          newPassword,
        },
        { withCredential: true },
      );
      console.log("response:", response);
      navigate("/login", { replace: true });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-orange-50 px-4 py-6">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        {step === 1 && (
          <div>
            <h1 className="text-2xl flex items-center gap-16 font-bold text-center text-orange-600 mb-6">
              <Link to="/login" className="text-orange-600">
                <IoIosArrowRoundBack size={36} />
              </Link>
              Forget Password
            </h1>

            <div className="mb-5">
              <label
                htmlFor="email"
                className="block text-md font-semibold text-gray-800 mb-3"
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

            <button
              type="button"
              className="w-full mt-3 bg-orange-600 text-white font-semibold py-3 rounded-lg hover:bg-orange-700 hover:cursor-pointer transition-all duration-300"
              onClick={handleSendOtp}
            >
              Send OTP
            </button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="text-2xl font-bold text-center text-orange-600 mb-6">
              OTP Verification
            </h1>

            <div className="mb-5">
              <label
                htmlFor="otp"
                className="block text-md font-semibold text-gray-800 mb-3"
              >
                Enter OTP<sup className="text-orange-600 text-[16px]">*</sup>
              </label>
              <input
                type="text"
                id="otp"
                name="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6 digit OTP"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none  focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                required
              />
            </div>

            <button
              type="button"
              className="w-full mt-3 bg-orange-600 text-white font-semibold py-3 rounded-lg hover:bg-orange-700 hover:cursor-pointer transition-all duration-300"
              onClick={handleVerifyOtp}
            >
              Verify OTP
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="text-2xl font-bold text-center text-orange-600 mb-6">
              Reset Password
            </h1>

            <div className="mb-4">
              <label
                htmlFor="newPassword"
                className="block text-sm font-semibold text-gray-800 mb-2"
              >
                New Password
                <sup className="text-orange-600 text-[16px]">*</sup>
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  id="newPassword"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter password (min 6 characters)"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none  focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute top-[50%] right-3 translate-[-50%] cursor-pointer"
                >
                  {showNewPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-gray-800 mb-2"
              >
                Confirm Password
                <sup className="text-orange-600 text-[16px]">*</sup>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Enter password (min 6 characters)"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-sm focus:outline-none  focus:border-orange-600 focus:ring-2 focus:ring-orange-200 transition-all duration-300"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute top-[50%] right-3 translate-[-50%] cursor-pointer"
                >
                  {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                </button>
              </div>
            </div>

            <button
              type="button"
              className="w-full mt-3 bg-orange-600 text-white font-semibold py-3 rounded-lg hover:bg-orange-700 hover:cursor-pointer transition-all duration-300"
              onClick={handleResetPassword}
            >
              Reset Password
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgetPassword;