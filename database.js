const mongoose = require("mongoose");
const { logger } = require("./utils/logger");

exports.connect = (
  { url = "", username = "", password = "", protocol = "mongodb" },
  options = {}
) => {
  let dburl = "";
  if (
    username !== undefined &&
    password !== undefined &&
    protocol == "mongodb+srv"
  ) {
    dburl = `${protocol}://${username}:${password}@${url}`;
  } else {
    dburl = `${protocol}://${url}`;
  }
  mongoose.connect(dburl, { ...options });

  mongoose.connection.on("connected", () => {
    console.log("Database connected");
  });

  mongoose.connection.on("close", () => {
    console.log("Database disconnected");
  });

  mongoose.connection.on("error", (error) => {
    logger.error(`Error connecting to database: ${error}`);
  });

  process.on("SIGINT", () => {
    mongoose.connection.close(() => {
      console.log("Database disconnected on app termination");
      process.exit(0);
    });
  });
};

exports.disconnect = () => {
  mongoose.connection.close(() => {
    console.log("Database disconnected successfully");
  });
};
