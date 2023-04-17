const pool = require("../config/DBConnect");

const addNewTrans = async (trans) => {
  const sqlInsertTrans =
    "INSERT INTO transactions (name, amount, type, timestamps, category_id, wallet_id) VALUES ($1, $2, $3, CURRENT_TIMESTAMP, $4, $5)";
  const valuesInsert = [
    trans.name,
    trans.amount,
    trans.type,
    trans.category_id,
    trans.wallet_id,
  ];
  const sqlFindBalance = "SELECT balance FROM wallets WHERE id = $1";
  const valueFindBalance = [trans.wallet_id];
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // Insert new transaction into db
    const insertTrans = await client.query(sqlInsertTrans, valuesInsert);
    const findBalance = await client.query(sqlFindBalance, valueFindBalance);
    // Calculate new balance
    const newBalance = trans.type
      ? findBalance.rows[0].balance + trans.amount
      : findBalance.rows[0].balance - trans.amount;
    // Update new balance
    const sqlChangeBalance = "UPDATE wallets SET balance = $1 where id = $2";
    const valuesChangeBalance = [newBalance, trans.wallet_id];
    const changeBalance = await client.query(
      sqlChangeBalance,
      valuesChangeBalance
    );
    await client.query("COMMIT");
    return "Sucessfully create transaction";
  } catch (error) {
    await client.query("ROLLBACK");
  } finally {
    client.release();
  }
};

const findTransWithId = async (id) => {
  const sql =
    "SELECT name, category_id, amount, type, timestamps FROM transactions WHERE id = $1";
  const value = [id];
  console.log(id);
  try {
    const client = await pool.connect();
    const findedTrans = await client.query(sql, value);
    client.release();
    return findedTrans.rows[0];
  } catch (error) {
    return new Error(error);
  }
};

const findAllTrans = async (user_id) => {
  const sql =
    "SELECT t.name, t.amount, t.type, t.timestamps FROM transactions t JOIN wallets w ON t.wallet_id = w.id JOIN users u ON w.user_id = u.id WHERE u.id = $1";
  const value = [user_id];
  try {
    const client = await pool.connect();
    const findedTrans = await client.query(sql, value);
    client.release();
    return findedTrans.rows;
  } catch (error) {
    return new Error(error);
  }
};

const deleteTransWithId = async (transactionId) => {
  const sqlFindTrans = "SELECT amount, type FROM transactions WHERE id = $1";
  const sqlDeleteTrans = "DELETE FROM transactions WHERE id = $1";
  const sqlFindWalletBalance =
    "SELECT w.id, w.balance FROM wallets w JOIN transactions t ON w.id = t.wallet_id WHERE t.id = $1";
  const sqlUpdateBalance = "UPDATE wallets SET balance = $1 WHERE id = $2";
  const value = [transactionId];
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    // find the amount of transactions
    const findTrans = await client.query(sqlFindTrans, value);
    const { amount, type } = findTrans.rows[0];
    // get id, balance from wallet
    const findBalance = await client.query(sqlFindWalletBalance, value);
    const { id, balance } = findBalance.rows[0];
    // plus/minus into wallet
    const newBalance = type ? balance - amount : balance + amount;
    const updatedBalance = await client.query(sqlUpdateBalance, [
      newBalance,
      id,
    ]);
    // delete transaction
    const deletedTrans = await client.query(sqlDeleteTrans, value);
    await client.query("COMMIT");
    return "Sucessfully delete transaction";
  } catch (error) {
    await client.query("ROLLBACK");
  } finally {
    client.release();
  }
};

const updateTransWithId = async (transUpdatedData, transId) => {
  const sqlFindTrans = "SELECT amount, type FROM transactions WHERE id = $1";
  const sqlFindWallet =
    "SELECT w.id, w.balance FROM wallets w JOIN transactions t ON w.id = t.wallet_id WHERE t.id = $1";
  const sqlUpdateBalance = "UPDATE wallets SET balance = $1 WHERE id = $2";
  const sqlUpdateTrans =
    "UPDATE transactions SET name = $1, amount = $2, type = $3, category_id = $4, wallet_id = $5 WHERE id = $6";
  const values = [
    transUpdatedData.name,
    transUpdatedData.amount,
    transUpdatedData.type,
    transUpdatedData.category_id,
    transUpdatedData.wallet_id,
    transId,
  ];
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const findTrans = await client.query(sqlFindTrans, [transId]);
    // get amount of transactions
    const { amount, type } = findTrans.rows[0];
    // find the difference between the original and change
    const difference = transUpdatedData.amount - amount;
    // find the wallet which balance needed to be update
    const findBalance = await client.query(sqlFindWallet, [transId]);
    const { balance, id } = findBalance.rows[0];
    // update the new balance based on original and change type
    const newBalance =
      type === transUpdatedData.type
        ? type
          ? parseFloat(balance) + difference
          : parseFloat(balance) - difference
        : type
        ? parseFloat(balance) - difference
        : parseFloat(balance) + difference;
    const updatedBalance = await client.query(sqlUpdateBalance, [
      newBalance,
      id,
    ]);
    const updatedTrans = await client.query(sqlUpdateTrans, values);
    await client.query("COMMIT");
    return "Sucessfully update transaction";
  } catch (error) {
    await client.query("ROLLBACK");
  } finally {
    client.release();
  }
};

module.exports = {
  addNewTrans,
  findTransWithId,
  findAllTrans,
  deleteTransWithId,
  updateTransWithId,
};
