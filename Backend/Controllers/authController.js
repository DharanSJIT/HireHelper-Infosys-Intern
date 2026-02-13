const User = require("../Models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateOtp } = require("../utils/generateOtp");
const { sendOtp } = require("../utils/sendOtp");

exports.register = async (req, res) => {
    try {
        const { first_name, last_name, email_id, password } = req.body;
        const existingUser = await User.findOne({ email_id });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOtp();

        await User.create({
            first_name,
            last_name,
            email_id,
            password: hashedPassword,
            otp,
            otpExpiry: Date.now() + 5 * 60 * 1000
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

        if (!user)
            return res.status(404).json({ message: "User not found" });

        if (user.otp !== otp || user.otpExpiry < Date.now())
            return res.status(400).json({ message: "Invalid or expired OTP" });

        user.isVerified = true;
        user.otp = null;
        user.otpExpiry = null;

        await user.save();

        res.json({ message: "Account verified successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email_id, password } = req.body;

        const user = User.findOne({ email_id });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.isVerified)
            return res.status(400).json({ message: "Please verify your email first" });

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch){
            return res.status(400).json({message:"Invalid credentials"});
        }

        const token = jwt.sign(
            {id:user._id},
            process.env.JWT_SECRET,
            {expiresIn : "7d"}
        );

        res.json({token});
    }catch(error){
        res.status(500).json({ error: error.message });
    }
};