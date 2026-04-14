import test from "node:test";
import assert from "node:assert/strict";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { createMockResponse, nextTick } from "../helpers/http.js";
import OrganizationProfile from "../../../src/models/OrganizationProfile.js";
import User from "../../../src/models/User.js";
import { createOrganizationProfile, createUserProfile } from "../../../src/constructors/profile.creator.js";

test("createUserProfile creates a user and returns auth payload", async () => {
  const originalHash = bcrypt.hash;
  const originalSign = jwt.sign;
  const originalFindOne = User.findOne;
  const originalCreate = User.create;

  const findQueries = [];
  bcrypt.hash = async () => "hashed-pass";
  jwt.sign = () => "signed-token";
  User.findOne = async (query) => {
    findQueries.push(query);
    return null;
  };
  User.create = async (payload) => ({
    _id: "u1",
    ...payload,
  });

  const req = {
    body: {
      firstName: "Jane",
      lastName: "Doe",
      userName: "jane",
      email: "JANE@EXAMPLE.COM",
      password: "Pass1234",
    },
  };
  const res = createMockResponse();
  let nextArg;

  try {
    createUserProfile(req, res, (error) => {
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
  assert.deepEqual(findQueries, [{ email: "jane@example.com" }, { userName: "jane" }]);
});

test("createUserProfile rejects duplicate username", async () => {
  const originalFindOne = User.findOne;
  User.findOne = async (query) => {
    if (query.email) {
      return null;
    }

    if (query.userName) {
      return { _id: "existing-user" };
    }

    return null;
  };

  const req = {
    body: {
      firstName: "Jane",
      lastName: "Doe",
      userName: "jane",
      email: "jane@example.com",
      password: "Pass1234",
    },
  };
  const res = createMockResponse();
  let nextArg;

  try {
    createUserProfile(req, res, (error) => {
      nextArg = error;
    });
    await nextTick();
  } finally {
    User.findOne = originalFindOne;
  }

  assert.equal(nextArg.name, "AppError");
  assert.equal(nextArg.code, "USERNAME_ALREADY_IN_USE");
});

test("createOrganizationProfile creates a user and organization profile", async () => {
  const originalHash = bcrypt.hash;
  const originalSign = jwt.sign;
  const originalFindOne = User.findOne;
  const originalUserCreate = User.create;
  const originalOrgFindOne = OrganizationProfile.findOne;
  const originalOrgCreate = OrganizationProfile.create;

  const userQueries = [];
  const orgQueries = [];
  bcrypt.hash = async () => "hashed-pass";
  jwt.sign = () => "signed-token";
  User.findOne = async (query) => {
    userQueries.push(query);
    return null;
  };
  OrganizationProfile.findOne = async (query) => {
    orgQueries.push(query);
    return null;
  };
  User.create = async (payload) => ({
    _id: "u2",
    ...payload,
  });
  OrganizationProfile.create = async (payload) => ({
    _id: "p1",
    createdAt: "2026-04-13T00:00:00.000Z",
    ...payload,
  });

  const req = {
    body: {
      orgName: "Charity Org",
      email: "ORG@EXAMPLE.COM",
      password: "Pass1234",
      phone: "+1 555 000 1111",
      address: "123 Main Street",
      website: "https://example.org",
    },
  };
  const res = createMockResponse();
  let nextArg;

  try {
    createOrganizationProfile(req, res, (error) => {
      nextArg = error;
    });
    await nextTick();
  } finally {
    bcrypt.hash = originalHash;
    jwt.sign = originalSign;
    User.findOne = originalFindOne;
    User.create = originalUserCreate;
    OrganizationProfile.findOne = originalOrgFindOne;
    OrganizationProfile.create = originalOrgCreate;
  }

  assert.equal(nextArg, undefined);
  assert.equal(res.statusCode, 201);
  assert.equal(res.payload.success, true);
  assert.equal(res.payload.data.token, "signed-token");
  assert.equal(res.payload.data.user.userName, "charityorg");
  assert.equal(res.payload.data.profile.orgName, "Charity Org");
  assert.deepEqual(userQueries, [{ email: "org@example.com" }]);
  assert.deepEqual(orgQueries, [{ orgName: "Charity Org" }]);
});

test("createOrganizationProfile rejects duplicate organization name", async () => {
  const originalFindOne = User.findOne;
  const originalOrgFindOne = OrganizationProfile.findOne;

  User.findOne = async () => null;
  OrganizationProfile.findOne = async () => ({ _id: "existing-org" });

  const req = {
    body: {
      orgName: "Charity Org",
      email: "org@example.com",
      password: "Pass1234",
      phone: "+1 555 000 1111",
      address: "123 Main Street",
      website: "https://example.org",
    },
  };
  const res = createMockResponse();
  let nextArg;

  try {
    createOrganizationProfile(req, res, (error) => {
      nextArg = error;
    });
    await nextTick();
  } finally {
    User.findOne = originalFindOne;
    OrganizationProfile.findOne = originalOrgFindOne;
  }

  assert.equal(nextArg.name, "AppError");
  assert.equal(nextArg.code, "ORGNAME_ALREADY_IN_USE");
});