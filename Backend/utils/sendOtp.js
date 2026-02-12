const nodemailer = require("nodemailer");

exports.sendOtp = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "HireHelper OTP Verification",
    text: `Your OTP is ${otp}`
  });
};
