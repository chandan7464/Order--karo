import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      trim: true,
      required: true,
    },
    mobile: {
      type: String,
      trim: true,
      required: true,
      validate: {
        validator: function (mobile) {
          return validator.isMobilePhone(mobile, "en-IN");
        },
        message: "Invalid Mobile Number",
      },
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "owner", "admin", "rider"],
      trim: true,
      required: true,
    },
    otp: {
      type: String,
    },
    otpExpiresAt: {
      type: Date,
    },
    isOtpVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);

export default User;
