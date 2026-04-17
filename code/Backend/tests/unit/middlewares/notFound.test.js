import test from "node:test";
import assert from "node:assert/strict";

import { createMockResponse } from "../helpers/http.js";
import notFound from "../../../src/middlewares/notFound.js";

test("notFound returns route-not-found payload", () => {
  const req = {
    method: "GET",
    originalUrl: "/missing",
  };
  const res = createMockResponse();

  notFound(req, res);

  assert.equal(res.statusCode, 404);
  assert.equal(res.payload.success, false);
  assert.equal(res.payload.error.code, "ROUTE_NOT_FOUND");
  assert.equal(res.payload.message, "Route not found: GET /missing");
});