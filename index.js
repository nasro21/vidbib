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

// if (!config.get("jwtPrivatekey")) {
//   console.error("FATALE ERROR : jwtPrivateKey is not defined");
//   process.exit(1);
// }

mongoose
  .connect("mongodb://localhost/vidbib")
  .then(() => console.log("Connected to Mongodb"))
  .catch((err) => console.error("Could not connect to MongoDb"));

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));
