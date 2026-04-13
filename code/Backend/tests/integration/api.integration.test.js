import test, { after, before } from "node:test";
import assert from "node:assert/strict";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import app from "../../src/app.js";
import env from "../../src/config/env.js";
import OrganizationProfile from "../../src/models/OrganizationProfile.js";
import User from "../../src/models/User.js";

let server;
let baseUrl;

const originalFindOne = User.findOne;
const originalFindById = User.findById;
const originalCreate = User.create;
const originalOrgFindOne = OrganizationProfile.findOne;
const originalOrgCreate = OrganizationProfile.create;
const originalHash = bcrypt.hash;
const originalCompare = bcrypt.compare;
const originalSign = jwt.sign;

const restoreMocks = () => {
  User.findOne = originalFindOne;
  User.findById = originalFindById;
  User.create = originalCreate;
  OrganizationProfile.findOne = originalOrgFindOne;
  OrganizationProfile.create = originalOrgCreate;
  bcrypt.hash = originalHash;
  bcrypt.compare = originalCompare;
  jwt.sign = originalSign;
};

before(async () => {
  server = await new Promise((resolve) => {
    const started = app.listen(0, () => resolve(started));
  });

  const address = server.address();
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  restoreMocks();
  await new Promise((resolve) => server.close(resolve));
});

test("POST /api/v1/auth/register returns validation error when accountType is missing", async () => {
  restoreMocks();

  const response = await fetch(`${baseUrl}/api/v1/auth/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      firstName: "Jane",
      lastName: "Doe",
      userName: "jane",
      email: "jane@example.com",
      password: "Pass1234",
    }),
  });
  const payload = await response.json();

  assert.equal(response.status, 400);
  assert.equal(payload.success, false);
  assert.equal(payload.error.code, "VALIDATION_ERROR");
});

test("POST /api/v1/auth/register creates an individual profile", async () => {
  restoreMocks();

  bcrypt.hash = async () => "hashed-pass";
  jwt.sign = () => "register-token";
  User.findOne = async () => null;
  User.create = async (data) => ({
    _id: "user-1",
    ...data,
  });

  const response = await fetch(`${baseUrl}/api/v1/auth/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      firstName: "Jane",
      lastName: "Doe",
      userName: "jane",
      email: "JANE@EXAMPLE.COM",
      password: "Pass1234",
      accountType: "user",
    }),
  });
  const payload = await response.json();

  assert.equal(response.status, 201);
  assert.equal(payload.success, true);
  assert.equal(payload.data.token, "register-token");
  assert.equal(payload.data.user.userName, "jane");
  assert.equal(payload.data.user.email, "jane@example.com");
});

test("POST /api/v1/auth/register creates an organization profile", async () => {
  restoreMocks();

  bcrypt.hash = async () => "hashed-pass";
  jwt.sign = () => "org-register-token";
  User.findOne = async () => null;
  OrganizationProfile.findOne = async () => null;
  User.create = async (data) => ({
    _id: "org-user-1",
    ...data,
  });
  OrganizationProfile.create = async (data) => ({
    _id: "org-profile-1",
    createdAt: "2026-04-13T00:00:00.000Z",
    ...data,
  });

  const response = await fetch(`${baseUrl}/api/v1/auth/register`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      orgName: "Green Earth Foundation",
      email: "ORG@EXAMPLE.COM",
      password: "Pass1234",
      phone: "+1 555 123 4567",
      address: "12 Charity Avenue",
      website: "https://greenearth.org",
      accountType: "organization",
    }),
  });
  const payload = await response.json();

  assert.equal(response.status, 201);
  assert.equal(payload.success, true);
  assert.equal(payload.data.token, "org-register-token");
  assert.equal(payload.data.user.accountType, "organization");
  assert.equal(payload.data.user.email, "org@example.com");
  assert.equal(payload.data.profile.orgName, "Green Earth Foundation");
});

test("POST /api/v1/auth/login returns auth payload for valid credentials", async () => {
  restoreMocks();

  User.findOne = () => ({
    select: async () => ({
      _id: "user-2",
      userName: "jane",
      email: "jane@example.com",
      password: "stored-hash",
      accountType: "organization",
    }),
  });
  bcrypt.compare = async () => true;
  jwt.sign = () => "login-token";

  const response = await fetch(`${baseUrl}/api/v1/auth/login`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      email: "jane@example.com",
      password: "Pass1234",
    }),
  });
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.success, true);
  assert.equal(payload.data.token, "login-token");
  assert.equal(payload.data.loginType, "organization");
  assert.equal(payload.data.user.userName, "jane");
});

test("GET /api/v1/profile/me rejects requests without a bearer token", async () => {
  restoreMocks();

  const response = await fetch(`${baseUrl}/api/v1/profile/me`);
  const payload = await response.json();

  assert.equal(response.status, 401);
  assert.equal(payload.success, false);
  assert.equal(payload.error.code, "TOKEN_MISSING");
});

test("GET /api/v1/profile/me returns current user for a valid token", async () => {
  restoreMocks();

  const token = jwt.sign({ userId: "user-3" }, env.jwtSecret, { expiresIn: "1h" });
  User.findById = () => ({
    select: async () => ({
      _id: "user-3",
      userName: "current-user",
      accountType: "individual",
      email: "current@example.com",
    }),
  });

  const response = await fetch(`${baseUrl}/api/v1/profile/me`, {
    headers: {
      authorization: `Bearer ${token}`,
    },
  });
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.success, true);
  assert.equal(payload.data.user.userName, "current-user");
  assert.equal(payload.data.user.email, "current@example.com");
});