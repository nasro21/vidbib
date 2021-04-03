const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Genre } = require("../models/genre");
const { Movie, validate } = require("../models/movie");
const auth = require("../middleware/auth");

// Get all Movies
router.get("/", async (req, res) => {
  const movies = await Movie.find().sort("name");
  res.send(movies);
});

// Post a Movie
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre");

  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  await movie.save();
  res.send(movie);
});
// Put a Movies
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre");

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      numberInStock: req.body.numberInStock,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      dailyrRentalRate: req.body.dailyrRentalRate,
    },
    { new: true }
  );
  if (!movie) return res.status(404).send("There is no genre with this id");

  res.send(movie);
});

// Delete a Movie
router.delete("/:id", async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);
  if (!movie) return res.status(404).send("there is no genre with this ID");

  res.send(movie);
});

// Get specific Movie
router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) return res.status(404).send("there is no genre with this ID");
  res.send(movie);
});

module.exports = router;
