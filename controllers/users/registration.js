const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const db = require(__basedir + "/db.js");

module.exports = async (req, res) => {
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
};
