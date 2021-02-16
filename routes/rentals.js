const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Movie } = require("../models/movie");
const { Customer } = require("../models/customer");
const { Rental, validate } = require("../models/rental");
const Fawn = require("fawn");

Fawn.init(mongoose);
// Get all Rentals
router.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

// Post a Rental
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid Customer");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie");

  if (movie.numberInStock === 0)
    return res.status(400).send(" Movie not found");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  // 01 Methode without Transaction directly update
  //   rental = await rental.save();
  //   movie.numberInStock--;
  //   movie.save();

  //02 Using Two Phase Commit with Fawn to Update with Transaction
  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run();
    res.send(rental);
  } catch (ex) {
    res.status(500).send("Something failed");
  }
});
// Put a Rental
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      title: req.body.title,
      numberInStock: req.body.numberInStock,
      dailyrRentalRate: req.body.dailyrRentalRate,
    },
    { new: true }
  );
  if (!movie) return res.status(404).send("There is no genre with this id");

  res.send(movie);
});

// Delete a Rental
router.delete("/:id", async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);
  if (!movie) return res.status(404).send("there is no genre with this ID");

  res.send(movie);
});

// Get specific Rental
router.get("/:id", async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) return res.status(404).send("there is no genre with this ID");
  res.send(movie);
});

module.exports = router;
