import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import assert from "node:assert/strict";

import {
  enforceLogFileSizeLimit,
  logError,
  logInfo,
  rotateLogFile,
} from "../../../src/utils/logger.js";

const createTempFile = (fileName, content) => {
  const tempDirectory = fs.mkdtempSync(path.join(os.tmpdir(), "merch4change-logger-"));
  const filePath = path.join(tempDirectory, fileName);

  fs.writeFileSync(filePath, content, "utf8");

  return { tempDirectory, filePath };
};

test.afterEach(() => {
  for (const directoryEntry of fs.readdirSync(os.tmpdir())) {
    if (!directoryEntry.startsWith("merch4change-logger-")) {
      continue;
    }

    fs.rmSync(path.join(os.tmpdir(), directoryEntry), { recursive: true, force: true });
  }
});

test("logInfo writes formatted info message", () => {
  const original = console.log;
  const calls = [];
  console.log = (...args) => calls.push(args);

  try {
    logInfo("service started");
  } finally {
    console.log = original;
  }

  assert.equal(calls.length, 1);
  assert.match(calls[0][0], /^\[INFO\] .+ service started$/);
});

test("logError logs message and error object when provided", () => {
  const original = console.error;
  const calls = [];
  const error = new Error("db failed");
  console.error = (...args) => calls.push(args);

  try {
    logError("Database connection failed.", error);
  } finally {
    console.error = original;
  }

  assert.equal(calls.length, 1);
  assert.match(calls[0][0], /^\[ERROR\] .+ Database connection failed\.$/);
  assert.equal(calls[0][1], error);
});

test("logError logs only message when error object is absent", () => {
  const original = console.error;
  const calls = [];
  console.error = (...args) => calls.push(args);

  try {
    logError("only message");
  } finally {
    console.error = original;
  }

  assert.equal(calls.length, 1);
  assert.match(calls[0][0], /^\[ERROR\] .+ only message$/);
  assert.equal(calls[0].length, 1);
});

test("rotateLogFile moves oversized logs to a backup file", () => {
  const { filePath } = createTempFile("events.log", "0123456789");

  rotateLogFile(filePath);

  assert.equal(fs.existsSync(filePath), false);
  assert.equal(fs.existsSync(`${filePath}.1`), true);
  assert.equal(fs.readFileSync(`${filePath}.1`, "utf8"), "0123456789");
});

test("enforceLogFileSizeLimit rotates when the next write would exceed the limit", () => {
  const { filePath } = createTempFile("errors.log", "0123456789");

  enforceLogFileSizeLimit(filePath, 5, 12);

  assert.equal(fs.existsSync(filePath), false);
  assert.equal(fs.existsSync(`${filePath}.1`), true);
});
