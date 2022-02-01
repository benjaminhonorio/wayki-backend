require("dotenv").config();

const config = {
  PORT: process.env.PORT || 3002,
  DATABASE: {
    protocol: process.env.MONGODB_PROTOCOL,
    url:
      process.env.NODE_ENV === "test"
        ? process.env.TEST_MONGODB_URI
        : process.env.MONGODB_URI,
    username: process.env.MONGODB_USER,
    password: process.env.MONGODB_PASSWORD,
  },
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  pagination: {
    limit: 10,
    skip: 0,
    page: 1,
  },
  sort: {
    sortBy: {
      fields: ["createdAt", "updatedAt"],
      default: "createdAt",
    },
    direction: {
      options: ["asc", "desc"],
      default: "desc",
    },
  },
  // TODO: add more filter options
  filter: { options: ["type"] },
};

module.exports = config;
