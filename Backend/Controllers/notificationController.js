const Notification = require("../models/Notification");

/* ================= GET NOTIFICATIONS ================= */

exports.getNotifications = async (req, res) => {
  try {

    const notifications = await Notification.find({
      recipient: req.user.id
    })
    .populate("actor", "first_name last_name profilePicture")
    .populate("task", "title status")
    .sort({ createdAt: -1 })
    .limit(30);

    const unreadCount = await Notification.countDocuments({
      recipient: req.user.id,
      isRead: false
    });

    res.json({
      success: true,
      notifications,
      unreadCount
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/* ================= MARK ONE AS READ ================= */

exports.markNotificationRead = async (req, res) => {
  try {

    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.notificationId, recipient: req.user.id },
      { isRead: true, readAt: new Date() },
      { returnDocument: "after" }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }

    res.json({
      success: true,
      notification
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};


/* ================= MARK ALL READ ================= */

exports.markAllNotificationsRead = async (req, res) => {
  try {

    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.json({
      success: true,
      message: "All notifications marked as read"
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};