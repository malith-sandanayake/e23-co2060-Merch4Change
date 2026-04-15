import test from "node:test";
import assert from "node:assert/strict";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { createMockResponse, nextTick } from "../helpers/http.js";
import OrganizationProfile from "../../../src/models/OrganizationProfile.js";
import User from "../../../src/models/User.js";
import {
  createUserProfile,
  createOrganizationProfile,
} from "../../../src/constructors/profile.creator.js";

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
    createUserProfile(req, res, (error) => {
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
  let nextArg;

  try {
    createUserProfile(req, res, (error) => {
      nextArg = error;
    });
    await nextTick();
  } finally {
    User.findOne = originalFindOne;
    User.create = originalCreateUser;
    bcrypt.hash = originalHash;
    jwt.sign = originalSign;
  }

  assert.equal(nextArg, undefined);
  assert.equal(res.statusCode, 201);
  assert.equal(res.payload.data.token, "user-token");
  assert.equal(res.payload.data.user.accountType, "individual");
  assert.equal(res.payload.data.user.userName, "johndoe");
});

test("createOrganizationProfile rejects duplicate email", async () => {
  const originalFindOne = User.findOne;
  const originalOrgFindOne = OrganizationProfile.findOne;
  OrganizationProfile.findOne = async () => null;
  User.findOne = async () => ({ _id: "existing" });

  const req = {
    body: {
      orgName: "Org",
      email: "org@example.com",
      password: "Pass1234",
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
  assert.equal(nextArg.code, "EMAIL_ALREADY_IN_USE");
});

test("createOrganizationProfile returns created user and profile", async () => {
  const originalFindOne = User.findOne;
  const originalOrgFindOne = OrganizationProfile.findOne;
  const originalCreateUser = User.create;
  const originalCreateProfile = OrganizationProfile.create;
  const originalHash = bcrypt.hash;
  const originalSign = jwt.sign;

  User.findOne = async () => null;
  OrganizationProfile.findOne = async () => null;
  User.create = async () => ({
    _id: "u-org",
    firstName: "Eco Org",
    lastName: "Eco Org",
    userName: "ecoorg",
    email: "eco@example.org",
    accountType: "organization",
  });
  OrganizationProfile.create = async () => ({
    _id: "p1",
    orgName: "Eco Org",
    phone: "123456789",
    address: "addr",
    website: "https://eco.org",
    createdAt: "2026-01-01T00:00:00.000Z",
  });
  bcrypt.hash = async () => "hashed";
  jwt.sign = () => "org-token";

  const req = {
    body: {
      orgName: "Eco Org",
      email: "ECO@EXAMPLE.ORG",
      password: "Pass1234",
      phone: "123456789",
      address: "addr",
      website: "https://eco.org",
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
    User.create = originalCreateUser;
    OrganizationProfile.create = originalCreateProfile;
    bcrypt.hash = originalHash;
    jwt.sign = originalSign;
  }

  assert.equal(nextArg, undefined);
  assert.equal(res.statusCode, 201);
  assert.equal(res.payload.data.token, "org-token");
  assert.equal(res.payload.data.user.accountType, "organization");
  assert.equal(res.payload.data.user.userName, "ecoorg");
  assert.equal(res.payload.data.profile.orgName, "Eco Org");
});
