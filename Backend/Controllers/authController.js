const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendOtpToUser = require("../utils/sendOtpToUser");
const { validatePassword } = require("../utils/validatePassword");

/* ================= REGISTER ================= */

exports.register = async (req, res) => {
  try {
    const { first_name, last_name, phone_number, email_id, password } =
      req.body;

    if (!phone_number) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required",
      });
    }

    const normalizedEmail = email_id.toLowerCase().trim();
    const existingUser = await User.findOne({ email_id : normalizedEmail });

    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      }

      await sendOtpToUser(existingUser, email_id);

      return res.json({
        success: true,
        message: "OTP resent. Please verify account",
        redirectToVerify: true,
        email: email_id,
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          "Password must contain uppercase, lowercase, number, special character and minimum 8 characters",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      first_name,
      last_name,
      phone_number,
      email_id,
      password: hashedPassword,
      isVerified: false,
    });

    await sendOtpToUser(user, email_id);

    res.status(201).json({
      success: true,
      message: "User registered. OTP sent",
      redirectToVerify: true,
      email: email_id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= VERIFY OTP ================= */

exports.verifyOtp = async (req, res) => {
  try {
    const { email_id, otp } = req.body;

    const user = await User.findOne({ email_id });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.otp) {
      return res.status(400).json({
        success: false,
        message: "No OTP found. Please request a new OTP.",
      });
    }

    const isValidOtp = await bcrypt.compare(otp, user.otp);

    if (!isValidOtp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email_id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      success: true,
      message: "Account verified successfully",
      token,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= LOGIN ================= */

exports.login = async (req, res) => {
  try {
    const { email_id, password } = req.body;

    const user = await User.findOne({ email_id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isVerified) {
      await sendOtpToUser(user, email_id);

      return res.status(403).json({
        success: false,
        message: "Email not verified. New OTP sent.",
        redirectToVerify: true,
        email: email_id,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email_id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        email_id: user.email_id,
        phone_number: user.phone_number,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= RESEND OTP ================= */

exports.resendOtp = async (req, res) => {
  try {
    const { email_id } = req.body;

    const user = await User.findOne({ email_id });

    if (!user) return res.status(404).json({ message: "User not found" });

    await sendOtpToUser(user, email_id);

    res.json({
      success: true,
      message: "OTP resent successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= FORGOT PASSWORD ================= */

exports.forgotPassword = async (req, res) => {
  try {
    const { email_id } = req.body;

    const user = await User.findOne({ email_id });

    if (!user) return res.status(404).json({ message: "User not found" });

    await sendOtpToUser(user, email_id);

    res.json({
      success: true,
      message: "Password reset OTP sent",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= RESET PASSWORD ================= */

exports.resetPassword = async (req, res) => {
  try {
    const { email_id, otp, newPassword } = req.body;

    const user = await User.findOne({ email_id });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.otp) {
      return res.status(400).json({
        success: false,
        message: "No OTP found. Please request a new OTP.",
      });
    }
    const isValidOtp = await bcrypt.compare(otp, user.otp);

    if (!isValidOtp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if (!validatePassword(newPassword)) {
      return res.status(400).json({
        message:
          "Password must contain uppercase, lowercase, number, special character and minimum 8 characters",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    res.json({
      success: true,
      message: "Password reset successful",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
