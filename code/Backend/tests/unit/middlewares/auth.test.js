import test from "node:test";
import assert from "node:assert/strict";

import jwt from "jsonwebtoken";

import { nextTick } from "../helpers/http.js";
import User from "../../../src/models/User.js";
import protect from "../../../src/middlewares/auth.js";

test("protect rejects missing bearer token", async () => {
  const req = { headers: {} };
  let nextArg;

  protect(req, {}, (error) => {
    nextArg = error;
  });
  await nextTick();

  assert.equal(nextArg.name, "AppError");
  assert.equal(nextArg.code, "TOKEN_MISSING");
});

test("protect attaches user and calls next for valid token", async () => {
  const originalVerify = jwt.verify;
  const originalFindById = User.findById;

  jwt.verify = () => ({ userId: "user-1" });
  User.findById = () => ({
    select: async () => ({ _id: "user-1", fullName: "Jane" }),
  });

  const req = {
    headers: {
      authorization: "Bearer valid.token",
    },
  };
  let nextArg;

  try {
    protect(req, {}, (error) => {
      nextArg = error;
    });
    await nextTick();
  } finally {
    jwt.verify = originalVerify;
    User.findById = originalFindById;
  }

  assert.equal(nextArg, undefined);
  assert.deepEqual(req.user, { _id: "user-1", fullName: "Jane" });
});

test("protect returns INVALID_TOKEN when verification fails", async () => {
  const originalVerify = jwt.verify;
  jwt.verify = () => {
    throw new Error("jwt malformed");
  };

  const req = {
    headers: {
      authorization: "Bearer broken.token",
    },
  };
  let nextArg;

  try {
    protect(req, {}, (error) => {
      nextArg = error;
    });
    await nextTick();
  } finally {
    jwt.verify = originalVerify;
  }

  assert.equal(nextArg.name, "AppError");
  assert.equal(nextArg.code, "INVALID_TOKEN");
});