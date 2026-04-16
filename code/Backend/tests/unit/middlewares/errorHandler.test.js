import test from "node:test";
import assert from "node:assert/strict";

import { createMockResponse } from "../helpers/http.js";
import errorHandler from "../../../src/middlewares/errorHandler.js";

test("errorHandler delegates to next when headers are already sent", () => {
  const err = new Error("failed");
  const res = createMockResponse();
  res.headersSent = true;

  let nextArg;
  errorHandler(err, {}, res, (error) => {
    nextArg = error;
  });

  assert.equal(nextArg, err);
  assert.equal(res.payload, undefined);
});

test("errorHandler includes stack in development", () => {
  const previousNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = "development";

  const err = Object.assign(new Error("bad request"), {
    statusCode: 400,
    code: "BAD_REQUEST",
    details: [{ field: "email" }],
    stack: "DEV_STACK",
  });
  const res = createMockResponse();

  try {
    errorHandler(err, {}, res, () => {});
  } finally {
    process.env.NODE_ENV = previousNodeEnv;
  }

  assert.equal(res.statusCode, 400);
  assert.equal(res.payload.error.code, "BAD_REQUEST");
  assert.equal(res.payload.stack, "DEV_STACK");
});

test("errorHandler hides stack outside development", () => {
  const previousNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = "production";

  const err = Object.assign(new Error("boom"), {
    statusCode: 500,
    code: "INTERNAL_SERVER_ERROR",
    stack: "PROD_STACK",
  });
  const res = createMockResponse();

  try {
    errorHandler(err, {}, res, () => {});
  } finally {
    process.env.NODE_ENV = previousNodeEnv;
  }

  assert.equal(res.statusCode, 500);
  assert.equal("stack" in res.payload, false);
});
