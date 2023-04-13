const { Pool } = require("pg");
const {pguser, pghost, pgdatabase, pgpassword, pgport} = require("./variable");


const pool = new Pool({
  user: pguser,
  host: pghost,
  database: pgdatabase,
  password: pgpassword,
  port: pgport,
  max: 20, // maximum number of connections in the pool
  idleTimeoutMillis: 30000, // how long a client is allowed to remain idle before being closed
  connectionTimeoutMillis: 2000, // how long to wait for a connection to become available
});

module.exports = pool;
