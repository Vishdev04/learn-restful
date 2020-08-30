const mongoose = require("mongoose");
const Joi = require("@hapi/joi");

const genreSchema = new mongoose.Schema({
  genre: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
    lowercase: true,
  },
  icon: String,
  movieCount: {
    type: Number,
    default: 0,
  },
  seriesCount: {
    type: Number,
    default: 0,
  },
});

const Genre = mongoose.model("Genre", genreSchema);

function validateGenre(genre) {
  const schema = Joi.object({
    genre: Joi.string().min(5).max(50).required(),
    icon: Joi.string().required(),
    movieCount: Joi.number(),
    seriesCount: Joi.number(),
  });

  return schema.validate(genre);
}

exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validate = validateGenre;
