const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const db = require(__basedir + "/db.js");

module.exports = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({ errors: errors.array() });
  }
  try {
    await db(`DELETE FROM users WHERE id = ?`, [req.body.id]);

    res.status(200).json({ message: "User deleted" });
  } catch (err) {
    res.status(400);
  }
};
