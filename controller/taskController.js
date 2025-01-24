const { models } = require("../model");
const Task = models.Task;
const Transaction = models.Transaction;

// Create a new task
const createTask = async (req, res) => {
    const { name, description, reward } = req.body;
    const userId = req.user.id; // Extract userId from the authenticated user

    try {
        const task = await Task.create({ name, description, reward, userId }); // Include userId
        res.status(201).json({ message: "Task created successfully", task });
    } catch (error) {
        res.status(500).json({ message: "Error creating task", error: error.message });
    }
};
// Update a task
const updateTask = async (req, res) => {
    const { id } = req.params;
    const { name, description, reward } = req.body;

    try {
        const task = await Task.findByPk(id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        task.name = name || task.name;
        task.description = description || task.description;
        task.reward = reward || task.reward;
        await task.save();

        res.status(200).json({ message: "Task updated successfully", task });
    } catch (error) {
        res.status(500).json({ message: "Error updating task", error: error.message });
    }
};

// Delete a task
const deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findByPk(id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        await task.destroy();
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting task", error: error.message });
    }
};

const completeTask = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; // Extracted from token middleware

    try {
        const task = await Task.findByPk(id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        if (task.completed) {
            return res.status(400).json({ message: "Task already completed" });
        }

        // Mark task as completed
        task.completed = true;
        task.userId = userId;
        await task.save();

        // Allocate reward to the user
        const user = await User.findByPk(userId);
        user.stars += task.reward; // Add reward to user's stars
        await user.save();

        // Create a transaction record
        await Transaction.create({
            userId,
            type: "task",
            amount: task.reward,
            description: `Completed task: ${task.name}`,
        });

        res.status(200).json({ message: "Task completed successfully", stars: user.stars });
    } catch (error) {
        res.status(500).json({ message: "Error completing task", error: error.message });
    }
};

module.exports = { createTask, updateTask, deleteTask, completeTask };