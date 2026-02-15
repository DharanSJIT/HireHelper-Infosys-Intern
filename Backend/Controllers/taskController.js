const Task = require("../Models/Task");

exports.createTask = async (req, res) => {
  try {
    const { title, description, location, startTime, endTime, picture } = req.body;
    const task = await Task.create({
      title,
      description,
      location,
      startTime,
      endTime,
      picture,
      createdBy: req.user.id,
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user.id })
      .populate("createdBy", "first_name last_name email_id profilePicture")
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: { $ne: req.user.id } })
      .populate("createdBy", "first_name last_name email_id profilePicture")
      .sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("createdBy", "first_name last_name email_id profilePicture");
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
