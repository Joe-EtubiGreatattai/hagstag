const TonConnect = require("@tonconnect/sdk").TonConnect;
const customStorage = require("../utils/storage");

let tonConnect = null;

const initializeTonSDK = (req, res, next) => {
    if (!tonConnect) {
      tonConnect = new TonConnect({
        storage: customStorage,
        manifest: {
          name: "Hashtag App",
          url: "http://localhost:5004", // Ensure this matches your actual local URL
          iconUrl: "https://static.vecteezy.com/system/resources/previews/040/159/435/non_2x/dollar-coin-with-placeholder-showing-concept-icon-of-business-location-bank-location-design-vector.jpg"
        }
      });
    }
    req.tonConnect = tonConnect;
    next();
  };

module.exports = { initializeTonSDK };