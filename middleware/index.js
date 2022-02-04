const { logger } = require("../utils/logger");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

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
  let token = req.headers.authorization || req.headers.query || "";

  if (token.startsWith("Bearer")) {
    token = token.substring(7);
  }

  if (!token)
    next({
      error: true,
      message: "Acceso denegado - No hay token",
    });

  try {
    const verified = jwt.verify(
      token,
      process.env.TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          next({
            error: true,
            message: "Acceso denegado - Token Invalido",
          });
        } else {
          req.decoded = decoded;
          next();
        }
      }
    );
    req.validUser = verified;
    next();
  } catch (error) {
    next({
      error: true,
      message: "Acceso denegado - No hay token",
    });
  }
};

module.exports = {
  requestId,
  unknownEndpoint,
  errorHandler,
  authToken,
};
