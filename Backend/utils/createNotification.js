const Notification = require("../models/Notification");

exports.createNotification = async ({
  recipient,
  actor,
  task,
  request,
  type,
  title,
  message,
}) => {
  try {
    const notification = await Notification.create({
      recipient,
      actor,
      task,
      request,
      type,
      title,
      message,
    });

    return notification;
  } catch (error) {
    console.error("Notification Error:", error);
  }
};
