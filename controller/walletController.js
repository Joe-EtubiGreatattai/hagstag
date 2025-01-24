const { models } = require("../model/index");
const User = models.User;
const Transaction = models.Transaction;
const TonConnect = require("@tonconnect/sdk").TonConnect;
const customStorage = require("../utils/storage");

const connectWallet = async (req, res) => {
    const { walletAddress } = req.body;
    const userId = req.user.id;
  
    try {
        const user = await User.findByPk(userId);
  
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
  
        if (!walletAddress || walletAddress.length < 10) {
            return res.status(400).json({ message: "Invalid wallet address" });
        }
  
        user.TONWalletAddress = walletAddress;
        await user.save();
  
        res.status(200).json({ 
            message: "Wallet connected successfully", 
            walletAddress 
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error connecting wallet", 
            error: error.message 
        });
    }
};

const fetchWalletBalance = async (req, res) => {
    const userId = req.user.id;

    try {
        const user = await User.findByPk(userId);

        if (!user || !user.TONWalletAddress) {
            return res.status(404).json({ message: "Wallet not connected" });
        }

        const tonConnect = new TonConnect({
            storage: customStorage,
            manifest: {
                name: "Hashtag App",
                url: "http://localhost:5004",
                iconUrl: "https://static.vecteezy.com/system/resources/previews/040/159/435/non_2x/dollar-coin-with-placeholder-showing-concept-icon-of-business-location-bank-location-design-vector.jpg"
            }
        });

        // Note: This is a placeholder. Actual TON balance fetching 
        // would require integration with TON blockchain explorer or SDK
        const balance = await tonConnect.getBalance(user.TONWalletAddress);

        user.TONBalance = balance / 1e9;
        await user.save();

        res.status(200).json({ 
            walletAddress: user.TONWalletAddress, 
            balance: user.TONBalance 
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error fetching wallet balance", 
            error: error.message 
        });
    }
};

const purchaseHTC = async (req, res) => {
    const { method, amount } = req.body;
    const userId = req.user.id;
  
    try {
        const user = await User.findByPk(userId);
  
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
  
        if (method === "TON") {
            if (user.TONBalance < amount) {
                return res.status(400).json({ message: "Insufficient TON balance" });
            }
            user.TONBalance -= amount;
        } else if (method === "Stars") {
            if (user.stars < amount) {
                return res.status(400).json({ message: "Insufficient Stars" });
            }
            user.stars -= amount;
        } else {
            return res.status(400).json({ message: "Invalid payment method" });
        }
  
        user.HTCBalance = (user.HTCBalance || 0) + amount;
        await user.save();
  
        await Transaction.create({
            userId,
            type: "purchase",
            amount: amount,
            description: `Purchased $HTC using ${method}`,
        });
  
        res.status(200).json({ 
            message: "$HTC purchased successfully", 
            newHTCBalance: user.HTCBalance 
        });
    } catch (error) {
        res.status(500).json({ 
            message: "Error processing purchase", 
            error: error.message 
        });
    }
};

const getTransactionHistory = async (req, res) => {
    const userId = req.user.id;
  
    try {
        const user = await User.findByPk(userId);
  
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
  
        const transactions = await Transaction.findAll({ 
            where: { userId },
            order: [['createdAt', 'DESC']]
        });
  
        res.status(200).json({ transactions });
    } catch (error) {
        res.status(500).json({ 
            message: "Error fetching transaction history", 
            error: error.message 
        });
    }
};

module.exports = {
    connectWallet,
    fetchWalletBalance,
    purchaseHTC,
    getTransactionHistory
};