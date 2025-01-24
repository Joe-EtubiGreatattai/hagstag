const express = require("express");
const { getGlobalRankings, getRankingsByTimePeriod } = require("../controller/leaderboardController");

const router = express.Router();

// Fetch global rankings
router.get("/global", getGlobalRankings);

// Fetch rankings by time period
router.get("/time-period", getRankingsByTimePeriod);

module.exports = router;