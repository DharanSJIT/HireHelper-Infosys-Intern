const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
  requestTask,
  getRequestsForMyTasks,
  getMyRequests,
  acceptRequest,
  rejectRequest,
} = require("../controllers/requestController");

router.post("/:taskId", authMiddleware, requestTask);
router.get("/my-tasks", authMiddleware, getRequestsForMyTasks);
router.get("/my-requests", authMiddleware, getMyRequests);
router.patch("/:requestId/accept", authMiddleware, acceptRequest);
router.patch("/:requestId/reject", authMiddleware, rejectRequest);

module.exports = router;
