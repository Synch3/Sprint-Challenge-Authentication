const axios = require("axios");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../database/dbConfig.js");

const { authenticate } = require("./middlewares");

module.exports = server => {
  server.post("/api/register", register);
  server.post("/api/login", login);
  server.get("/api/jokes", authenticate, getJokes);
};

function register(req, res) {
  // implement user registration
  let { username, password } = req.body;
  if (!username || !password)
    return res.json({
      error: true,
      message: "Please provide a username and/or password"
    });
  password = bcrypt.hashSync(password, SALT_ROUNDS);
  db("users")
    .insert({ username, password })
    .then(([id]) => {
      let token = generateToken({ id });
      res.json({
        error: false,
        message: "User Created Successfully",
        token
      });
    })
    .catch(err => res.json(err));
}

function login(req, res) {
  // implement user login
}

function getJokes(req, res) {
  axios
    .get(
      "https://08ad1pao69.execute-api.us-east-1.amazonaws.com/dev/random_ten"
    )
    .then(response => {
      res.status(200).json(response.data);
    })
    .catch(err => {
      res.status(500).json({ message: "Error Fetching Jokes", error: err });
    });
}
