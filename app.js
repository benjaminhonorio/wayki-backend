const cors = require("cors");
const { requestId, unknownEndpoint, errorHandler } = require("./middleware");
const { requestLogger } = require("./utils/logger"); // prints to console (simple custom alternative to morgan)
const api = require("./routes");
const usersRouter = require("./controllers/users");
const express = require("express");
const app = express();

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
