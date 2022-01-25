const config = require("./config");
const cors = require("cors");
const {
  requestId,
  requestLogger,
  unknownEndpoint,
  errorHandler,
} = require("./middleware");
const logger = require("./utils/logger"); // prints to console (simple custom alternative to morgan)
const api = require("./routes");
const usersRouter = require("./controllers/users");
const express = require("express");
const app = express();

// database connection
const mongoose = require("mongoose");

console.log(`connecting to ${config.MONGODB_URI}`);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

// middleware and routes
app.use(cors());
app.use(requestId);
app.use(requestLogger);
app.use(express.json());

app.use("/api", api);
app.use("/api/v1", api);
app.use("/api/v1/users", usersRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

module.exports = app;
