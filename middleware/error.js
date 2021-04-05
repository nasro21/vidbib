const winston = require("winston");

// This function catches any Error in the Request processing pipeline
module.exports = function (err, req, res, next) {
  // log the Exception
  winston.error(err.mnessage, err); // The logging Level are : Error , warn , info , verbose ,  debug , silly
  // Internal Server Error
  res.status(500).send("Something failed");
};
