import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import env from "./config/env.js";
import errorHandler from "./middlewares/errorHandler.js";
import notFound from "./middlewares/notFound.js";
import authRoutes from "./routes/auth.routes.js";
import healthRoutes from "./routes/health.routes.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

app.use("/api/v1", healthRoutes);
app.use("/api/v1/auth", authRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
