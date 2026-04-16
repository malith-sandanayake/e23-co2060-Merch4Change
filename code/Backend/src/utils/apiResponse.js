// standardize backend sending data using json responses

// success response
export const successResponse = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

// error response
export const errorResponse = (
  res,
  statusCode,
  message,
  code,
  details = null,
  stack,
) => {
  const response = {
    success: false,
    message,
    error: {
      code,
      details,
    },
  };

  // add debugging info only when needed, hidden in production, useful in development
  if (stack) {
    response.stack = stack;
  }

  return res.status(statusCode).json(response);
};
