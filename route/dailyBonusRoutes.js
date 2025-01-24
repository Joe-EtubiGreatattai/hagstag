const express = require("express");
const { claimDailyBonus } = require("../controller/dailyBonusController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Claim daily bonus
router.post("/claim", authenticateToken, claimDailyBonus);

module.exports = router;