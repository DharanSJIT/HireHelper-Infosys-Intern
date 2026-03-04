const User = require("../Models/User");
const Task = require("../Models/Task");
const Request = require("../Models/Request");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateOtp } = require("../utils/generateOtp");
const { sendOtp } = require("../utils/sendOtp");
const cloudinary = require("../config/cloudinary");
const { validatePassword } = require("../utils/validatePassword");

exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email_id, password } = req.body;
    const existingUser = await User.findOne({ email_id });

    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({
          success: false,
          message: "User already exists",
        });
      } else {
        const otp = generateOtp();
        const hashedOtp = await bcrypt.hash(otp, 10);

        existingUser.otp = hashedOtp;
        existingUser.otpExpiry = Date.now() + 5 * 60 * 1000;

        await existingUser.save();
        await sendOtp(email_id, otp);

        return res.status(200).json({
          success: true,
          message: "OTP resent. Please verify your account.",
        });
      }
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        message:
          "Password must contain uppercase, lowercase, number, special character and minimum 8 characters",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    await User.create({
      first_name,
      last_name,
      email_id,
      password: hashedPassword,
      otp: hashedOtp,
      otpExpiry: Date.now() + 5 * 60 * 1000,
    });

    await sendOtp(email_id, otp);

    res.status(201).json({ message: "User registered. OTP sent to email." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email_id, otp } = req.body;
    const user = await User.findOne({ email_id });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.otp) {
      return res.status(400).json({ message: "No OTP found" });
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

    res.json({ message: "Account verified successfully", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email_id, password } = req.body;

    const user = await User.findOne({ email_id });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Email not verified",
        email: user.email_id,
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
      message: "Login successful",
      token,
      user: {
        id: user._id,
        first_name: user.first_name,
        email_id: user.email_id,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.resendOtp = async (req, res) => {
  try {
    const { email_id } = req.body;

    const user = await User.findOne({ email_id });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.otp = hashedOtp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    await sendOtp(email_id, otp);

    res.json({ message: "OTP resent successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email_id } = req.body;

    const user = await User.findOne({ email_id });

    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, 10);

    user.otp = hashedOtp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;

    await user.save();

    await sendOtp(email_id, otp);

    res.json({ message: "Password reset OTP sent to email" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email_id, otp, newPassword } = req.body;

    const user = await User.findOne({ email_id });

    if (!user) return res.status(404).json({ message: "User not found" });

    if (!user.otp) {
      return res.status(400).json({ message: "No OTP found" });
    }

    const isValidOtp = await bcrypt.compare(otp, user.otp);
    if (!isValidOtp || user.otpExpiry < Date.now())
      return res.status(400).json({ message: "Invalid or expired OTP" });

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

    res.json({ message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password -otp -otpExpiry")
      .lean();
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const [tasksPosted, tasksCompleted, requestsSent] = await Promise.all([
      Task.countDocuments({ createdBy: req.user.id }),
      Task.countDocuments({
        createdBy: req.user.id,
        status: "completed",
      }),
      Request.countDocuments({ requestedBy: req.user.id }),
    ]);

    res.json({
      ...user,
      stats: {
        tasksPosted,
        tasksCompleted,
        requestsSent,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfilePicture = async (req, res) => {
  try {
    const { profilePicture } = req.body;

    const uploadResult = await cloudinary.uploader.upload(profilePicture, {
      folder: "hirehelper/profiles",
      transformation: [
        { width: 500, height: 500, crop: "fill" },
        { quality: "auto" },
      ],
    });

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: uploadResult.secure_url },
      { new: true },
    ).select("-password -otp -otpExpiry");

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
