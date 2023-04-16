const pool = require("../config/DBConnect");

const addNewCat = async (cat) => {
  const sql = "INSERT INTO categories(name) VALUES ($1) RETURNING id, name";
  const values = [cat.name];
  try {
    const client = await pool.connect();
    const res = await client.query(sql, values);
    client.release();
    return res.rows[0];
  } catch (error) {
    return new Error(error);
  }
};

const getAllCat = async () => {
  const sql = "SELECT id, name from categories";
  try {
    const client = await pool.connect();
    const res = await client.query(sql);
    client.release();
    return res.rows;
  } catch (error) {
    return new Error(error);
  }
};

const getCatById = async (id) => {
  const sql = "SELECT id, name from categories WHERE id = $1";
  const values = [id];
  try {
    const client = await pool.connect();
    const res = await client.query(sql, values);
    client.release();
    return res.rows[0];
  } catch (error) {
    return new Error(error);
  }
};

const updateCatById = async (id, data) => {
  const sql = "UPDATE categories SET name = $1 WHERE id = $2";
  const values = [data.name, id];
  try {
    const client = await pool.connect();
    const res = await client.query(sql, values);
    client.release();
    return `Sucessfully update category ${id}`;
  } catch (error) {
    return new Error(error);
  }
};

const deleteCatById = async (id) => {
  const sql = "DELETE from categories WHERE id = $1";
  const values = [id];
  try {
    const client = await pool.connect();
    const res = await client.query(sql, values);
    client.release();
    return `Sucessfully delete category ${id}`;
  } catch (error) {
    return new Error(error);
  }
};

module.exports = {
  addNewCat,
  getAllCat,
  getCatById,
  updateCatById,
  deleteCatById,
};
