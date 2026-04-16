// importing external tools
import cors from "cors"; 
import express from "express";
import helmet from "helmet"; 
import morgan from "morgan"; 

// importing internal tools
import env from "./config/env.js";
import errorHandler from "./middlewares/errorHandler.js"; 
import notFound from "./middlewares/notFound.js"; 
import authRoutes from "./routes/auth.routes.js"; 
import healthRoutes from "./routes/health.routes.js"; 
import { apiRateLimiter, authRateLimiter } from "./middlewares/rateLimit.js";
import marketplaceRoutes from "./routes/marketplace.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import { logInfo, sanitizeUrlForLog } from "./utils/logger.js";

const app = express();

// Custom log format to keep sensitive data out of logs
const httpLogFormat = (tokens, req, res) => {
  const method = tokens.method(req, res);
  const url = sanitizeUrlForLog(tokens.url(req, res));
  const status = tokens.status(req, res);
  const responseTime = tokens["response-time"](req, res);
  const contentLength = tokens.res(req, res, "content-length") || 0;

  return `${method} ${url} ${status} ${responseTime} ms - ${contentLength}`;
};

// Security & Middleware
app.use(helmet());
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" })); 
app.use(express.urlencoded({ extended: true }));

// Logging Configuration (Advanced Morgan setup)
app.use(
  morgan(env.nodeEnv === "production" ? "combined" : httpLogFormat, {
    stream: {
      write: (message) => {
        logInfo("HTTP request", { details: message.trim() });
      },
    },
  })
);

// Global Rate Limiting (Protection against DDoS)
app.use("/api/v1", apiRateLimiter);

// API Routes
app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/auth", authRateLimiter, authRoutes);
app.use("/api/v1/marketplace", marketplaceRoutes);
app.use("/api/v1/profile", profileRoutes);

// Error Handling Pipeline
app.use(notFound); 
app.use(errorHandler); 

export default app;