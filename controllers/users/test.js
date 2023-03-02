const { validationResult } = require("express-validator");

module.exports = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(404).json({ errors: errors.array() });

  res.status(200).json({
    message: "Test",
  });
};
