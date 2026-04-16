import fs from "node:fs";
import path from "node:path";
import env from "../config/env.js";

// 1. Configuration Constants
const LOG_DIRECTORY = path.join(process.cwd(), "logs");
const EVENT_LOG_FILE = path.join(LOG_DIRECTORY, "events.log");
const ERROR_LOG_FILE = path.join(LOG_DIRECTORY, "errors.log");
const DEFAULT_MAX_LOG_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const REDACTED_VALUE = "[REDACTED]";
const SENSITIVE_KEYS = new Set([
  "password", "confirmpassword", "token", "accesstoken", 
  "refreshtoken", "authorization", "secret", "apikey", "api_key",
]);

const timestamp = () => new Date().toISOString();

// 2. Security: PII Redaction Logic
export const isSensitiveKey = (key) => {
  const normalizedKey = String(key).toLowerCase().replace(/[\s\-]/g, "");
  return SENSITIVE_KEYS.has(normalizedKey) || 
         normalizedKey.includes("password") || 
         normalizedKey.includes("token") || 
         normalizedKey.includes("secret");
};

export const redactSensitiveData = (value, seen = new WeakSet()) => {
  if (value === null || value === undefined) return value;
  if (Array.isArray(value)) return value.map((item) => redactSensitiveData(item, seen));
  if (typeof value !== "object") return value;

  if (seen.has(value)) return "[Circular]";
  seen.add(value);

  const source = value instanceof Error ? {
    name: value.name, message: value.message, stack: value.stack, ...value,
  } : value;

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

// 3. File System: Log Rotation & Writing
const ensureLogDirectory = () => {
  if (!fs.existsSync(LOG_DIRECTORY)) fs.mkdirSync(LOG_DIRECTORY, { recursive: true });
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
    
    // Auto-rotation check before writing
    if (fs.existsSync(filePath) && fs.statSync(filePath).size + Buffer.byteLength(logEntryText) > DEFAULT_MAX_LOG_FILE_SIZE_BYTES) {
      const rotatedPath = `${filePath}.1`;
      if (fs.existsSync(rotatedPath)) fs.unlinkSync(rotatedPath);
      fs.renameSync(filePath, rotatedPath);
    }

    fs.appendFileSync(filePath, logEntryText, "utf8");
  } catch (error) {
    console.error(`[CRITICAL ERROR] Failed to write to log file:`, error);
  }
};

// 4. Public Logging Methods
export const logInfo = (message, metadata = null) => {
  console.log(`[INFO] ${timestamp()} ${message}`);
  writeLog(EVENT_LOG_FILE, "INFO", message, metadata);
};

export const logError = (message, error = null, metadata = null) => {
  // Console output for immediate developer feedback
  if (error) {
    console.error(`[ERROR] ${timestamp()} ${message}`, error);
  } else {
    console.error(`[ERROR] ${timestamp()} ${message}`);
  }

  // Persistent file logging with redaction
  writeLog(ERROR_LOG_FILE, "ERROR", message, {
    error: error instanceof Error ? { name: error.name, message: error.message, stack: error.stack } : error,
    ...metadata,
  });
};

export const sanitizeUrlForLog = (rawUrl = "") => {
  try {
    const parsed = new URL(rawUrl, "http://localhost");
    for (const key of parsed.searchParams.keys()) {
      if (isSensitiveKey(key)) parsed.searchParams.set(key, REDACTED_VALUE);
    }
    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch { return rawUrl; }
};