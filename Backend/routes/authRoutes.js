const express = require("express");
const router = express.Router();

const {register,verifyOtp} = require("../Controllers/authController");

router.post("/register",register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);

module.exports = router;