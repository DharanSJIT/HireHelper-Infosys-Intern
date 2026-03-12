const Request = require("../models/Request");
const Task = require("../models/Task");
const Notification = require("../models/Notification");

exports.requestTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    //Find the task
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    //Prevent requesting own task
    if (task.createdBy.toString() === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot request your own task",
      });
    }

    //Prevent Requesting on assigned task
    if (task.status !== "open") {
      return res.status(400).json({
        success: false,
        message: "Task is not available for requests",
      });
    }

    //Check duplicate request
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

    //Create request
    const request = await Request.create({
      task: taskId,
      taskOwner: task.createdBy,
      requestedBy: req.user.id,
    });

    await createNotification({
      recipient: task.createdBy,
      actor: req.user.id,
      task: task._id,
      request: request._id,
      type: "new_request",
      title: "New task request",
      message: "A helper sent a request for your task.",
    });

    res.status(201).json({
      success: true,

      message: "Request sent successfully",

      request,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.getRequestsForMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      createdBy: req.user.id,
    });

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
    res.status(500).json({
      error: error.message,
    });
  }
};

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
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.acceptRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId);

    if (!request) return res.status(404).json({ message: "Request not found" });

    //Prevent multiple accept
    if (request.status !== "pending") {
      return res.status(400).json({
        message: "Request already processed",
      });
    }

    const task = await Task.findById(request.task);
    //Only owner can accept
    if (task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    request.status = "accepted";

    await request.save();

    await Task.findByIdAndUpdate(
      request.task,

      { status: "assigned", assignedTo: request.requestedBy },
    );

    // Reject all other pending requests automatically
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

    const updatedTask = await Task.findById(request.task).populate(
      "assignedTo",
      "first_name last_name profilePicture",
    );

    await createNotification({
      recipient: request.requestedBy,
      actor: req.user.id,
      task: request.task,
      request: request._id,
      type: "request_accepted",
      title: "Request accepted",
      message: "Your request was accepted. You have been assigned to this task.",
    });

    res.json({
      success: true,
      message: "Request accepted",
      task: updatedTask,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.rejectRequest = async (req, res) => {
  try {
    const request = await Request.findById(req.params.requestId);

    if (!request) return res.status(404).json({ message: "Request not found" });

    //Prevent multiple reject
    if (request.status !== "pending") {
      return res.status(400).json({
        message: "Request already processed",
      });
    }

    const task = await Task.findById(request.task);

    //Only owner can reject
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
      message: "Your request was rejected by the task owner.",
    });

    res.json({
      success: true,
      message: "Request rejected",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({
      recipient: req.user.id,
    })
      .populate("actor", "first_name last_name profilePicture")
      .populate("task", "title status")
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({
      recipient: req.user.id,
      isRead: false,
    });

    res.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.markNotificationRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: req.user.id },
      { isRead: true, readAt: new Date() },
      { new: true },
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.json({
      success: true,
      notification,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};

exports.markAllNotificationsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { isRead: true, readAt: new Date() },
    );

    res.json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
};
