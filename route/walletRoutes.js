const express = require("express");
const { connectWallet, fetchWalletBalance, purchaseHTC } = require("../controller/walletController");
const { authenticateToken } = require("../middleware/authMiddleware");
const { initializeTonSDK } = require("../middleware/tonMiddleware");

const router = express.Router();

router.use(authenticateToken);
router.use(initializeTonSDK); // Initialize TonConnect with custom storage

// Connect wallet
router.post("/connect", connectWallet);

// Fetch wallet balance
router.get("/balance", fetchWalletBalance);

// Purchase $HTC
router.post("/purchase", purchaseHTC);

module.exports = router;