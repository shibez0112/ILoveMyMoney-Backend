const pool = require("../config/DBConnect");

const getAllUsers = async () => {
  const sql = "SELECT id, name, email, role FROM users";
  try {
    const client = await pool.connect();
    const res = await client.query(sql);
    client.release();
    return res.rows;
  } catch (error) {
    throw new Error(error);
  }
};

const getUserById = async (id) => {
  const sql = "SELECT id, name, email, role FROM users WHERE id = $1";
  const value = [id];
  try {
    const client = await pool.connect();
    const res = await client.query(sql, value);
    client.release();
    return res.rows[0];
  } catch (error) {
    throw new Error(error);
  }
};

const deleteUser = async (id) => {
  const sql = "DELETE FROM users WHERE id = $1";
  const value = [id];
  try {
    const client = await pool.connect();
    const res = await client.query(sql, value);
    client.release();
    return `Sucessfully delete user with id: ${id}`;
  } catch (error) {
    throw new Error(error);
  }
};

const updateUser = async (id, data) => {
  console.log(data);
  const sql = "UPDATE users SET name = $2, email = $3 WHERE id = $1";
  const value = [id, data.name, data.email];
  try {
    const client = await pool.connect();
    const res = await client.query(sql, value);
    client.release();
    return `Sucessfully update user with id: ${id}`;
  } catch (error) {
    throw new Error(error);
  }
};


module.exports = { getAllUsers, getUserById, deleteUser, updateUser };
