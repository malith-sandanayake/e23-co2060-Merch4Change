import test from "node:test";
import assert from "node:assert/strict";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { createMockResponse, nextTick } from "../helpers/http.js";
import User from "../../../src/models/User.js";
import {
  login,
  me,
  register,
} from "../../../src/controllers/auth.controller.js";

test("register creates user and returns auth payload", async () => {
  const originalHash = bcrypt.hash;
  const originalSign = jwt.sign;
  const originalFindOne = User.findOne;
  const originalCreate = User.create;

  bcrypt.hash = async () => "hashed-pass";
  jwt.sign = () => "signed-token";
  User.findOne = async () => null;
  User.create = async () => ({
    _id: "u1",
    firstName: "Jane",
    lastName: "Doe",
    userName: "jane",
    email: "jane@example.com",
    accountType: "individual",
  });

  const req = {
    body: {
      firstName: "Jane",
      lastName: "Doe",
      userName: "jane",
      email: "JANE@EXAMPLE.COM",
      password: "Pass1234",
      accountType: "user",
    },
  };
  const res = createMockResponse();
  let nextArg;

  try {
    register(req, res, (error) => {
      nextArg = error;
    });
    await nextTick();
  } finally {
    bcrypt.hash = originalHash;
    jwt.sign = originalSign;
    User.findOne = originalFindOne;
    User.create = originalCreate;
  }

  assert.equal(nextArg, undefined);
  assert.equal(res.statusCode, 201);
  assert.equal(res.payload.success, true);
  assert.equal(res.payload.data.token, "signed-token");
  assert.equal(res.payload.data.user.userName, "jane");
});

test("register rejects duplicate email", async () => {
  const originalFindOne = User.findOne;
  User.findOne = async () => ({ _id: "existing" });

  const req = {
    body: {
      firstName: "Jane",
      lastName: "Doe",
      userName: "jane",
      email: "jane@example.com",
      password: "Pass1234",
      accountType: "user",
    },
  };
  const res = createMockResponse();
  let nextArg;

  try {
    register(req, res, (error) => {
      nextArg = error;
    });
    await nextTick();
  } finally {
    User.findOne = originalFindOne;
  }

  assert.equal(nextArg.name, "AppError");
  assert.equal(nextArg.code, "EMAIL_ALREADY_IN_USE");
});

test("login returns INVALID_CREDENTIALS when user does not exist", async () => {
  const originalFindOne = User.findOne;
  User.findOne = () => ({
    select: async () => null,
  });

  const req = {
    body: {
      email: "missing@example.com",
      password: "Pass1234",
    },
  };
  const res = createMockResponse();
  let nextArg;

  try {
    login(req, res, (error) => {
      nextArg = error;
    });
    await nextTick();
  } finally {
    User.findOne = originalFindOne;
  }

  assert.equal(nextArg.name, "AppError");
  assert.equal(nextArg.code, "INVALID_CREDENTIALS");
});

test("login returns INVALID_CREDENTIALS when password mismatch", async () => {
  const originalFindOne = User.findOne;
  const originalCompare = bcrypt.compare;

  User.findOne = () => ({
    select: async () => ({
      _id: "u1",
      password: "hash",
      accountType: "individual",
    }),
  });
  bcrypt.compare = async () => false;

  const req = {
    body: {
      email: "jane@example.com",
      password: "wrong",
    },
  };
  const res = createMockResponse();
  let nextArg;

  try {
    login(req, res, (error) => {
      nextArg = error;
    });
    await nextTick();
  } finally {
    User.findOne = originalFindOne;
    bcrypt.compare = originalCompare;
  }

  assert.equal(nextArg.name, "AppError");
  assert.equal(nextArg.code, "INVALID_CREDENTIALS");
});

test("login rejects unsupported account type", async () => {
  const originalFindOne = User.findOne;
  const originalCompare = bcrypt.compare;

  User.findOne = () => ({
    select: async () => ({
      _id: "u1",
      password: "hash",
      accountType: "admin",
    }),
  });
  bcrypt.compare = async () => true;

  const req = {
    body: {
      email: "jane@example.com",
      password: "Pass1234",
    },
  };
  const res = createMockResponse();
  let nextArg;

  try {
    login(req, res, (error) => {
      nextArg = error;
    });
    await nextTick();
  } finally {
    User.findOne = originalFindOne;
    bcrypt.compare = originalCompare;
  }

  assert.equal(nextArg.name, "AppError");
  assert.equal(nextArg.code, "INVALID_ACCOUNT_TYPE");
});

test("login returns token payload when credentials are valid", async () => {
  const originalFindOne = User.findOne;
  const originalCompare = bcrypt.compare;
  const originalSign = jwt.sign;

  User.findOne = () => ({
    select: async () => ({
      _id: "u1",
      fullName: "Jane",
      email: "jane@example.com",
      password: "hash",
      accountType: "organization",
    }),
  });
  bcrypt.compare = async () => true;
  jwt.sign = () => "jwt-token";

  const req = {
    body: {
      email: "jane@example.com",
      password: "Pass1234",
    },
  };
  const res = createMockResponse();
  let nextArg;

  try {
    login(req, res, (error) => {
      nextArg = error;
    });
    await nextTick();
  } finally {
    User.findOne = originalFindOne;
    bcrypt.compare = originalCompare;
    jwt.sign = originalSign;
  }

  assert.equal(nextArg, undefined);
  assert.equal(res.statusCode, 200);
  assert.equal(res.payload.data.token, "jwt-token");
  assert.equal(res.payload.data.loginType, "organization");
});

test("me returns current user from request", async () => {
  const req = {
    user: {
      _id: "u1",
      fullName: "Jane",
    },
  };
  const res = createMockResponse();

  me(req, res, () => {});
  await nextTick();

  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.payload.data.user, req.user);
});
