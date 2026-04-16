// check and clean request data before it reaches the controller
import AppError from "../utils/appError.js";

const validateRequest =
  (schema = {}) =>
  (req, res, next) => {
    const sections = ["body", "params", "query"]; // body: json data, params: URL variables, query: search string
    const validationErrors = [];

    for (const section of sections) {
      if (!schema[section]) {
        continue;
        // no defined validation for the section, ignore
      }

      const { value, errors } = schema[section](req[section]);
      // value: cleaned/ snitized data
      // errors: array of error msgs

      // collect errors
      if (errors?.length) {
        validationErrors.push(
          ...errors.map((message) => ({
            section,
            message,
          })),
        );
        continue;
      }

      // if no errors replace request data
      req[section] = value;
    }

    // check for errors
    if (validationErrors.length) {
      return next(
        new AppError(
          "Validation failed.",
          400,
          "VALIDATION_ERROR",
          validationErrors,
        ),
      );
    }

    // if everything is valid request continues to controller
    next();
  };

export default validateRequest;
