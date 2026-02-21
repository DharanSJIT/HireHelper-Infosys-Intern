const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  category: {
    type: String,
    required: true,
  },

  location: {
    type: String,
    required: true,
  },

  startDate: {
    type: Date,
    required: true,
  },

  startTime: {
    type: String,
    required: true,
  },

  endDate: {
    type: Date,
  },

  endTime: {
    type: String,
  },

  picture: {
    type: String,
    default: "",
  },

  status: {
    type: String,
    enum: ["open", "assigned", "completed"],
    default: "open",
  }

}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);