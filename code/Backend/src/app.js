import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import env from "./config/env.js";
import errorHandler from "./middlewares/errorHandler.js";
import notFound from "./middlewares/notFound.js";
import authRoutes from "./routes/auth.routes.js";
import healthRoutes from "./routes/health.routes.js";
import marketplaceRoutes from "./routes/marketplace.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import { logInfo } from "./utils/logger.js";

const app = express();

const SENSITIVE_QUERY_KEYS = new Set([
  "password",
  "confirmpassword",
  "token",
  "accesstoken",
  "refreshtoken",
  "authorization",
  "secret",
  "apikey",
]);

const isSensitiveQueryKey = (key) => {
  const normalizedKey = String(key).toLowerCase().replace(/[\s\-]/g, "");

  if (SENSITIVE_QUERY_KEYS.has(normalizedKey)) {
    return true;
  }

  return normalizedKey.includes("password") || normalizedKey.includes("token") || normalizedKey.includes("secret");
};

const sanitizeUrlForLog = (rawUrl = "") => {
  try {
    const parsed = new URL(rawUrl, "http://localhost");

    for (const key of parsed.searchParams.keys()) {
      if (isSensitiveQueryKey(key)) {
        parsed.searchParams.set(key, "[REDACTED]");
      }
    }

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return rawUrl;
  }
};

const httpLogFormat = (tokens, req, res) => {
  const method = tokens.method(req, res);
  const url = sanitizeUrlForLog(tokens.url(req, res));
  const status = tokens.status(req, res);
  const responseTime = tokens["response-time"](req, res);
  const contentLength = tokens.res(req, res, "content-length") || 0;

  return `${method} ${url} ${status} ${responseTime} ms - ${contentLength}`;
};

app.use(helmet());
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  morgan(env.nodeEnv === "production" ? "combined" : httpLogFormat, {
    stream: {
      write: (message) => {
        logInfo("HTTP request", { details: message.trim() });
      },
    },
  }),
);

app.use("/api/v1", healthRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/marketplace", marketplaceRoutes);
app.use("/api/v1/profile", profileRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
