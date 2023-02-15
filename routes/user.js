const r = require("express").Router();
const { body } = require("express-validator");
const { registration, login } = require("../controllers/user");
const auth = require("../middleware/auth");

r.get(
  "/register",
  body("username")
    .isLength({ min: 2 })
    .withMessage("must be at least 2 chars long"),
  body("email").isEmail(),
  body("password").isLength({ min: 6 }),
  registration
);

r.get(
  "/login",
  body("username")
    .isLength({ min: 2 })
    .withMessage("must be at least 2 chars long"),
  body("password").isLength({ min: 6 }),
  login
);

r.get("/test", auth, (req, res) => {
  res.json({ m: "sus" });
});

module.exports = r;
