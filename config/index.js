require("dotenv").config();

const config = {
  PORT: process.env.PORT || 3002,
  MONGODB_URI:
    process.env.NODE_ENV === "test"
      ? process.env.TEST_MONGODB_URI
      : process.env.MONGODB_URI,

  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
};

module.exports = config;
