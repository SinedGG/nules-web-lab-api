const db = require(__basedir + "/db.js");

module.exports = async (req, res) => {
  console.log(`roles`);
  try {
    var roles = await db(`SELECT name FROM roles`);

    res.status(200).json(roles);
  } catch (err) {
    console.log(err);
    res.status(500);
  }
};
