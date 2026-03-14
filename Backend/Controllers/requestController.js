const Request = require("../models/Request");
const Task = require("../models/Task");
const { createNotification } = require("../utils/createNotification");

/* ================= REQUEST TASK ================= */

exports.requestTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (task.createdBy.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot request your own task",
      });
    }

    if (task.status !== "open") {
      return res.status(400).json({
        success: false,
        message: "Task is not available for requests",
      });
    }

    const existing = await Request.findOne({
      task: taskId,
      requestedBy: req.user.id,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You already requested this task",
      });
    }

    const request = await Request.create({
      task: taskId,
      requestedBy: req.user.id,
    });

    const io = req.app.get("io");
    const onlineUsers = req.app.get("onlineUsers");

    await createNotification({
      recipient: task.createdBy,
      actor: req.user.id,
      task: task._id,
      request: request._id,
      type: "new_request",
      title: "New task request",
      message: "A helper sent a request for your task",
      io,
      onlineUsers,
    });

    res.status(201).json({
      success: true,
      message: "Request sent successfully",
      request,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= GET REQUESTS FOR MY TASKS ================= */

exports.getRequestsForMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user.id });

    const taskIds = tasks.map((task) => task._id);

    const requests = await Request.find({
      task: { $in: taskIds },
    })
      .populate("requestedBy", "first_name last_name profilePicture")
      .populate("task")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      requests,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= GET MY REQUESTS ================= */

exports.getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({
      requestedBy: req.user.id,
    })
      .populate({
        path: "task",
        populate: {
          path: "createdBy",
          select: "first_name last_name profilePicture",
        },
      })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      requests,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= ACCEPT REQUEST ================= */

exports.acceptRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        message: "Request already processed",
      });
    }

    const task = await Task.findById(request.task);

    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    request.status = "accepted";
    await request.save();

    await Task.findByIdAndUpdate(request.task, {
      status: "assigned",
      assignedTo: request.requestedBy,
    });

    await Request.updateMany(
      {
        task: request.task,
        status: "pending",
        _id: { $ne: request._id },
      },
      {
        status: "rejected",
      },
    );

    await createNotification({
      recipient: request.requestedBy,
      actor: req.user.id,
      task: request.task,
      request: request._id,
      type: "request_accepted",
      title: "Request accepted",
      message: "Your request was accepted",
      io,
      onlineUsers,
    });

    res.json({
      success: true,
      message: "Request accepted",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/* ================= REJECT REQUEST ================= */

exports.rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId);

    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        message: "Request already processed",
      });
    }

    const task = await Task.findById(request.task);

    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    request.status = "rejected";
    await request.save();

    await createNotification({
      recipient: request.requestedBy,
      actor: req.user.id,
      task: request.task,
      request: request._id,
      type: "request_rejected",
      title: "Request rejected",
      message: "Your request was rejected",
      io,
      onlineUsers,
    });
    res.json({
      success: true,
      message: "Request rejected",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
