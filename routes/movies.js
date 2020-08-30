const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const { Movie, validate } = require("../models/moviesModel");
const { Genre } = require("../models/GenreModel");

// const movies = JSON.parse(fs.readFileSync("./jsonData/movies-det.json"));

// function dataStore() {
//   data = JSON.stringify(movies, null, 2);
//   fs.writeFile("./jsonData/movies-det.json", data, (err) => {
//     if (err) console.log(err);
//   });
// }

router.get("/", async (req, res) => {
  const movies = await Movie.find().populate("genre", "genre icon");
  res.send(movies);
});

router.get("/:id", async (req, res) => {
  // Look up for the Movie and return 404 if doesn't Exist
  const movie = await Movie.findById(req.params.id).populate(
    "genre",
    "name icon"
  );

  if (!movie) {
    res.status(404).send("Cannot find the Movie with the given ID");
    return;
  }

  res.send(movie);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  let movie = new Movie({
    name: req.body.name,
    media: req.body.media,
    tags: req.body.tags,
    cast: req.body.cast,
    rating: req.body.rating,
    trailerUrl: req.body.trailerUrl,
    releaseDate: req.body.releaseDate,
    cinema: req.body.cinema,
    genre: req.body.genreID,
  });

  movie = await movie.save();

  res.send(movie);
});

router.put("/:id", async (req, res) => {
  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    {
      $set: { name: req.body.name },
    },
    { new: true }
  );
  if (!movie) {
    res.status(404).send("Cannot find the Movie with the given ID");
    return;
  }

  res.send(movie);
});

router.delete("/:id", async (req, res) => {
  // Look up for the Movie and return 404 if doesn't Exist
  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (!movie) {
    res.status(404).send("Cannot find the Movie with the given ID");
    return;
  }

  res.send(movie);
});

module.exports = router;
