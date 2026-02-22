const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddlewares");
const { createTask,getMyTasks,getFeedTasks,getTaskById,getAssignedTasks } = require("../Controllers/taskController");

router.post("/create", authMiddleware, createTask);
router.get("/my-tasks", authMiddleware, getMyTasks);
router.get("/feed", authMiddleware, getFeedTasks);
router.get("/:id", authMiddleware, getTaskById);
router.get("/assigned", authMiddleware, getAssignedTasks);

module.exports = router;