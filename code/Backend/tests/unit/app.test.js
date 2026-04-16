import test from "node:test";
import assert from "node:assert/strict";

import app from "../../src/app.js";

const startServer = () => {
  return new Promise((resolve) => {
    const server = app.listen(0, () => {
      resolve(server);
    });
  });
};

test("app serves the health check endpoint", async () => {
  const server = await startServer();

  try {
    const address = server.address();
    const response = await fetch(`http://127.0.0.1:${address.port}/api/v1/health`);
    const payload = await response.json();

    assert.equal(response.status, 200);
    assert.equal(payload.success, true);
    assert.equal(payload.message, "Health check successful.");
    assert.equal(payload.data.service, "merch4change-backend");
    assert.equal(payload.data.status, "ok");
    assert.equal(typeof payload.data.timestamp, "string");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("app returns a not found response for unknown routes", async () => {
  const server = await startServer();

  try {
    const address = server.address();
    const response = await fetch(`http://127.0.0.1:${address.port}/api/v1/does-not-exist`);
    const payload = await response.json();

    assert.equal(response.status, 404);
    assert.equal(payload.success, false);
    assert.equal(payload.message, "Route not found: GET /api/v1/does-not-exist");
    assert.equal(payload.error.code, "ROUTE_NOT_FOUND");
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});