module.exports = function (req, res, next) {
  role = req.user.role;

  if (role == "ADMIN") {
    next();
  } else return res.status(403).send("Unauthorised");
};
