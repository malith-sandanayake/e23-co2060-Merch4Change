// code/Backend/middlewares/requireRole.js
import AppError from "../utils/appError.js";

const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) throw new AppError("Not authenticated.", 401, "NOT_AUTHENTICATED");
  if (!roles.includes(req.user.role)) {
    throw new AppError("Forbidden.", 403, "FORBIDDEN_ROLE");
  }
  next();
};

export default requireRole;
