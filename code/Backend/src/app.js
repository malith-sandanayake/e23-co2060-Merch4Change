import "./models/index.js";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import env from "./config/env.js";
import errorHandler from "./middlewares/errorHandler.js";
import notFound from "./middlewares/notFound.js";
import { apiRateLimiter, authRateLimiter } from "./middlewares/rateLimit.js";
import authRoutes from "./routes/auth.routes.js";
import healthRoutes from "./routes/health.routes.js";
import marketplaceRoutes from "./routes/marketplace.routes.js";
import productRoutes from "./routes/product.routes.js";
import profileRoutes from "./routes/profile.routes.js";
import { logInfo, sanitizeUrlForLog } from "./utils/logger.js";
import imageRoutes from "./routes/image.routes.js";
import brandRoutes from "./routes/brand.routes.js";








const app = express();

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


app.use("/api/v1/brands", brandRoutes);
app.use("/api/v1", apiRateLimiter);
app.use("/api/v1", healthRoutes);
app.use("/api/v1/auth", authRateLimiter, authRoutes);
app.use("/api/v1/marketplace", marketplaceRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/images", imageRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/auth", authRoutes);




app.use(notFound);
app.use(errorHandler);



export default app;
