const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/config");
const Transaction = require("./transaction"); // Import the Transaction model

const User = sequelize.define("User", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isTelegramPremium: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  TONWalletAddress: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  TONBalance: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  },
  referralCode: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: true,
  },
  referredBy: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  referralRewardClaimed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  stars: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  farmingStartTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  farmingEndTime: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  boostingPackage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  boostingRewardClaimed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  lastDailyBonusClaimed: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  dailyBonusType: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  achievements: {
    type: DataTypes.JSON,
    allowNull: true,
  },
});

// Define the relationship between User and Transaction
User.hasMany(Transaction, { foreignKey: "userId" });
Transaction.belongsTo(User, { foreignKey: "userId" });

module.exports = User;