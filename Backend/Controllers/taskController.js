const Task = require("../Models/Task");
const cloudinary = require("../config/cloudinary");

exports.createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      location,
      startDate,
      startTime,
      endDate,
      endTime,
      picture,
    } = req.body;

    if (!title || !description || !category || !location) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }
    
    let imageUrl = "";

    if (picture) {
      const uploadResult = await cloudinary.uploader.upload(picture, {
        folder: "hirehelper/tasks",
        transformation: [
          { width: 800, height: 600, crop: "limit" },
          { quality: "auto" },
        ],
      });
      imageUrl = uploadResult.secure_url;
    }

    const task = await Task.create({
      createdBy: req.user.id,
      title,
      description,
      category,
      location,
      startDate,
      startTime,
      endDate,
      endTime,
      picture: imageUrl,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user.id }).sort({
      createdAt: -1,
    });
    res.json({
      success: true,
      tasks,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// FEED TASKS
exports.getFeedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      createdBy: { $ne: req.user.id },

      status: "open",
    })

      .populate("createdBy", "first_name last_name profilePicture")

      .sort({ createdAt: -1 });

    res.json({
      success: true,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("createdBy");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.json({
      success: true,
      task,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.getAssignedTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      assignedTo: req.user.id,
    }).populate("createdBy", "first_name profilePicture");

    res.json({
      success: true,
      tasks,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
