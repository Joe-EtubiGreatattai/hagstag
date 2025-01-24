const { models } = require("../model");
const User = models.User;
const Transaction = models.Transaction;

// Start Farming
const startFarming = async (req, res) => {
  const userId = req.user.id; // Extracted from the JWT token
  const { duration } = req.body; // Duration in minutes

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if farming is already active
    if (user.farmingEndTime && user.farmingEndTime > new Date()) {
      return res.status(400).json({ message: "Farming is already active" });
    }

    // Set farming start and end times
    const now = new Date();
    const endTime = new Date(now.getTime() + duration * 60000); // Convert minutes to milliseconds

    user.farmingStartTime = now;
    user.farmingEndTime = endTime;
    await user.save();

    res.status(200).json({ message: "Farming started successfully", farmingEndTime: endTime });
  } catch (error) {
    res.status(500).json({ message: "Error starting farming", error: error.message });
  }
};

// Select Boosting Package
const selectBoostingPackage = async (req, res) => {
  const userId = req.user.id; // Extracted from the JWT token
  const { package } = req.body; // Boosting package name

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if a boosting package is already selected
    if (user.boostingPackage) {
      return res.status(400).json({ message: "Boosting package already selected" });
    }

    // Assign the boosting package
    user.boostingPackage = package;
    await user.save();

    res.status(200).json({ message: "Boosting package selected successfully", package });
  } catch (error) {
    res.status(500).json({ message: "Error selecting boosting package", error: error.message });
  }
};

// Claim Farming Rewards
const claimFarmingRewards = async (req, res) => {
  const userId = req.user.id; // Extracted from the JWT token

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if farming is active and the timer has ended
    if (!user.farmingEndTime || user.farmingEndTime > new Date()) {
      return res.status(400).json({ message: "Farming is still active or not started" });
    }

    // Calculate rewards based on the boosting package
    let reward = 100; // Base reward
    if (user.boostingPackage === "basic") {
      reward *= 1.5; // 50% boost
    } else if (user.boostingPackage === "premium") {
      reward *= 2; // 100% boost
    }

    // Allocate rewards
    user.stars += reward;
    user.farmingStartTime = null;
    user.farmingEndTime = null;
    user.boostingPackage = null; // Reset boosting package
    await user.save();

    // Create a transaction record
    await Transaction.create({
      userId,
      type: "farming",
      amount: reward,
      description: "Farming reward",
    });

    res.status(200).json({ message: "Farming rewards claimed successfully", stars: user.stars });
  } catch (error) {
    res.status(500).json({ message: "Error claiming farming rewards", error: error.message });
  }
};

module.exports = { startFarming, selectBoostingPackage, claimFarmingRewards };