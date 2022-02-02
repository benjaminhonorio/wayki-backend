const { logger } = require("../utils/logger");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

const getTokenFrom = (request) => {
  const authorization = request.get("authorization");
  if (authorization && authorization.toLowerCase().startsWith("bearer ")) {
    return authorization.substring(7);
  }
  return null;
};

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
const verifyToken = (error, req, res, next) => {
  const body = req.body;
  const token = getTokenFrom(req);
  console.log(token, body);
  next();
  // const token = req.body.token;
  // if (!token)
  //   return res
  //     .status(401)
  //     .json({ error: true, message: "Acceso denegado - No hay token" });
  // try {
  //   const verified = jwt.verify(token, process.env.TOKEN_SECRET);
  //   req.user = verified;
  //   next();
  // } catch (error) {
  //   res.status(400).json({ error: "Token inválido" });
  // }
};

module.exports = {
  requestId,
  unknownEndpoint,
  errorHandler,
  verifyToken,
};
