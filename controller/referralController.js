const { models } = require("../model");
const User = models.User;
const Transaction = models.Transaction;

// Generate a random referral code
const generateReferralCode = () => {
  return `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
};

// Get Referral Code
const getReferralCode = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a referral code if the user doesn't have one
    if (!user.referralCode) {
      user.referralCode = generateReferralCode();
      await user.save();
    }

    res.status(200).json({ referralCode: user.referralCode });
  } catch (error) {
    res.status(500).json({ message: "Error fetching referral code", error: error.message });
  }
};

// Claim Referral Reward
const claimReferralReward = async (req, res) => {
  const userId = req.user.id; // Extracted from the JWT token

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the reward has already been claimed
    if (user.referralRewardClaimed) {
      return res.status(400).json({ message: "Referral reward already claimed" });
    }

    // Allocate reward (e.g., 100 stars)
    const rewardAmount = 100;
    user.stars += rewardAmount;
    user.referralRewardClaimed = true; // Lock the claim button
    await user.save();

    // Create a transaction record
    await Transaction.create({
      userId,
      type: "referral",
      amount: rewardAmount,
      description: "Referral reward",
    });

    res.status(200).json({ message: "Referral reward claimed successfully", stars: user.stars });
  } catch (error) {
    res.status(500).json({ message: "Error claiming referral reward", error: error.message });
  }
};

// Track Referrals and Allocate Rewards
const trackReferral = async (referralCode) => {
  try {
    const referrer = await User.findOne({ where: { referralCode } });

    if (referrer && !referrer.referralRewardClaimed) {
      // Allocate reward (e.g., 100 stars)
      referrer.stars += 100;
      referrer.referralRewardClaimed = true; // Lock the claim button
      await referrer.save();
    }
  } catch (error) {
    console.error("Error allocating referral reward:", error.message);
  }
};

module.exports = { getReferralCode, claimReferralReward, trackReferral };