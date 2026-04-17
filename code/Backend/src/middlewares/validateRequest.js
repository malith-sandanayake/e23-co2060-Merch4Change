import AppError from "../utils/appError.js";

const validateRequest = (schema = {}) => (req, res, next) => {
  const sections = ["body", "params", "query"];
  const validationErrors = [];

  for (const section of sections) {
    if (!schema[section]) {
      continue;
    }

    const { value, errors } = schema[section](req[section]);

    if (errors?.length) {
      validationErrors.push(
        ...errors.map((message) => ({
          section,
          message,
        })),
      );
      continue;
    }

    req[section] = value;
  }

  if (validationErrors.length) {
    return next(
      new AppError("Validation failed.", 400, "VALIDATION_ERROR", validationErrors),
    );
  }

  next();
};

export default validateRequest;
