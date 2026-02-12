const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: uuidv4,
      unique: true
    },

    first_name: {
      type: String,
      required: true,
    },

    last_name: {
      type: String,
      required: true,
    },

    phone_number:{
      type:Number
    },

    email_id: {
      type: String,
      required: true,
      unique: true
    },

    password: {
      type: String,
      required: true
    },

    isVerified: {
      type: Boolean,
      default: false
    },
    otp: String,
    otpExpiry: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);


const User = mongoose.model("User", userSchema);

module.exports = User;
