import test from "node:test";
import assert from "node:assert/strict";

import AppError from "../../../src/utils/appError.js";

test("AppError sets defaults and extends Error", () => {
  const error = new AppError("something broke");

  assert.equal(error instanceof Error, true);
  assert.equal(error.name, "AppError");
  assert.equal(error.message, "something broke");
  assert.equal(error.statusCode, 500);
  assert.equal(error.code, "INTERNAL_SERVER_ERROR");
  assert.equal(error.details, null);
});

test("AppError accepts explicit values", () => {
  const details = [{ section: "body", message: "invalid" }];
  const error = new AppError("bad", 400, "VALIDATION_ERROR", details);

  assert.equal(error.statusCode, 400);
  assert.equal(error.code, "VALIDATION_ERROR");
  assert.deepEqual(error.details, details);
});
