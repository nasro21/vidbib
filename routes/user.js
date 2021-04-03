const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { User, validate } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");
const auth = require("../middleware/auth");

//Getting the current User
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  // Verifying if the User already exist in the DB
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already rgistered");

  // old Methode
  //   user = new User({
  //     name: req.body.name,
  //     email: req.body.email,
  //     password: req.body.password,
  //   });

  // New Method with Lodash
  user = new User(_.pick(req.body, ["name", "email", "password"]));

  // Hashing The Password using Bcrypt
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
