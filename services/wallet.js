const pool = require("../config/DBConnect");

const addNewWallet = async (data, user_id) => {
  const sql =
    "INSERT INTO wallets (name, balance, user_id) VALUES ($1, $2, $3) RETURNING id, name, balance, user_id";
  const values = [data.name, data.balance, user_id];
  try {
    const client = await pool.connect();
    const res = await client.query(sql, values);
    client.release();
    return res.rows[0];
  } catch (error) {
    return new Error(error);
  }
};

const getWalletById = async (wallet_id, user_id) => {
  const sql =
    "SELECT balance, name FROM wallets WHERE id = $1 AND user_id = $2";
  const value = [wallet_id, user_id];
  try {
    const client = await pool.connect();
    const res = await client.query(sql, value);
    client.release();
    return res.rows[0];
  } catch (error) {
    return new Error(error);
  }
};

const getAllWalletByUser = async (user_id) => {
  const sql = "SELECT balance, name FROM wallets WHERE user_id = $1";
  const value = [user_id];
  try {
    const client = await pool.connect();
    const res = await client.query(sql, value);
    client.release();
    return res.rows;
  } catch (error) {
    return new Error(error);
  }
};

const deleteWalletById = async (id, user_id) => {
  const sql = "DELETE FROM wallets WHERE id = $1 AND user_id = $2";
  const value = [id, user_id];
  try {
    const client = await pool.connect();
    const res = await client.query(sql, value);
    client.release();
    return `Sucessfully delete wallet ${id}`;
  } catch (error) {
    return new Error(error);
  }
};

const updateWallet = async (id, user_id, data) => {
  const sql =
    "UPDATE wallets SET balance = $1, name = $2 WHERE id = $3 AND user_id = $4";
  const value = [data.balance, data.name, id, user_id];
  try {
    const client = await pool.connect();
    const res = await client.query(sql, value);
    client.release();
    return `Sucessfully update wallet ${id}`;
  } catch (error) {
    return new Error(error);
  }
};

module.exports = {
  getWalletById,
  addNewWallet,
  getAllWalletByUser,
  deleteWalletById,
  updateWallet,
};
