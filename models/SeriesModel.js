const mongoose = require("mongoose");
const Joi = require("@hapi/joi").extend(require("@hapi/joi-date"));
const genreSchema = require("./GenreModel");

const Series = mongoose.model(
  "Series",
  new mongoose.Schema({
    name: {
      type: String,
      trim: true,
      required: true,
      min: 3,
      max: 255,
    },
    genre: {
      type: genreSchema,
      required: true,
    },
    media: [String],
    tags: [String],
    cast: [String],
    rating: Number,
    trailerUrl: [String],
    releaseDate: {
      type: Date,
      default: "01/01/2020",
    },
    platform: String,
  })
);

function validateSeries(series) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    platform: Joi.string().min(5).required(),
    media: Joi.array(),
    cast: Joi.array(),
    tags: Joi.array(),
    rating: Joi.number(),
    trailerUrl: Joi.array(),
    releaseDate: Joi.date().format("YYYY-MM-DD").raw(),
    genreId: Joi.string().required(),
  });

  return schema.validate(series);
}

exports.Series = Series;
exports.validate = validateSeries;
