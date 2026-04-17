import fs from "node:fs";
import path from "node:path";

const LOG_DIRECTORY = path.join(process.cwd(), "logs");
const EVENT_LOG_FILE = path.join(LOG_DIRECTORY, "events.log");
const ERROR_LOG_FILE = path.join(LOG_DIRECTORY, "errors.log");
const DEFAULT_MAX_LOG_FILE_SIZE_BYTES = 5 * 1024 * 1024;
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

const parseMaxLogFileSize = () => {
  const configuredSize = Number.parseInt(process.env.BACKEND_LOG_MAX_SIZE_BYTES ?? "", 10);

  if (Number.isFinite(configuredSize) && configuredSize > 0) {
    return configuredSize;
  }

  return DEFAULT_MAX_LOG_FILE_SIZE_BYTES;
};

export const MAX_LOG_FILE_SIZE_BYTES = parseMaxLogFileSize();

export const isSensitiveKey = (key) => {
  const normalizedKey = String(key).toLowerCase().replace(/[\s\-]/g, "");

  if (SENSITIVE_KEYS.has(normalizedKey)) {
    return true;
  }

  return normalizedKey.includes("password") || normalizedKey.includes("token") || normalizedKey.includes("secret");
};

export const redactSensitiveData = (value, seen = new WeakSet()) => {
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

export const sanitizeUrlForLog = (rawUrl = "") => {
  try {
    const parsed = new URL(rawUrl, "http://localhost");

    for (const key of parsed.searchParams.keys()) {
      if (isSensitiveKey(key)) {
        parsed.searchParams.set(key, REDACTED_VALUE);
      }
    }

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return rawUrl;
  }
};

const ensureLogDirectory = () => {
  if (!fs.existsSync(LOG_DIRECTORY)) {
    fs.mkdirSync(LOG_DIRECTORY, { recursive: true });
  }
};

export const rotateLogFile = (filePath) => {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const rotatedFilePath = `${filePath}.1`;

  if (fs.existsSync(rotatedFilePath)) {
    fs.unlinkSync(rotatedFilePath);
  }

  fs.renameSync(filePath, rotatedFilePath);
};

export const enforceLogFileSizeLimit = (filePath, bytesToWrite = 0, maxBytes = MAX_LOG_FILE_SIZE_BYTES) => {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const currentSize = fs.statSync(filePath).size;

  if (currentSize + bytesToWrite > maxBytes) {
    rotateLogFile(filePath);
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

    const logEntryText = `${JSON.stringify({
      level,
      timestamp: timestamp(),
      message,
      metadata: redactSensitiveData(metadata),
    })}\n`;

    enforceLogFileSizeLimit(filePath, Buffer.byteLength(logEntryText, "utf8"));

    fs.appendFileSync(filePath, logEntryText, "utf8");
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
