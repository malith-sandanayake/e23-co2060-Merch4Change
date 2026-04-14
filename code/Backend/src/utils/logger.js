import fs from "node:fs";
import path from "node:path";

const LOG_DIRECTORY = path.join(process.cwd(), "logs");
const EVENT_LOG_FILE = path.join(LOG_DIRECTORY, "events.log");
const ERROR_LOG_FILE = path.join(LOG_DIRECTORY, "errors.log");
const REDACTED_VALUE = "[REDACTED]";
const SENSITIVE_KEYS = new Set([
  "password",
  "confirmpassword",
  "token",
  "accesstoken",
  "refreshtoken",
  "authorization",
  "secret",
  "apikey",
  "api_key",
]);

const timestamp = () => new Date().toISOString();

const isSensitiveKey = (key) => {
  const normalizedKey = String(key).toLowerCase().replace(/[\s\-]/g, "");

  if (SENSITIVE_KEYS.has(normalizedKey)) {
    return true;
  }

  return normalizedKey.includes("password") || normalizedKey.includes("token") || normalizedKey.includes("secret");
};

const redactSensitiveData = (value, seen = new WeakSet()) => {
  if (value === null || value === undefined) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => redactSensitiveData(item, seen));
  }

  if (typeof value !== "object") {
    return value;
  }

  if (seen.has(value)) {
    return "[Circular]";
  }

  seen.add(value);

  const source = value instanceof Error
    ? {
      name: value.name,
      message: value.message,
      stack: value.stack,
      ...value,
    }
    : value;

  const redacted = {};

  for (const [key, nestedValue] of Object.entries(source)) {
    if (isSensitiveKey(key)) {
      redacted[key] = REDACTED_VALUE;
      continue;
    }

    redacted[key] = redactSensitiveData(nestedValue, seen);
  }

  return redacted;
};

const ensureLogDirectory = () => {
  if (!fs.existsSync(LOG_DIRECTORY)) {
    fs.mkdirSync(LOG_DIRECTORY, { recursive: true });
  }
};

const normalizeError = (error) => {
  if (!error) {
    return null;
  }

  if (error instanceof Error) {
    return redactSensitiveData({
      name: error.name,
      message: error.message,
      stack: error.stack,
      ...error,
    });
  }

  if (typeof error === "string") {
    return { message: error };
  }

  return redactSensitiveData(error);
};

const writeLog = (filePath, level, message, metadata = null) => {
  try {
    ensureLogDirectory();

    const logEntry = {
      level,
      timestamp: timestamp(),
      message,
      metadata: redactSensitiveData(metadata),
    };

    fs.appendFileSync(filePath, `${JSON.stringify(logEntry)}\n`, "utf8");
  } catch (error) {
    console.error(`[ERROR] ${timestamp()} Failed to write log entry.`, error);
  }
};

export const logInfo = (message, metadata = null) => {
  console.log(`[INFO] ${timestamp()} ${message}`);
  writeLog(EVENT_LOG_FILE, "INFO", message, metadata);
};

export const logError = (message, error = null, metadata = null) => {
  const normalizedError = normalizeError(error);

  if (error) {
    console.error(`[ERROR] ${timestamp()} ${message}`, error);
  } else {
    console.error(`[ERROR] ${timestamp()} ${message}`);
  }

  writeLog(ERROR_LOG_FILE, "ERROR", message, {
    error: normalizedError,
    ...(metadata || {}),
  });
};
