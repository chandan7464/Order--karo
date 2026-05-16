import bcrypt from "bcrypt";
import User from "../model/user.model.js";
import validate from "../utils/validate.js";
import { generateToken } from "../utils/jwt.utils.js";
import { sendMail } from "../utils/mail.js";
import validator from "validator";

export const signup = async (req, res) => { 
  try {
    const { fullname, mobile, email, password, role } = req.body;

    const { isValid, errors } = validate(
      fullname,
      mobile,
      email,
      password,
      role,
    );

    if (!isValid) {
      return res.status(400).json({ errors });
    }

    let user = await User.findOne({ email });
    
    if (user) {
      return res.status(400).json({ message: "User Already Exist" });
    }

    // password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      fullname,
      mobile,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      message: "User Created Successfully",
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid Email" });
    }

    // password comparison
    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    if (role !== user.role) {
      return res.status(403).json({ message: "Unauthorized Role" });
    }

    const token = generateToken({ id: user._id, role: user.role });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax",
    });

    res.status(201).json({
      message: `${user.fullname} Login Successfully`,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged Out Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User does not Exist" });
    }

    // create 4-digit otp
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    user.otp = otp;
    user.otpExpiresAt = Date.now() + 5 * 60 * 1000;
    user.isOtpVerified = false;

    await user.save();
    await sendMail(user.email, otp);

    return res
      .status(200)
      .json({ message: "OTP send successfully on your registered email" });
  } catch (error) {
    res.status(500).json({ message: "send otp error", error });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ message: "User does not Exist" });

    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (user.otpExpiresAt < Date.now())
      return res.status(400).json({ message: "OTP Expired" });

    user.otp = undefined;
    user.otpExpiresAt = undefined;
    user.isOtpVerified = true;
    await user.save();

    return res.status(200).json({ message: "OTP Verified Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Verify otp error", error });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User does not Exist" });
    }

    if (!user.isOtpVerified) {
      return res.status(400).json({ message: "Invalid OTP Verification" });
    }

    if (
      !validator.isStrongPassword(newPassword, {
        minLength: 8,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
    ) {
      return res.status(400).json({
        message:
          "Invalid Password: Password Must container 1 uppercase,1 lowercase, 1 number and 1 symbol and minimum length is 8",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.isOtpVerified = false;
    await user.save();

    return res.status(201).json({ message: "Password Reset Successfully" });
  } catch (error) {
    res.status(500).json({ message: "Reset Password error", error });
  }
};

export const googleAuthSinup = async (req, res) => {
  try {
    const { fullname, email, mobile, role } = req.body;
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User Already Exist" });
    }

    user = await User.create({
      fullname,
      email,
      mobile,
      role,
    });

    return res.status(201).json({
      message: "User Created Successfully",
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "Google Auth Signup Error", error });
  }
};

export const googleAuthLogin = async (req, res) => {
  try {
    const { email, role } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Email" });
    }

    const token = await generateToken({ id: user._id, role: user.role });

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
      sameSite: "lax", // "lax"
    });

    return res.status(201).json({
      message: `${user.fullname} Login Successfully`,
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Google Auth Login Error", error });
  }
};
// html:<p>Your OTP for password reset is <b>otp</b>. IT expires in <b> 5 minutes</b>.</p>,
