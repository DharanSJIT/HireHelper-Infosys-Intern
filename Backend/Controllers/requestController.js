const Request = require("../Models/Request");
const Task = require("../Models/Task");

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
    if (task.status === "assigned") {
      return res.status(400).json({
        success: false,
        message: "Task already assigned",
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

      requestedBy: req.user.id,
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

      .populate("task");

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
