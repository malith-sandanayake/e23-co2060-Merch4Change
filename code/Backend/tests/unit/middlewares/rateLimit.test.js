import assert from "node:assert/strict";
import test from "node:test";

import express from "express";

import createRateLimiter from "../../../src/middlewares/rateLimit.js";

const startServer = (handler) => {
  const app = express();
  app.use(handler);

  return new Promise((resolve) => {
    const server = app.listen(0, () => {
      resolve(server);
    });
  });
};

test("createRateLimiter allows request under limit", async () => {
  const limiter = createRateLimiter({
    windowMs: 60_000,
    max: 2,
    message: "Too many requests.",
    code: "RATE_LIMIT_EXCEEDED",
  });

  const server = await startServer((req, res, next) => {
    limiter(req, res, next);
  });

  try {
    const address = server.address();
    const response = await fetch(`http://127.0.0.1:${address.port}/`);

    assert.equal(response.status, 404);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test("createRateLimiter responds with 429 when limit is exceeded", async () => {
  const limiter = createRateLimiter({
    windowMs: 60_000,
    max: 1,
    message: "Too many requests.",
    code: "RATE_LIMIT_EXCEEDED",
  });

  const app = express();
  app.use(limiter);
  app.get("/", (req, res) => {
    res.status(200).json({ ok: true });
  });

  const server = await new Promise((resolve) => {
    const startedServer = app.listen(0, () => {
      resolve(startedServer);
    });
  });

  try {
    const address = server.address();

    const firstResponse = await fetch(`http://127.0.0.1:${address.port}/`);
    assert.equal(firstResponse.status, 200);

    const secondResponse = await fetch(`http://127.0.0.1:${address.port}/`);
    const payload = await secondResponse.json();

    assert.equal(secondResponse.status, 429);
    assert.equal(payload.success, false);
    assert.equal(payload.message, "Too many requests.");
    assert.equal(payload.error.code, "RATE_LIMIT_EXCEEDED");
    assert.equal(payload.error.details.retryAfterSeconds, 60);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});
