require("dotenv").config();

const PORT = process.env.PORT || 3002;
const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

module.exports = {
  MONGODB_URI,
  PORT,
  SENDGRID_API_KEY,
};
