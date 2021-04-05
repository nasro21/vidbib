const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

module.exports = function () {
  // Catch Errors inside the context of Express(in the Node Process)
  // Handle uncaughtException
  // process.on("uncaughtException", (ex) => {
  //   // console.log("WE GOT AN UNCOUGHT EXCEPTION");
  //   winston.error(ex.message, ex);
  //   process.exit(1); // 0 is success , anything else is Failure
  // });

  // same Methode using Winston
  winston.handleExceptions(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );

  // Unhandled Promise REjection
  process.on("unhandledRejection", (ex) => {
    // console.log("WE GOT AN UNHANDLED REJECTION");
    throw ex;
  });

  // Log Error with Winston to Logfile
  winston.add(
    new winston.transports.File({ filename: "logfile.log", level: "error" })
  );

  // Log Error with Winston to MongoDb
  winston.add(
    new winston.transports.MongoDB({
      db: "mongodb://localhost/vidbib",
      level: "error",
    })
  );
};
