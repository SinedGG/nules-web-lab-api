const r = require("express").Router();
const { body } = require("express-validator");
const { registration, login } = require("../controllers/user");
const auth = require("../middleware/auth");

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
  body("password").isLength({ min: 6 })
  .withMessage("Password must be a 6 char long"),
  login
);

r.post("/validate" ,auth, (req, res) => {
  res.status(200).json({message: "token ok"})
});



module.exports = r;
