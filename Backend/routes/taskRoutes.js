const express = require("express");

const router = express.Router();

const auth = require("../middlewares/authMiddleware");

const {
  createTask,
  getMyTasks,
  getFeedTasks,
  getAssignedTasks,
  getTaskById,
  updateTask,
  deleteTask
} = require("../Controllers/taskController");


/* ================= CREATE TASK ================= */

router.post("/create", auth, createTask);


/* ================= GET MY TASKS ================= */

router.get("/my-tasks", auth, getMyTasks);


/* ================= FEED TASKS ================= */

router.get("/feed", auth, getFeedTasks);


/* ================= ASSIGNED TASKS ================= */

router.get("/assigned", auth, getAssignedTasks);


/* ================= GET TASK BY ID ================= */

router.get("/:id", auth, getTaskById);


/* ================= UPDATE TASK ================= */

router.put("/edit/:id", auth, updateTask);


/* ================= DELETE TASK ================= */

router.delete("/delete/:id", auth, deleteTask);


module.exports = router;
