import test from "node:test";
import assert from "node:assert/strict";

import validateRequest from "../../../src/middlewares/validateRequest.js";

test("validateRequest updates request sections on valid schema", () => {
  const req = {
    body: { email: " user@example.com " },
    params: { id: "10" },
    query: { page: "1" },
  };
  let nextArg;

  const middleware = validateRequest({
    body: () => ({ value: { email: "user@example.com" }, errors: [] }),
    params: () => ({ value: { id: 10 }, errors: [] }),
  });

  middleware(req, {}, (error) => {
    nextArg = error;
  });

  assert.equal(nextArg, undefined);
  assert.deepEqual(req.body, { email: "user@example.com" });
  assert.deepEqual(req.params, { id: 10 });
  assert.deepEqual(req.query, { page: "1" });
});

test("validateRequest forwards AppError with aggregated validation details", () => {
  const req = {
    body: { email: "bad" },
    params: { id: "x" },
    query: {},
  };
  let nextArg;

  const middleware = validateRequest({
    body: () => ({ value: null, errors: ["email invalid"] }),
    params: () => ({ value: null, errors: ["id must be number"] }),
  });

  middleware(req, {}, (error) => {
    nextArg = error;
  });

  assert.equal(nextArg.name, "AppError");
  assert.equal(nextArg.statusCode, 400);
  assert.equal(nextArg.code, "VALIDATION_ERROR");
  assert.deepEqual(nextArg.details, [
    { section: "body", message: "email invalid" },
    { section: "params", message: "id must be number" },
  ]);
});
