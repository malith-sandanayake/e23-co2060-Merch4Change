import test from "node:test";
import assert from "node:assert/strict";

import mongoose from "mongoose";

import env from "../../../src/config/env.js";
import { connectDatabase } from "../../../src/config/db.js";

test("connectDatabase skips connection when MONGODB_URI is missing", async () => {
  const originalUri = env.mongodbUri;
  const originalConnect = mongoose.connect;
  const originalLog = console.log;
  const logs = [];

  env.mongodbUri = "";
  let called = false;
  mongoose.connect = async () => {
    called = true;
  };
  console.log = (message) => logs.push(message);

  try {
    await connectDatabase();
  } finally {
    env.mongodbUri = originalUri;
    mongoose.connect = originalConnect;
    console.log = originalLog;
  }

  assert.equal(called, false);
  assert.equal(
    logs.some((line) => line.includes("MONGODB_URI is not set")),
    true,
  );
});

test("connectDatabase connects and logs success", async () => {
  const originalUri = env.mongodbUri;
  const originalConnect = mongoose.connect;
  const originalLog = console.log;
  const logs = [];

  env.mongodbUri = "mongodb://localhost:27017/test";
  mongoose.connect = async () => {};
  console.log = (message) => logs.push(message);

  try {
    await connectDatabase();
  } finally {
    env.mongodbUri = originalUri;
    mongoose.connect = originalConnect;
    console.log = originalLog;
  }

  assert.equal(
    logs.some((line) => line.includes("Database connected successfully.")),
    true,
  );
});

test("connectDatabase logs and rethrows connection errors", async () => {
  const originalUri = env.mongodbUri;
  const originalConnect = mongoose.connect;
  const originalError = console.error;
  const logs = [];
  const expected = new Error("cannot connect");

  env.mongodbUri = "mongodb://localhost:27017/test";
  mongoose.connect = async () => {
    throw expected;
  };
  console.error = (...args) => logs.push(args);

  try {
    await assert.rejects(connectDatabase, expected);
  } finally {
    env.mongodbUri = originalUri;
    mongoose.connect = originalConnect;
    console.error = originalError;
  }

  assert.equal(logs.length > 0, true);
  assert.equal(
    String(logs[0][0]).includes("Database connection failed."),
    true,
  );
  assert.equal(logs[0][1], expected);
});
