const winston = require("winston");
winston.add(new winston.transports.File({ filename: "Common_Errors.log" }));

function handleErrors() {
  process.on("unhandledRejection", (err) => {
    winston.error(err);
  });
  process.on("uncaughtException", (err) => {
    winston.error(err);
  });
}

module.exports = {
  logError: winston.error,
  logInfo: winston.info,
  logWarn: winston.warn,
  handleErrors,
};
