const { sequelize } = require("../config/config");
const User = require("./user");
const Task = require("./task");
const Transaction = require("./transaction");

// Add Transaction to the models object
const models = { User, Task, Transaction };

const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true }); // Sync models to database
    console.log("Database synchronized!");
  } catch (error) {
    console.error("Error syncing the database:", error.message);
  }
};

module.exports = { sequelize, models, syncDatabase };