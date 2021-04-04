const express = require("express");
const app = express();
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const users = require("./routes/user");
const auth = require("./routes/auth");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const config = require("config");
const error = require("./middleware/error");
require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");

// throw new Error("Something failed during startup");
// if (!config.get("jwtPrivatekey")) {
//   console.error("FATALE ERROR : jwtPrivateKey is not defined");
//   process.exit(1);
// }

// Catch Errors inside the context of Express(in the Node Process)
// Handle uncaughtException
// process.on("uncaughtException", (ex) => {
//   // console.log("WE GOT AN UNCOUGHT EXCEPTION");
//   winston.error(ex.message, ex);
//   process.exit(1); // 0 is success , anything else is Failure
// });

// same Methode using Winston
winston.handleExceptions(
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

mongoose
  .connect("mongodb://localhost/vidbib", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to Mongodb"))
  .catch((err) => console.error("Could not connect to MongoDb"));

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);
app.use(error);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));
