const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddlewares");

const {
  createTask,
  getMyTasks,
  getFeedTasks,
  getTaskById,
  getAssignedTasks,
  updateTask,
  deleteTask,
} = require("../Controllers/taskController");


router.post("/create", authMiddleware, createTask);
router.get("/my-tasks", authMiddleware, getMyTasks);
router.get("/feed", authMiddleware, getFeedTasks);
router.get("/assigned", authMiddleware, getAssignedTasks);
router.put("/edit/:id", authMiddleware, updateTask);
router.delete("/delete/:id", authMiddleware, deleteTask);
router.get("/:id", authMiddleware, getTaskById);

module.exports = router;