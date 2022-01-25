const logger = require("../utils/logger");
const { stripFinalNewline } = require("../utils/strip-newline");
const { v4: uuidv4 } = require("uuid");
const morgan = require("morgan");

// Add request id as header
const requestId = (request, response, next) => {
  request["X-Request-Id"] = uuidv4();
  next();
};

// Create request logs
const requestLogger = morgan("combined", {
  stream: {
    write: (message) => logger.info(stripFinalNewline(message)),
  },
});

// Handles requests to unknown endpoints
const unknownEndpoint = (request, response, next) => {
  const status = 404;
  const message = "Error. Endpoint Not Found";
  next({ status, message });
};

// Handles errors
const errorHandler = (error, request, response, next) => {
  const { status = 500, message = "", name = "" } = error;
  logger.error({ message });

  if (name === "CastError") {
    return response.status(400).json({ message: "Error. malformatted id" }); // overwrite error message from express
  } else if (name === "ValidationError") {
    return response.status(400).json({ message });
  } else {
    return response.status(status).json({ message });
  }
};

module.exports = {
  requestId,
  requestLogger,
  unknownEndpoint,
  errorHandler,
};
