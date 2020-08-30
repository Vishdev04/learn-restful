const bcrypt = require("bcrypt");
const _ = require("lodash");
const Joi = require("@hapi/joi");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { User } = require("../models/UsersModel");

router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  user = await User.findOne({ email: req.body.email });

  if (!user) return res.status(400).send("Invalid Email or Password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);

  if (!validPassword) res.status(400).send("Invalid Email or Password");

  token = user.generateAuthToken();

  res.send(token);
});

function validate(user) {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(6),
  });

  return schema.validate(user);
}

module.exports = router;
