const Notification = require("../Models/Notification");

exports.createNotification = async ({
  recipient,
  actor,
  task = null,
  request = null,
  type = "general",
  title = "Notification",
  message = "",
  io = null,
  onlineUsers = null,
}) => {
  try {
    // ✅ Safety check
    if (!recipient) {
      console.error("❌ Notification error: recipient missing");
      return null;
    }

    // ✅ Prevent self-notification
    if (actor && recipient.toString() === actor.toString()) {
      return null;
    }

    // ✅ Create notification
    const createdNotification = await Notification.create({
      recipient,
      actor,
      task,
      request,
      type,
      title,
      message,
    });

    // ✅ Populate data for frontend
    const notification = await Notification.findById(
      createdNotification._id
    )
      .populate("actor", "first_name last_name profilePicture")
      .populate("task", "title status");

    /* ================= DEBUG LOGS ================= */
    console.log("📤 Sending notification to:", recipient.toString());

    // ✅ Ensure string key (IMPORTANT FIX)
    const userId = recipient.toString();

    /* ================= REAL-TIME SOCKET ================= */
    if (io && onlineUsers) {
      const socketId = onlineUsers.get(userId);

      console.log("🔎 Socket ID:", socketId);

      if (socketId) {
        io.to(socketId).emit("new_notification", notification);
        console.log("✅ Notification sent in real-time");
      } else {
        console.log("⚠️ User not online → saved in DB only");
      }
    } else {
      console.log("⚠️ Socket or onlineUsers not available");
    }

    return notification;

  } catch (error) {
    console.error("❌ Notification error:", error);
    return null;
  }
};