var jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") next();
  try {
    const token = req.body.token;
    if (!token) return res.json({ status: 401, message: "Token required" });

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decodedData);
    next();
  } catch (error) {
    res.json({ status: 403, message: "Token error" });
  }
};
