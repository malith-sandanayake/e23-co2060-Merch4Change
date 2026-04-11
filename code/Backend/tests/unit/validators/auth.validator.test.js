import test from "node:test";
import assert from "node:assert/strict";

import { validateLoginBody, validateRegisterBody } from "../../../src/validators/auth.validator.js";

test("validateRegisterBody normalizes and accepts valid payload", () => {
  const result = validateRegisterBody({
    firstName: "  Jane  ",
    lastName: "  Doe  ",
    userName: "  janedoe  ",
    email: "  JANE@EXAMPLE.COM  ",
    password: "pass1234",
    confirmPassword: "pass1234",
    accountType: " user ",
  });

  assert.deepEqual(result.errors, []);
  assert.equal(result.value.firstName, "Jane");
  assert.equal(result.value.lastName, "Doe");
  assert.equal(result.value.userName, "janedoe");
  assert.equal(result.value.email, "jane@example.com");
  assert.equal(result.value.accountType, "user");
});

test("validateRegisterBody returns validation errors", () => {
  const result = validateRegisterBody({
    firstName: "A",
    lastName: "A",
    userName: "A",
    email: "bad",
    password: "short",
    confirmPassword: "different",
    accountType: "admin",
  });

  assert.equal(result.errors.length > 0, true);
  assert.equal(result.errors.some((message) => message.includes("Unsupported accountType")), true);
});

test("validateLoginBody normalizes valid login payload", () => {
  const result = validateLoginBody({
    email: "  USER@Example.com ",
    password: "secret",
  });

  assert.deepEqual(result.errors, []);
  assert.equal(result.value.email, "user@example.com");
});

test("validateLoginBody catches missing credentials", () => {
  const result = validateLoginBody({
    email: "not-an-email",
  });

  assert.equal(result.errors.some((message) => message.includes("email must be a valid")), true);
  assert.equal(result.errors.some((message) => message.includes("password is required")), true);
});