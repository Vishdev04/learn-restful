const express = require("express");
const router = express.Router();
const { Series, validate } = require("../models/SeriesModel");
const { Genre } = require("../models/GenreModel");

// const series = JSON.parse(fs.readFileSync("./jsonData/series-det.json"));

// function dataStore() {
//   data = JSON.stringify(series, null, 2);
//   fs.writeFile("./jsonData/series-det.json", data, (err) => {
//     if (err) console.log(err);
//   });
// }

router.get("/", async (req, res) => {
  const series = await Series.find();

  res.send(series);
});

router.get("/:id", async (req, res) => {
  // Look up for the Series and return 404 if doesn't Exist
  const ser = await Series.findById(req.params.id);

  if (!ser) {
    res.status(404).send("Cannot find the Series with the given ID");
    return;
  }

  res.send(ser);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) {
    res.status(400).send(error.details[0].message);
    return;
  }

  let genre = await Genre.findById(req.body.genreId).select("genre icon");

  genre = { _id: genre._id, genre: genre.genre, icon: genre.icon };

  let series = new Series({
    name: req.body.name,
    media: req.body.media,
    tags: req.body.tags,
    cast: req.body.cast,
    rating: req.body.rating,
    trailerUrl: req.body.trailerUrl,
    releaseDate: req.body.releaseDate,
    platform: req.body.platform,
    genre: genre,
  });

  series = await series.save();

  res.send(series);
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);

  const ser = await Series.findByIdAndUpdate(
    req.params.id,
    {
      $set: { name: req.body.name },
    },
    { new: true }
  );

  if (!ser) {
    res.status(404).send("Cannot find the Series with the given ID");
    return;
  }

  res.send(ser);
});

router.delete("/:id", async (req, res) => {
  // Look up for the Series and return 404 if doesn't Exist
  const ser = await Series.findByIdAndRemove(req.params.id);

  if (!ser) {
    res.status(404).send("Cannot find the Series with the given ID");
    return;
  }

  const index = series.indexOf(ser);
  series.splice(index, 1);

  res.send(ser);
});

module.exports = router;
