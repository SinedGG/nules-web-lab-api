const r = require("express").Router();
const { body } = require("express-validator");
//const { registration, login, list } = require("../controllers/user");
const auth = require("../middleware/auth");

const registration = require("../controllers/users/registration");
const login = require("../controllers/users/login");

const test = require("../controllers/users/test");
const edit = require("../controllers/users/edit");
r.post(
  "/register",
  body("username")
    .isLength({ min: 2 })
    .withMessage("must be at least 2 chars long"),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  registration
);

r.post(
  "/login",
  body("username")
    .isLength({ min: 2 })
    .withMessage("Username must be a 2 char long"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be a 6 char long"),
  login
);

r.post(
  "/edit",
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

const list = require("../controllers/users/list");
const roles = require("../controllers/users/availableRoles");

r.post("/list", list);

r.post("/roles", roles);

r.post("/validate", (req, res) => {
  res.status(200).json({ message: "token ok" });
});

r.post("/admin", auth(["admin"]), (req, res) => {
  res.status(200).json({ message: "token ok" });
});

r.post("/moderator", auth(["moderator"]), (req, res) => {
  res.status(200).json({ message: "token ok" });
});

module.exports = r;
