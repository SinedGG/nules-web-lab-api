const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const db = require(__basedir + "/db.js");

module.exports = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(404).json({ errors: errors.array() });
  }

  const body = req.body;

  console.log(body);

  if (body.password) {
    const hashPassw = await bcrypt.hash(body.password, 5);
    db(`UPDATE users SET password = ? WHERE id = ?`, [hashPassw, body.id]);
  }

  await db(`UPDATE users SET username = ?, email = ? WHERE id = ?`, [
    body.username,
    body.email,
    body.id,
  ]);

  var roles = [];
  const availableRoles = await db(`SELECT id, name FROM roles`);

  body.roles.forEach((role) => {
    const { id } = availableRoles.find((arole) => arole.name === role);

    roles.push([body.id, id]);
  });

  await db(`DELETE FROM user_roles WHERE user_id = ?`, [body.id]);

  if (roles.length > 0)
    await db(`INSERT INTO user_roles (user_id, role_id) VALUES ?`, [roles]);

  res.status(200).json({ message: "User updated" });
  try {
  } catch (err) {
    if (err.message.includes("Duplicate entry")) res.status(409);
    res.status(400);
  }
};
