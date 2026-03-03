const nodemailer = require("nodemailer");
 
exports.sendOtp = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,          // ✅ Use 587
    secure: false,      // ✅ Must be false for 587
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false   // ✅ Fix SSL issue (dev only)
    }
  });
 
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: "HireHelper OTP Verification",
    text: `Your OTP is ${otp}`
  });
};
 