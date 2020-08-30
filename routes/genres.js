const express = require("express");
const router = express.Router();
const { Genre, validate } = require("../models/GenreModel");
const auth = require("../middlewares/auth");
const admin = require("../middlewares/admin");
const validateObjectId = require("../middlewares/validateObjectId");

router.get("/", async (req, res, next) => {
  const genres = await Genre.find();
  res.send(genres);
});

router.get("/:id", validateObjectId, async (req, res) => {
  // Look up for the Genre and return 404 if doesn't Exist
  const genre = await Genre.findById(req.params.id);

  if (!genre) {
    res.status(404).send("Cannot find the Genre with the given ID");
    return;
  }

  res.send(genre);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  let genre = new Genre({
    genre: req.body.genre,
    icon: req.body.icon,
  });

  genre = await genre.save();

  res.send(genre);
});

router.put("/:id", async (req, res) => {
  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    {
      $set: { name: req.body.name },
    },
    { new: true }
  );
  if (!genre) {
    res.status(404).send("Cannot find the genre with the given ID");
    return;
  }

  res.send(genre);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  // Look up for the genre and return 404 if doesn't Exist
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre) {
    res.status(404).send("Cannot find the genre with the given ID");
    return;
  }

  res.send(genre);
});

module.exports = router;
