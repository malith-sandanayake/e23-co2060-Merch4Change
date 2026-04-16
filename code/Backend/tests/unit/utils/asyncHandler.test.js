import test from "node:test";
import assert from "node:assert/strict";

import { nextTick } from "../helpers/http.js";
import asyncHandler from "../../../src/utils/asyncHandler.js";

test("asyncHandler executes wrapped handler", async () => {
  let called = false;
  const handler = asyncHandler(async () => {
    called = true;
  });

  handler({}, {}, () => {});
  await nextTick();

  assert.equal(called, true);
});

test("asyncHandler forwards rejected errors to next", async () => {
  const expected = new Error("boom");
  let nextArg;

  const handler = asyncHandler(async () => {
    throw expected;
  });

  handler({}, {}, (error) => {
    nextArg = error;
  });
  await nextTick();

  assert.equal(nextArg, expected);
});
