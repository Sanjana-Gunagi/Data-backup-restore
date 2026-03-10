const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createUser } = require("../models/userModel");

exports.register = async (req, res) => {

  const { username, email, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  createUser(username, email, hashedPassword, (err) => {

    if (err) return res.status(500).json(err);

    res.json({ message: "User registered successfully" });

  });

};

exports.login = (req, res) => {

  const db = require("../config/db");
  const bcrypt = require("bcrypt");
  const jwt = require("jsonwebtoken");

  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    async (err, result) => {

      if (err) return res.status(500).json(err);

      if (result.length === 0)
        return res.status(404).json({ message: "User not found" });

      const user = result[0];

      const match = await bcrypt.compare(password, user.password);

      if (!match)
        return res.status(401).json({ message: "Invalid password" });

      const token = jwt.sign(
        {