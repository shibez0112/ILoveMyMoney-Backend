const jwt = require("jsonwebtoken");
const pool = require("../config/DBConnect");
const { secret_key } = require("../config/variable");
const getTokenFromHeader = (req) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }
};

const isAuth = async (req, res, next) => {
  const token = getTokenFromHeader(req);
  if (token){
    try {
      const decoded = jwt.verify(token, secret_key);
      const sql = "SELECT id, name, email FROM users WHERE id = $1";
      const values = [decoded.data.id];
      const client = await pool.connect();
      const result = await client.query(sql, values);
      client.release();
      if (!result.rows[0]) {
        return res.status(401).end("User not found");
      } else {
        req.user = result.rows[0];
        return next();
      }
    } catch (error) {
      res.status(401).end("Invalid token");
    }
  }
  else {
    res.status(401).end("No Token attached")
  }
};

const isAdmin = async (req, res, next) => {
  const { id } = req.user;
  try {
    const sql = "SELECT role FROM users WHERE id = $1";
    const values = [id];
    const client = await pool.connect();
    const findAdmin = await client.query(sql, values);
    client.release();
    if (findAdmin.rows[0].role !== "admin") {
      return res.status(401).end("Not Admin");
    } else {
      return next();
    }
  } catch (error) {
    throw new Error(error);
  }
};

module.exports = { isAuth, isAdmin };
