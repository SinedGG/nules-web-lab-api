const db = require(__basedir + "/db.js");

module.exports = (id) => {
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
};
