const winston = require("winston");
const morgan = require("morgan");
const { stripFinalNewline } = require("./strip-newline");

const logger = winston.createLogger({
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "logs/request.log",
      level: "info",
    }),
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
  ],
});

morgan.token("id", (req) => req.id);

// Create request logs
const requestLogger = morgan(
  ":remote-addr [:date[iso]] :id ':method :url HTTP/:http-version' :status :res[content] :res[content-length] ':referrer' ':user-agent'",
  {
    stream: {
      write: (message) => logger.info(stripFinalNewline(message)),
    },
  }
);

module.exports = { logger, requestLogger };
