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

    res.json(task);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
