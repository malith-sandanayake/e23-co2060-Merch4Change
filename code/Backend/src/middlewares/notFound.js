import { errorResponse } from "../utils/apiResponse.js";

const notFound = (req, res) => {
  return errorResponse(
    res,
    404,
    `Route not found: ${req.method} ${req.originalUrl}`,
    "ROUTE_NOT_FOUND",
  );
};

export default notFound;
