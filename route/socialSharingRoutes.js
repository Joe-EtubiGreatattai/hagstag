const express = require("express");
const { shareAchievement } = require("../controller/socialSharingController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Share achievement on social media
router.post("/share", authenticateToken, shareAchievement);

module.exports = router;