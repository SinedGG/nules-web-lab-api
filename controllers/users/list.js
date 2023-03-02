const db = require(__basedir + "/db.js");
const roles = require("./roles.js");

module.exports = async (req, res) => {
  console.log(`list`);
  try {
    var users = await db(
      `SELECT id, username, email, last_login_ip, last_login_time FROM users`
    );

    for (let i = 0; i < users.length; i++) {
      Object.assign(users[i], { roles: await roles(users[i].id) });
    }
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500);
  }
};
