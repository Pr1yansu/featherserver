const { ErrorHandler } = require("./errohandler");

exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  new ErrorHandler(403, "You are not logged to access this resource");
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return next(
      new ErrorHandler(403, "You are not admin to access this resource")
    );
  }
};
