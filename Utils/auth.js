const { ErrorHandler } = require("./errohandler");

exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return next(
    new ErrorHandler(403, "You are not logged in to access this resource")
  );
};
exports.isAdmin = (req, res, next) => {
  console.log(req.user);
  if (req.user.role === "admin") {
    return next();
  } else {
    return next(
      new ErrorHandler(403, "You are not admin to access this resource")
    );
  }
};
