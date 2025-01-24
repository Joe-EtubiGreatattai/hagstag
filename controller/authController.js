const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { models } = require("../model/index");
const User = models.User;
const { trackReferral } = require("./referralController");

// Generate a random referral code
const generateReferralCode = () => {
    return `REF-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
};

// Register User
const registerUser = async (req, res) => {
    const { username, email, password, isTelegramPremium, referredBy } = req.body;
  
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        isTelegramPremium,
        referralCode: generateReferralCode(),
        referredBy,
      });
  
      // Allocate referral reward if applicable
      if (referredBy) {
        await trackReferral(referredBy);
      }
  
      res.status(201).json({ message: "User registered successfully", user: newUser });
    } catch (error) {
      console.error("Full error object:", error); // Log the full error object
      res.status(400).json({ message: "Error registering user", error: error.message });
    }
  };

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, isTelegramPremium: user.isTelegramPremium },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error.message });
    }
};

// Validate Telegram Premium
const validateTelegramPremium = async (req, res) => {
    const userId = req.user.id; // Extracted from the token middleware

    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.isTelegramPremium) {
            res.status(200).json({ message: "User is Telegram Premium" });
        } else {
            res.status(403).json({ message: "User is not Telegram Premium" });
        }
    } catch (error) {
        res.status(500).json({ message: "Error validating Telegram Premium", error: error.message });
    }
};

const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).json({ message: "Password reset successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error resetting password", error: error.message });
    }
};

module.exports = { registerUser, loginUser, validateTelegramPremium };
