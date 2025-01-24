const { models } = require("../model");
const User = models.User;
const Transaction = models.Transaction;

// Claim Daily Bonus
const claimDailyBonus = async (req, res) => {
    const userId = req.user.id; // Extracted from the JWT token
  
    try {
      const user = await User.findByPk(userId);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Check if the user has already claimed a bonus today
      const now = new Date();
      const lastClaimedDate = user.lastDailyBonusClaimed
        ? new Date(user.lastDailyBonusClaimed)
        : null;
  
      if (lastClaimedDate && lastClaimedDate.toDateString() === now.toDateString()) {
        return res.status(400).json({ message: "Daily bonus already claimed today" });
      }
  
      // Assign a random bonus type
      const bonusTypes = ["Double Coins", "Skip Day"];
      const bonusType = bonusTypes[Math.floor(Math.random() * bonusTypes.length)];
  
      // Allocate rewards based on the bonus type
      let rewardMessage = "";
      let rewardAmount = 0;
      switch (bonusType) {
        case "Double Coins":
          rewardAmount = 100; // Example: Double the daily reward
          user.stars += rewardAmount;
          rewardMessage = "You received 100 stars (Double Coins)!";
          break;
        case "Skip Day":
          // Example: Skip a farming day without penalty
          rewardMessage = "You can skip a farming day without penalty!";
          break;
        default:
          return res.status(500).json({ message: "Invalid bonus type" });
      }
  
      // Update user's last claimed bonus time and type
      user.lastDailyBonusClaimed = now;
      user.dailyBonusType = bonusType;
      await user.save();
  
      // Create a transaction record
      if (rewardAmount > 0) {
        await Transaction.create({
          userId,
          type: "daily_bonus",
          amount: rewardAmount,
          description: `Daily bonus: ${bonusType}`,
        });
      }
  
      res.status(200).json({ message: "Daily bonus claimed successfully", rewardMessage });
    } catch (error) {
      res.status(500).json({ message: "Error claiming daily bonus", error: error.message });
    }
  };
  

module.exports = { claimDailyBonus };