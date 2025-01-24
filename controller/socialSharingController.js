const { models } = require("../model");
const User = models.User;
const axios = require("axios");

// Share Achievement on Social Media
const shareAchievement = async (req, res) => {
  const userId = req.user.id;
  const { platform, achievement } = req.body;

  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const achievementData = {
      stars: user.stars,
      tasksCompleted: user.achievements?.tasksCompleted || 0,
      message: achievement || "Check out my achievements!",
    };

    let response;
    switch (platform) {
      case "twitter":
        response = await shareOnTwitter(achievementData);
        break;
      case "facebook":
        response = await shareOnFacebook(achievementData);
        break;
      default:
        return res.status(400).json({ message: "Invalid platform" });
    }

    res.status(200).json({ message: "Achievement shared successfully", response });
  } catch (error) {
    res.status(500).json({ message: "Error sharing achievement", error: error.message });
  }
};

// Share on Twitter
const shareOnTwitter = async (achievementData) => {
  const tweetText = `I just earned ${achievementData.stars} stars and completed ${achievementData.tasksCompleted} tasks! ${achievementData.message} #AchievementUnlocked`;

  const response = await axios.post(
    "https://api.twitter.com/2/tweets",
    { text: tweetText },
    {
      headers: {
        Authorization: `Bearer ${process.env.TWITTER_BEARER_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

// Share on Facebook
const shareOnFacebook = async (achievementData) => {
  const postText = `I just earned ${achievementData.stars} stars and completed ${achievementData.tasksCompleted} tasks! ${achievementData.message}`;

  const response = await axios.post(
    `https://graph.facebook.com/v12.0/me/feed`,
    {
      message: postText,
      access_token: process.env.FACEBOOK_ACCESS_TOKEN,
    }
  );

  return response.data;
};

module.exports = { shareAchievement };