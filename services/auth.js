const pool = require("../config/DBConnect");
const bcrypt = require("bcrypt");
const { generateJWT } = require("../utils/jsonwebtoken");

const signUp = async (data) => {
  data.password = await bcrypt.hash(
    data.password,
    parseInt(bcrypt.genSalt(10))
  );
  const sql =
    "INSERT INTO users (name, email, role, password) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role";
  const values = [data.name, data.email, "user", data.password];
  try {
    const client = await pool.connect();
    const res = await client.query(sql, values);
    client.release();
    return res.rows[0];
  } catch (error) {
    throw new Error(error);
  }
};

const signIn = async (data) => {
  const sql = "SELECT * FROM users WHERE email = $1";
  const values = [data.email];
  try {
    const client = await pool.connect();
    const findUser = await client.query(sql, values);
    if (
      findUser &&
      (await bcrypt.compare(data.password, findUser.rows[0].password))
    ) {
      client.release();
      return {
        user: {
          name: findUser.rows[0].name,
          email: findUser.rows[0].email,
        },
        token: generateJWT(findUser.rows[0]),
      };
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (error) {
    throw new Error("Invalid Credentials");
  }
};

module.exports = { signUp, signIn };
