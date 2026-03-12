const Notification = require("../models/Notification");

const createNotification = async ({
  recipient,
  actor = null,
  task = null,
  request = null,
  type,
  title,
  message,
}) => {
  await Notification.create({
    recipient,
    actor,
    task,
    request,
    type,
    title,
    message,
  });
};
