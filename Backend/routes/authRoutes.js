const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddlewares");

const {register,verifyOtp,login,getProfile} = require("../Controllers/authController");

router.post("/register",register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);

module.exports = router;