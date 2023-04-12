const { Client } = require("pg");
const dotenv = require("dotenv").config();

const client = new Client({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDB,
  password: process.env.PGPASS,
  port: process.env.PGPORT,
});

module.exports = client.connect(function (err) {
  if (err) throw err;
  console.log("DB Connected!");
});

