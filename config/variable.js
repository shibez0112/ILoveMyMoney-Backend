const dotenv = require("dotenv").config();

const pguser = process.env.PGUSER;
const pghost = process.env.PGHOST;
const pgdatabase = process.env.PGDB;
const pgpassword = process.env.PGPASS;
const pgport = process.env.PGPORT;
const secret_key = process.env.SECRET_KEY;

module.exports = { pguser, pghost, pgdatabase, pgpassword, pgport, secret_key };
