const express = require("express");
const { createTask, updateTask, deleteTask, completeTask } = require("../controller/taskController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin-only routes (create, update, delete tasks)
router.post("/tasks", authenticateToken, createTask);
router.put("/tasks/:id", authenticateToken, updateTask);
router.delete("/tasks/:id", authenticateToken, deleteTask);

// User route to complete tasks
router.post("/tasks/:id/complete", authenticateToken, completeTask);

module.exports = router;