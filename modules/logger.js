const winston = require("winston");

const myFormat = winston.format.printf((info) => {
  return `${info.timestamp} ${info.level}: ${info.message}`;
});

module.exports = function () {
  winston.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.json(),
        winston.format.colorize(),
        winston.format.simple(),
        winston.format.splat()
      ),
    })
  );
  winston.add(
    new winston.transports.File({
      filename: "./logs/combinedLogFile.log",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
        winston.format.simple()
      ),
    })
  );

  winston.exceptions.handle(
    new winston.transports.Console({
      colorize: true,
      prettyPrint: true,
      simple: true,
    }),
    new winston.transports.File({
      filename: "./logs/unhandledExceptions.log",
      prettyPrint: true,
    })
  );

  process.on("unhandledRejection", (ex) => {
    throw ex;
  });
};
