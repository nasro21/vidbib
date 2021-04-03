module.exports = function (req, res, next) {
  // 401 Unaithorized
  // 403 Forbidden
  if (!req.user.isAdmin) return res.status(403).send("Acces denied");
  next();
};
