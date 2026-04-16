// catch code errors/ crashers
import { errorResponse } from "../utils/apiResponse.js";
import { logError } from "../utils/logger.js";

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errorCode = err.code || "INTERNAL_SERVER_ERROR";

  // Log the error with full request context for traceability
  logError("Request failed in error middleware.", err, {
    request: {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      statusCode,
      errorCode,
    },
  });

  // Safety Check: If headers are already sent, delegate to default Express handler
  // This prevents the "Headers already sent" crash
  if (res.headersSent) {
    return next(err);
  }

  // Send standardized JSON response
  return errorResponse(
    res,
    statusCode,
    err.message || "Internal server error",
    errorCode,
    err.details || null,
    // Security: Only show the "Stack Trace" (exact line numbers) in development mode
    process.env.NODE_ENV === "development" ? err.stack : undefined, 
  );
};

export default errorHandler;