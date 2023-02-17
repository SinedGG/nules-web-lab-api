var jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  if (req.method === "OPTIONS") next();
  try {
    const token = req.body.token;
    console.log(token);
    if (!token) return res.staus(401).json({ message: "Token required" });

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (error) {
    res.staus(403).json({ message: "Token error" });
  }
};
