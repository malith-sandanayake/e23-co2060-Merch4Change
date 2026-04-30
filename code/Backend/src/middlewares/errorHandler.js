import { errorResponse } from "../utils/apiResponse.js";
import { logError } from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errorCode = err.code || "INTERNAL_SERVER_ERROR";

  logError("Request failed in error middleware.", err, {
    request: {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      statusCode,
      errorCode,
    },
  });

  if (res.headersSent) {
    return next(err);
  }

  return errorResponse(
    res,
    statusCode,
    err.message || "Internal server error",
    errorCode,
    err.details || null,
    process.env.NODE_ENV === "development" ? err.stack : undefined,
  );
};

export default errorHandler;
