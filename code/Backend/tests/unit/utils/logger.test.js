import test from "node:test";
import assert from "node:assert/strict";

import { logError, logInfo } from "../../../src/utils/logger.js";

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