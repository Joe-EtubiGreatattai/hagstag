const express = require("express");
const { registerUser, loginUser, validateTelegramPremium } = require("../controller/authController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Register route
router.post("/register", registerUser);

// Login route
router.post("/login", loginUser);

// Validate Telegram Premium
router.get("/validate-premium", authenticateToken, validateTelegramPremium);

module.exports = router;
