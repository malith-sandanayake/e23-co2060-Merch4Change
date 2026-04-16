import test from "node:test";
import assert from "node:assert/strict";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { createMockResponse, nextTick } from "../helpers/http.js";
import OrganizationProfile from "../../../src/models/OrganizationProfile.js";
import User from "../../../src/models/User.js";

// Note: Updated path from constructors to controllers
import {
  createUserProfile,
  createOrganizationProfile,
  getMe, // Updated name to match your routes
} from "../../../src/controllers/profile.controller.js";

/**
 * @section USER REGISTRATION TESTS
 */
test("createUserProfile rejects duplicate email", async () => {
  const originalFindOne = User.findOne;
  User.findOne = async () => ({ _id: "existing" });

  const req = {
    body: {
      firstName: "John",
      lastName: "Doe",
      userName: "johndoe",
      email: "user@example.com",
      password: "Pass1234",
    },
  };
  const res = createMockResponse();
  let nextArg;

  try {
    await createUserProfile(req, res, (error) => {
      nextArg = error;
    });
    await nextTick();
  } finally {
    User.findOne = originalFindOne;
  }

  assert.equal(nextArg.name, "AppError");
  assert.equal(nextArg.code, "EMAIL_ALREADY_IN_USE");
});

test("createUserProfile returns created user", async () => {
  const originalFindOne = User.findOne;
  const originalCreateUser = User.create;
  const originalHash = bcrypt.hash;
  const originalSign = jwt.sign;

  User.findOne = async () => null;
  User.create = async () => ({
    _id: "u-org",
    firstName: "john",
    lastName: "Doe",
    userName: "johndoe",
    email: "user@example.com",
    accountType: "individual",
  });
  bcrypt.hash = async () => "hashed";
  jwt.sign = () => "user-token";

  const req = {
    body: {
      firstName: "john",
      lastName: "Doe",
      userName: "johndoe",
      email: "user@example.com",
      password: "Pass1234",
      accountType: "individual",
    },
  };
  const res = createMockResponse();

  try {
    await createUserProfile(req, res, () => {});
    await nextTick();
  } finally {
    User.findOne = originalFindOne;
    User.create = originalCreateUser;
    bcrypt.hash = originalHash;
    jwt.sign = originalSign;
  }

  assert.equal(res.statusCode, 201);
  assert.equal(res.payload.data.token, "user-token");
  assert.equal(res.payload.data.user.accountType, "individual");
});

/**
 * @section SESSION TESTS
 */
test("getMe returns current user from request", async () => {
  const req = {
    user: {
      _id: "u1",
      fullName: "Jane",
    },
  };
  const res = createMockResponse();

  await getMe(req, res, () => {});
  await nextTick();

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.payload.data, { _id: "u1", fullName: "Jane" });
});