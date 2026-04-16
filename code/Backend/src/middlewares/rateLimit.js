import rateLimit from "express-rate-limit";

import env from "../config/env.js";
import { errorResponse } from "../utils/apiResponse.js";

const createRateLimiter = ({
  windowMs,
  max,
  message,
  code,
  skipSuccessfulRequests = false,
}) => {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests,
    handler: (req, res) => {
      return errorResponse(res, 429, message, code, {
        retryAfterSeconds: Math.ceil(windowMs / 1000),
      });
    },
  });
};

export const apiRateLimiter = createRateLimiter({
  windowMs: env.apiRateLimitWindowMs,
  max: env.apiRateLimitMax,
  message: "Too many requests. Please try again later.",
  code: "RATE_LIMIT_EXCEEDED",
});

export const authRateLimiter = createRateLimiter({
  windowMs: env.authRateLimitWindowMs,
  max: env.authRateLimitMax,
  message: "Too many authentication attempts. Please try again later.",
  code: "AUTH_RATE_LIMIT_EXCEEDED",
  skipSuccessfulRequests: true,
});

export default createRateLimiter;
