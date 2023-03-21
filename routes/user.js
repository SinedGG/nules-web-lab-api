const r = require("express").Router();
const { body } = require("express-validator");
const auth = require("../middleware/auth");

const edit = require("../controllers/users/edit");
r.post(
  "/register",
  body("username")
    .isLength({ min: 2 })
    .withMessage("Username must be a 2 char long"),
  body("email").isEmail().withMessage("Email must be valid"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be a 6 char long"),
  require("../controllers/users/registration")
);

r.post(
  "/login",
  body("username")
    .isLength({ min: 2 })
    .withMessage("Username must be a 2 char long"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be a 6 char long"),
  require("../controllers/users/login")
);

r.post(
  "/edit",
  auth(["admin"]),
  body("id").isInt().withMessage("Id error"),
  body("username")
    .isLength({ min: 2 })
    .withMessage("Username must be a 2 char long"),
  body("password").custom((value) => {
    if (value.length !== 0 && value.length < 6) {
      return Promise.reject("Password must be a 6 char long");
    } else return true;
  }),
  body("email").isEmail().withMessage("Email must be valid"),
  body("roles").isArray().withMessage("Roles must be an array"),
  edit
);

r.post(
  "/delete",
  auth(["admin"]),
  body("id").isInt().withMessage("Id error"),
  require("../controllers/users/delete")
);

r.post(
  "/list",
  auth(["admin", "moderator"]),
  require("../controllers/users/list")
);

r.post(
  "/roles",
  auth(["admin", "moderator"]),
  require("../controllers/users/availableRoles")
);

r.post("/validate", auth(["guest", "admin", "moderator"]), (req, res) => {
  res.status(200).json({ message: "token ok" });
});

module.exports = r;
