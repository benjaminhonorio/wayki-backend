const { logger } = require("../utils/logger");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");
const config = require("../config");

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
  const { message = "", name = "" } = error;
  let { status = 500 } = error;

  if (name === "CastError") {
    logger.warn({ message });
    return res.status(400).json({ message });
  } else if (name === "ValidationError") {
    logger.warn({ message });
    return res.status(400).json({ message });
  } else {
    logger.error({ message });
  }
  res.status(status).json({ message, error });
};

// Verify JWT Token
const authToken = (req, res, next) => {
  const authorization = req.get("authorization");
  let token;
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    token = authorization.substring(7);
  }
  const decodedToken = jwt.verify(token, config.ACCESS_TOKEN_SECRET);
  req.decodedUser = decodedToken;
  if (!decodedToken.id) {
    return res.status(401).json({ error: "token missing or invalid" });
  }
  next();
};

module.exports = {
  requestId,
  unknownEndpoint,
  errorHandler,
  authToken,
};
