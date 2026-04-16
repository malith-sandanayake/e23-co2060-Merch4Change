// catch code errors/ crashers
import { errorResponse } from "../utils/apiResponse.js";

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const errorCode = err.code || "INTERNAL_SERVER_ERROR";

  // if app already started sending a response and then an error happen, cant send 2nd respond,
  // handover to default express error handler
  if (res.headersSent) {
    return next(err);
  }

  // error message convert into same json structure
  return errorResponse(
    res,
    statusCode,
    err.message || "Internal server error",
    errorCode,
    err.details || null,
    process.env.NODE_ENV === "development" ? err.stack : undefined, // hide "Stack Trace" in deployment, (the exact line numbers of the error)
  );
};

export default errorHandler;
