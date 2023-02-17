require("dotenv").config();
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

const db = require("../db");

function generateJWT(arg) {
  return jwt.sign(arg, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
}

module.exports = {
  registration: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ errors: errors.array() });
    }

    const body = req.body;
    const hashPassw = await bcrypt.hashSync(body.password, 5);
    try {
      await db(`INSERT INTO users(username, email, password) VALUES (?,?,?)`, [
        body.username,
        body.email,
        hashPassw,
      ]);
      res.json({ status: 201, message: "User created" });
    } catch (err) {
      if (err.message.includes("Duplicate entry")) res.status(409);
      res.status(400);
    }
  },
  login: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(404).json({ errors: errors.array() });
    }
    const body = req.body;
    try {
      const [candidate] = await db(
        `SELECT username, password FROM users WHERE username = ?`,
        [body.username]
      );
      if (!candidate)
        return res.satus(404).json({ message: "User not found" });
      const validePassw = bcrypt.compareSync(body.password, candidate.password);
      if (!validePassw)
        return res.status(400).json({ message: "Invalid password" });
      const ip =
        req.headers["cf-connecting-ip"] ||
        req.headers["x-real-ip"] ||
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        "";
      db(
        `UPDATE users SET last_login_ip = ?, last_login_time = ? WHERE username = ?`,
        [ip, new Date(), candidate.username]
      ).catch((e) => {
        console.log(e);
      });
      const jwt = generateJWT({ user: candidate.username });
      res.status(200).json({ username: candidate.username, token: jwt });
    } catch (err) {
      console.log(err);
      res.status(500);
    }
  },
};
