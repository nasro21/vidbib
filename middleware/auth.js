const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Acces denied. No tokem provided");
  try {
    // Verifiying if it is a valid Token
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req.user = decoded;
    next();
  } catch (eX) {
    res.status(400).send("Invalid token");
  }
};
