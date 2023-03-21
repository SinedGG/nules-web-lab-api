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
      console.log(`User ${body.username} created`);
      res.json({ status: 201, message: "User created" });
    } catch (err) {
      if (err.message.includes("Duplicate entry")) res.status(409);
      res.status(400);
    }
  },
  login: async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(404).json({ errors: errors.array() });

    const body = req.body;

    try {
      const [candidate] = await db(
        `SELECT id, username, password FROM users WHERE username = ?`,
        [body.username]
      );
      if (!candidate)
        return res.status(404).json({ message: "User not found" });

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

      const roles = await role(candidate.id);

      const jwt = generateJWT({
        user: { id: candidate.id, name: candidate.username, roles: rolesJWT },
      });
      res.status(200).json({
        user: { id: candidate.id, name: candidate.username, roles: rolesJWT },
        token: jwt,
      });
    } catch (err) {
      console.log(err);
      res.status(500);
    }
  },
  roles: (id) => {
    return new Promise(async (resolve, reject) => {
      const roles = await db(
        `select roles.name from user_roles inner join roles on user_roles.role_id = roles.id where user_id = ?`,
        id
      );

      var rolesList = [];
      roles.forEach((role) => {
        rolesList.push(role.name);
      });
      resolve(rolesList);
    });
  },
  list: async (req, res) => {
    try {
      var users = await db(
        `SELECT id, username, email, last_login_ip, last_login_time FROM users`
      );

      for (let i = 0; i < users.length; i++) {
        console.log(users[i]);
        Object.assign(users[i], { roles: await this.roles(users[i].id) });
      }
      res.status(200).json(users);
    } catch (err) {
      console.log(err);
      res.status(500);
    }
  },
};
