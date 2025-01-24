const express = require("express");
const { startFarming, selectBoostingPackage, claimFarmingRewards } = require("../controller/farmingController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Start farming
router.post("/start-farming", authenticateToken, startFarming);

// Select boosting package
router.post("/select-boosting-package", authenticateToken, selectBoostingPackage);

// Claim farming rewards
router.post("/claim-farming-rewards", authenticateToken, claimFarmingRewards);

module.exports = router;