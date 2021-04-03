const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Customer, validate } = require("../models/customer");
const auth = require("../middleware/auth");

// Get all Customers
router.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

// Post a Customer
router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);
  const customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });
  await customer.save();
  res.send(customer);
});
// Put a Customer
router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, phone: req.body.phone, isGold: req.body.isGold },
    { new: true }
  );
  if (!customer) return res.status(404).send("There is no genre with this id");

  res.send(customer);
});

// Delete a Customer
router.delete("/:id", async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer) return res.status(404).send("there is no genre with this ID");

  res.send(customer);
});

// Get single Customer
router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) return res.status(404).send("there is no genre with this ID");
  res.send(customer);
});

module.exports = router;
