const { models } = require("../model");
const { Op } = require('sequelize');
const User = models.User;

// Fetch Global Rankings
const getGlobalRankings = async (req, res) => {
  try {
    const users = await User.findAll({
      order: [["stars", "DESC"]], // Sort by stars in descending order
      attributes: ["username", "stars"], // Only fetch necessary fields
    });

    res.status(200).json({ rankings: users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching global rankings", error: error.message });
  }
};

// Fetch Rankings by Time Period
const getRankingsByTimePeriod = async (req, res) => {
  const { period } = req.query; // daily, weekly, or monthly

  try {
    let startDate;
    const now = new Date();

    switch (period) {
      case "daily":
        startDate = new Date(now.setDate(now.getDate() - 1));
        break;
      case "weekly":
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case "monthly":
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      default:
        return res.status(400).json({ message: "Invalid time period" });
    }

    const users = await User.findAll({
      where: {
        createdAt: {
          [Op.gte]: startDate, // Filter users created after the start date
        },
      },
      order: [["stars", "DESC"]], // Sort by stars in descending order
      attributes: ["username", "stars"], // Only fetch necessary fields
    });

    res.status(200).json({ rankings: users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching rankings by time period", error: error.message });
  }
};

module.exports = { getGlobalRankings, getRankingsByTimePeriod };