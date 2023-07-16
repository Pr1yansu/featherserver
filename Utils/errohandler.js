class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

const handleError = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle CastError
  if (err.name === "CastError") {
    statusCode = 400; // Bad Request
    message = "Invalid data format";
  }

  res.status(statusCode).json({
    error: {
      status: statusCode,
      message: message,
    },
  });
};

module.exports = {
  ErrorHandler,
  handleError,
};
