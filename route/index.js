const express = require("express");
const authRoutes = require("./authRoutes");
const walletRoutes = require("./walletRoutes");

const router = express.Router();

router.use("/wallet", walletRoutes);

router.use("/auth", authRoutes);

router.get("/", (req, res) => {
  res.json({ message: "Welcome to the Hashtag API!" });
});

module.exports = router;
