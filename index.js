const express = require("express");
const dotenv = require("dotenv").config();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const dbConnect = require("./config/DBConnect");
// ------------------------------------------
const { notFound, errorHandler } = require("./middlewares/errorHandler");
// ------------------------------------------
const app = express();
const port = process.env.PORT;
// Middleware

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
