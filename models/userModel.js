const db = require("../config/db");

const createUser = (username, email, password, callback) => {
  const sql = "INSERT INTO users (username,email,password) VALUES (?,?,?)";
  db.query(sql, [username, email, password], callback);
};

module.exports = { createUser };