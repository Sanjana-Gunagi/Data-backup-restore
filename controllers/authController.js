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