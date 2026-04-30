import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";
import { connectDatabase } from "./config/db.js";
import env from "./config/env.js";
import { logError, logInfo } from "./utils/logger.js";

const startServer = async () => {
  try {
    await connectDatabase();

    app.listen(env.port, () => {
      logInfo(`Server is running on port ${env.port} in ${env.nodeEnv} mode.`);
    });
  } catch (error) {
    logError("Failed to start server.", error);
    process.exit(1);
  }
};

process.on("unhandledRejection", (reason) => {
  logError("Unhandled promise rejection.", reason);
});

process.on("uncaughtException", (error) => {
  logError("Uncaught exception.", error);
  process.exit(1);
});

startServer();
