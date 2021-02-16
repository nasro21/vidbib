const express = require("express");
const app = express();
const genres = require("./routes/genres");
const Joi = require("joi");

const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("Connected to Mongodb"))
  .catch((err) => console.error("Could not connect to MongoDb"));

app.use(express.json());
app.use("/api/genres", genres);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on Port ${PORT}`));
