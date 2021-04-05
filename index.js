const express = require("express");
const app = express();
const winston = require("winston");
const mongoose = require("mongoose");

require("./startup/logging");
require("./startup/routes")(app);
require("./startup/config");
require("./startup/validation");

mongoose
  .connect("mongodb://localhost/vidbib", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => console.log("Connected to Mongodb"));
// Removing the Catch because The Global Error handling deal with that rejected Promise
// .catch((err) => console.error("Could not connect to MongoDb"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));
