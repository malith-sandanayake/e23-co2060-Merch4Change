export const successResponse = (res, statusCode, message, data = null) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (res, statusCode, message, code, details = null, stack) => {
  const response = {
    success: false,
    message,
    error: {
      code,
      details,
    },
  };

  if (stack) {
    response.stack = stack;
  }

  return res.status(statusCode).json(response);
};
