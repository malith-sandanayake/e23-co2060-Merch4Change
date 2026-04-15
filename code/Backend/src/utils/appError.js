// AppError - template ensure every error follows the same format
// AppError is a child of JS Error class - inherits Error class
class AppError extends Error {
  constructor(
    message,
    statusCode = 500,
    code = "INTERNAL_SERVER_ERROR",
    details = null,
  ) {
    super(message);
    this.name = "AppError"; // custom name for the error instead of random system error message
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export default AppError;
