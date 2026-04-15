import test from "node:test";
import assert from "node:assert/strict";

import { createMockResponse } from "../helpers/http.js";
import {
  errorResponse,
  successResponse,
} from "../../../src/utils/apiResponse.js";

test("successResponse sends consistent success payload", () => {
  const res = createMockResponse();

  successResponse(res, 200, "ok", { id: 1 });

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.payload, {
    success: true,
    message: "ok",
    data: { id: 1 },
  });
});

test("successResponse defaults data to null", () => {
  const res = createMockResponse();

  successResponse(res, 201, "created");

  assert.equal(res.statusCode, 201);
  assert.equal(res.payload.data, null);
});

test("errorResponse omits stack when not provided", () => {
  const res = createMockResponse();

  errorResponse(res, 400, "bad", "BAD_REQUEST", [{ field: "email" }]);

  assert.equal(res.statusCode, 400);
  assert.deepEqual(res.payload, {
    success: false,
    message: "bad",
    error: {
      code: "BAD_REQUEST",
      details: [{ field: "email" }],
    },
  });
});

test("errorResponse includes stack when provided", () => {
  const res = createMockResponse();

  errorResponse(res, 500, "oops", "INTERNAL", null, "STACK");

  assert.equal(res.payload.stack, "STACK");
});
