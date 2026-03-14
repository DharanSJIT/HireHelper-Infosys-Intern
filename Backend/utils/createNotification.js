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

    const notification = await Notification.create({
      recipient,
      actor,
      task,
      request,
      type,
      title,
      message
    });

    const socketId = onlineUsers.get(recipient.toString());

    if (socketId) {
      io.to(socketId).emit("new_notification", notification);
    }

    return notification;

  } catch (error) {

    console.error("Notification error:", error);

  }

};