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


/* ================= CREATE TASK ================= */

router.post("/create", authMiddleware, createTask);


/* ================= MY TASKS ================= */

router.get("/my-tasks", authMiddleware, getMyTasks);


/* ================= FEED TASKS ================= */

router.get("/feed", authMiddleware, getFeedTasks);


/* ================= ASSIGNED TASKS ================= */

router.get("/assigned", authMiddleware, getAssignedTasks);


/* ================= UPDATE TASK ================= */

router.put("/:id", authMiddleware, updateTask);


/* ================= DELETE TASK ================= */

router.delete("/:id", authMiddleware, deleteTask);


/* ================= GET TASK BY ID ================= */

router.get("/:id", authMiddleware, getTaskById);


module.exports = router;