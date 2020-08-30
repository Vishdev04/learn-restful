const bcrypt = require("bcrypt");
const _ = require("lodash");
const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/UsersModel");
const auth = require("../middlewares/auth");

router.get("/", async (req, res) => {
  const users = await User.find().select("name email");

  res.send(users);
});

router.get("/me", auth, async (req, res) => {
  // Look up for the User and return 404 if doesn't Exist
  const user = await User.findById(req.user._id).select("name email role -_id");

  if (!user) {
    res.status(404).send("Could not find the specified user");
    return;
  }

  res.send(user);
});

router.post("/register", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  emailCheck = await User.findOne({ email: req.body.email });

  if (emailCheck)
    return res.status(400).send("User with the given Email alreadt exist");

  let user = new User(_.pick(req.body, ["name", "email", "password", "role"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  try {
    await user.save();
  } catch (ex) {
    return res.status(400).send("Error occured: " + ex);
  }

  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email", "role"]));
});

router.put("/:id", async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: { name: req.body.name },
    },
    { new: true }
  );
  if (!user) {
    res.status(404).send("Cannot find the User with the given ID");
    return;
  }

  res.send(user);
});

router.delete("/:id", async (req, res) => {
  // Look up for the User and return 404 if doesn't Exist
  const user = await User.findByIdAndRemove(req.params.id);

  if (!user) {
    res.status(404).send("Cannot find the User with the given ID");
    return;
  }

  res.send(user);
});

module.exports = router;
