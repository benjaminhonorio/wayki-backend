require("express-async-errors"); // no need to use try-catch in every async function with express
const config = require("./config");
const cors = require("cors");
const middleware = require("./utils/middleware");
const logger = require("./utils/logger"); // prints to console (simple custom alternative to morgan)

const postsRouter = require("./controllers/posts");
const usersRouter = require("./controllers/users");
const express = require("express");
const app = express();

// database connection
const mongoose = require("mongoose");

logger.info("connecting to", config.MONGODB_URI);

mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message);
  });

// middleware and routes
app.use(cors());
app.use(express.json());
app.use(middleware.requestLogger);

app.use("/api/v1/posts", postsRouter);
app.use("/api/v1/users", usersRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
