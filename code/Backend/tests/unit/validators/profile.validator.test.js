import test from "node:test";
import assert from "node:assert/strict";

import { validateOrganizationProfileCreateBody } from "../../../src/validators/profile.validator.js";

test("validateOrganizationProfileCreateBody accepts valid payload", () => {
  const result = validateOrganizationProfileCreateBody({
    orgName: "  Green Org  ",
    email: "  ORG@EXAMPLE.COM ",
    password: "Pass12345",
    confirmPassword: "Pass12345",
    phone: " +94 77 1234567 ",
    address: "  No 1, Main Street  ",
    website: "https://example.org",
  });

  assert.deepEqual(result.errors, []);
  assert.equal(result.value.orgName, "Green Org");
  assert.equal(result.value.email, "org@example.com");
  assert.equal(result.value.phone, "+94 77 1234567");
});

test("validateOrganizationProfileCreateBody catches invalid fields", () => {
  const result = validateOrganizationProfileCreateBody({
    orgName: "A",
    email: "invalid",
    password: "weak",
    confirmPassword: "mismatch",
    phone: "abc",
    website: "ftp://example.org",
    address: "x".repeat(251),
  });

  assert.equal(result.errors.length > 0, true);
  assert.equal(result.errors.some((message) => message.includes("orgName must be between 2 and 120")), true);
  assert.equal(result.errors.some((message) => message.includes("email must be a valid")), true);
  assert.equal(result.errors.some((message) => message.includes("password must be at least 8")), true);
  assert.equal(result.errors.some((message) => message.includes("confirmPassword must match")), true);
  assert.equal(result.errors.some((message) => message.includes("phone must be 7-20")), true);
  assert.equal(result.errors.some((message) => message.includes("address must not exceed 250")), true);
  assert.equal(result.errors.some((message) => message.includes("website must be a valid http or https URL")), true);
});

test("validateOrganizationProfileCreateBody flags malformed URL", () => {
  const result = validateOrganizationProfileCreateBody({
    orgName: "Valid Name",
    email: "valid@example.com",
    password: "Strong123",
    confirmPassword: "Strong123",
    website: "not-a-url",
  });

  assert.equal(result.errors.includes("website must be a valid URL."), true);
});