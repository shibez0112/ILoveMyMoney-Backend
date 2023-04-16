const express = require("express");
const dotenv = require("dotenv").config();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const dbConnect = require("./config/DBConnect");
// ------------------------------------------
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const userRouter = require("./api/user");
const authRouter = require("./api/auth");
const walletRouter = require("./api/wallet");
// ------------------------------------------
const app = express();
const port = process.env.PORT;
// Middleware

app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

dbConnect.connect(function (err) {
  if (err) throw err;
  console.log("DB Connected!");
});



app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/wallet", walletRouter);

app.use(errorHandler);
app.use(notFound);


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

module.exports = app;
