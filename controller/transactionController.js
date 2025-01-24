const { models } = require("../model");
const Transaction = models.Transaction;

// Fetch Transaction History
const getTransactionHistory = async (req, res) => {
  const userId = req.user.id; // Extracted from the JWT token

  try {
    const transactions = await Transaction.findAll({
      where: { userId },
      order: [["createdAt", "DESC"]], // Sort by creation date (newest first)
    });

    res.status(200).json({ transactions });
  } catch (error) {
    res.status(500).json({ message: "Error fetching transaction history", error: error.message });
  }
};

module.exports = { getTransactionHistory };