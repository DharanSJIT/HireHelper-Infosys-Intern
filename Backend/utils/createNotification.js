const Notification = require("../models/Notification");

exports.createNotification = async ({
  recipient,
  actor,
  task,
  request,
  type,
  title,
  message,
  io,
  onlineUsers
}) => {

  try {

    if (recipient.toString() === actor?.toString()) return;

    const createdNotification = await Notification.create({
      recipient,
      actor,
      task,
      request,
      type,
      title,
      message
    });

    const notification = await Notification.findById(createdNotification._id)
      .populate("actor", "first_name last_name profilePicture")
      .populate("task", "title status");

    const socketId = onlineUsers.get(recipient.toString());

    if (socketId) {
      io.to(socketId).emit("new_notification", notification);
    }

    return notification;

  } catch (error) {

    console.error("Notification error:", error);

  }

};
