const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

const {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead
} = require("../Controllers/notificationController");

router.get("/", authMiddleware, getNotifications);

router.patch("/:notificationId/read", authMiddleware, markNotificationRead);

router.patch("/read-all", authMiddleware, markAllNotificationsRead);

module.exports = router;
