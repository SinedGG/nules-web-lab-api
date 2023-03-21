require("dotenv").config();
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const db = require(__basedir + "/db.js");
const role = require("./roles.js");

function generateJWT(arg) {
  return jwt.sign(arg, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
}

module.exports = async (req, res) => {
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
      return res.status(404).json({ errors: [{ msg: "User not found" }] });

    const validePassw = bcrypt.compareSync(body.password, candidate.password);
    if (!validePassw)
      return res.status(400).json({ errors: [{ msg: "Invalid password" }] });
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
      user: { id: candidate.id, name: candidate.username, roles: roles },
    });
    res.status(200).json({
      user: { id: candidate.id, name: candidate.username, roles: roles },
      token: jwt,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ errors: [{ msg: "Internal error" }] });
  }
};
