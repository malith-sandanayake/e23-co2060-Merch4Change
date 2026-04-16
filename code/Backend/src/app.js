// importing external tools
import cors from "cors"; // only allows requests with the react FrontendURL
import express from "express";
import helmet from "helmet"; // security package
import morgan from "morgan"; // logger

// importing internal tools
import env from "./config/env.js";
import errorHandler from "./middlewares/errorHandler.js"; // if code crash- your get clean error, no secret code leakage
import notFound from "./middlewares/notFound.js"; // if url not found
import authRoutes from "./routes/auth.routes.js"; // login, signup, sign out
import healthRoutes from "./routes/health.routes.js"; // simple route to check whether server is alive and working

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true, // allow frontend to send cookies
  }),
);
app.use(express.json({ limit: "1mb" })); // translate json raw text into js object
app.use(express.urlencoded({ extended: true })); // standard HTML form submissions
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

app.use("/api/v1", healthRoutes);
app.use("/api/v1/auth", authRoutes);

app.use(notFound); // trigger the 404 error
app.use(errorHandler); // any above route has bug or crashed Express jumps into here - send jsons

export default app;
