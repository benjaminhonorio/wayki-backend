const { logger } = require("../utils/logger");
const { v4: uuidv4 } = require("uuid");

const requestId = (req, res, next) => {
  const { headers } = req;
  const id = headers["X-Request-Id"] ?? uuidv4();
  req.id = id;
  next();
};

// Handles requests to unknown endpoints
const unknownEndpoint = (req, res, next) => {
  const status = 404;
  const message = "Error. Endpoint Not Found";
  next({ status, message });
};

// Handles errors
const errorHandler = (error, req, res, next) => {
  const { status = 500, message = "", name = "" } = error;
  logger.error({ message });

  if (name === "CastError") {
    return res.status(400).json({ message: "Error. malformatted id" }); // overwrite error message from express
  } else if (name === "ValidationError") {
    return res.status(400).json({ message });
  } else {
    return res.status(status).json({ message });
  }
};

module.exports = {
  requestId,
  unknownEndpoint,
  errorHandler,
};
