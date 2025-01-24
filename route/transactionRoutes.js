const express = require("express");
const { getTransactionHistory } = require("../controller/transactionController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Fetch transaction history
router.get("/history", authenticateToken, getTransactionHistory);

module.exports = router;