const express = require("express");
const cors = require("cors");
const path = require("path");
const { connectDB } = require("./config/config");
const { syncDatabase } = require("./model/index");
const routes = require("./route/index");
const referralRoutes = require("./route/referralRoutes");
const farmingRoutes = require("./route/farmingRoutes");
const leaderboardRoutes = require("./route/leaderboardRoutes");
const dailyBonusRoutes = require("./route/dailyBonusRoutes");
const socialSharingRoutes = require("./route/socialSharingRoutes");
const transactionRoutes = require("./route/transactionRoutes");

require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve tonconnect-manifest.json
app.use("/tonconnect-manifest.json", (req, res) => {
  res.sendFile(path.join(__dirname, "tonconnect-manifest.json"));
});

// API routes
app.use("/api", routes);
app.use("/api", referralRoutes);
app.use("/api", farmingRoutes);
app.use("/api", leaderboardRoutes);
app.use("/api", dailyBonusRoutes);
app.use("/api", socialSharingRoutes);
app.use("/api", transactionRoutes);

// Start Server
const startServer = async () => {
  await connectDB(); // Connect to MySQL
  await syncDatabase(); // Sync models to database

  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Manifest available at http://localhost:${PORT}/tonconnect-manifest.json`);
  });
};

startServer();
