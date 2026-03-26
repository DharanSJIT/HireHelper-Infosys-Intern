const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");

// ✅ Import controller
const requestController = require("../Controllers/requestController");

const {
  requestTask,
  getRequestsForMyTasks,
  getMyRequests,
  acceptRequest,
  rejectRequest,
} = requestController;

/* ================= DEBUG CHECK ================= */
console.log("Request Controller Check:", {
  requestTask: typeof requestTask,
  getRequestsForMyTasks: typeof getRequestsForMyTasks,
  getMyRequests: typeof getMyRequests,
  acceptRequest: typeof acceptRequest,
  rejectRequest: typeof rejectRequest,
});

/* ================= ROUTES ================= */

// ✅ STATIC ROUTES FIRST (IMPORTANT)
router.get("/my-tasks", authMiddleware, getRequestsForMyTasks);
router.get("/my-requests", authMiddleware, getMyRequests);

// ✅ ACTION ROUTES
router.patch("/:requestId/accept", authMiddleware, acceptRequest);
router.patch("/:requestId/reject", authMiddleware, rejectRequest);

// ✅ CREATE REQUEST (KEEP LAST)
router.post("/:taskId", authMiddleware, requestTask);

module.exports = router;
