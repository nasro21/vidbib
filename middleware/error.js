const winston = require("winston");

module.exports = function (err, req, res, next) {
  // log the Exception
  winston.error(err.mnessage, err); // The logging Level are : Error , warn , info , verbose ,  debug , silly
  res.status(500).send("Something failed");
};
