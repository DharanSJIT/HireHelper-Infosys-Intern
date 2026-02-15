const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddlewares");

const {
  register,
  verifyOtp,
  login,
  getProfile,
  updateProfilePicture,
  resendOtp,
  forgotPassword,
  resetPassword,
} = require("../Controllers/authController");

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);
router.put("/profile-picture", authMiddleware, updateProfilePicture);
router.post("/resend-otp", resendOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
