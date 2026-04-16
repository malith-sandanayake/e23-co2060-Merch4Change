// catchers invalid URLs
const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  error.code = "ROUTE_NOT_FOUND";

  // Hand the error to the next middleware (which is errorHandler)
  next(error);
};

export default notFound;
