const express = require("express");
const { getReferralCode, claimReferralReward } = require("../controller/referralController");
const { authenticateToken } = require("../middleware/authMiddleware");

const router = express.Router();

// Get referral code
router.get("/referral-code", authenticateToken, getReferralCode);

// Claim referral reward
router.post("/claim-reward", authenticateToken, claimReferralReward);

module.exports = router;