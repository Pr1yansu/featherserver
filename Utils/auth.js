const { ErrorHandler } = require("./errohandler");

exports.isAuthenticated = (req, res, next) => {
  const User = req.user;
  const token = req.cookies;
  if (token) {
    console.log(User);
    return next();
  }
  return next(
    new ErrorHandler(403, "You are not logged to access this resource")
  );
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  } else {
    return next(
      new ErrorHandler(403, "You are not admin to access this resource")
    );
  }
};
