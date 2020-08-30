const express = require("express");
const winston = require("winston");
const config = require("config");

const app = express();
app.use(express.json());

require("./modules/logger")();
require("./modules/routing")(app);
require("./modules/config")();
require("./modules/db_init")();

app.get("/", (req, res) => {
  res.send(
    "<a href='/api/movies'> Movies </a><br><a href='/api/series'> Series </a>"
  );
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  winston.info(`Listening to port ${port}`);
});

module.exports = server;
