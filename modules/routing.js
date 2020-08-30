require("express-async-errors");
const movies = require("../routes/movies");
const series = require("../routes/series");
const genre = require("../routes/genres");
const user = require("../routes/user");
const auth = require("../routes/auth");
const errorHandler = require("../middlewares/errorHandler");

module.exports = function (app) {
  app.use("/api/movies", movies);
  app.use("/api/series", series);
  app.use("/api/genres", genre);
  app.use("/api/user", user);
  app.use("/api/auth", auth);
  app.use(errorHandler);
};
