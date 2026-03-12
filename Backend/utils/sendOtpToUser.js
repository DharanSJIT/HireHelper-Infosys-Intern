const bcrypt = require("bcryptjs");
const { generateOtp } = require("./generateOtp");
const { sendOtp } = require("./sendOtp");

const sendOtpToUser = async (user, email_id) => {

  const otp = generateOtp();
  const hashedOtp = await bcrypt.hash(otp, 10);

  user.otp = hashedOtp;
  user.otpExpiry = Date.now() + 5 * 60 * 1000;

  await user.save();
  await sendOtp(email_id, otp);

};

module.exports = sendOtpToUser;