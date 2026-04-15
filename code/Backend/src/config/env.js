import dotenv from "dotenv";

// read the .env file from the root directory and load the values to the global "process.env" object in memory
dotenv.config();

// checking for the environemnt variable status, thriw errors
const requiredInProduction = ["MONGODB_URI", "JWT_SECRET"];

for (const key of requiredInProduction) {
  if (process.env.NODE_ENV === "production" && !process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
}

// declearing the environment variables, || values be used if they are not defined in .end, use default values
const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  mongodbUri: process.env.MONGODB_URI || process.env.MONGO_URI || "",
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
};

export default env;
