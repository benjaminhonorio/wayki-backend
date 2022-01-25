const winston = require("winston");

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

module.exports = logger;
