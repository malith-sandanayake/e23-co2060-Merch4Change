import test from "node:test";
import assert from "node:assert/strict";

import { createMockResponse, nextTick } from "../helpers/http.js";
import { me } from "../../../src/controllers/profile.controller.js";

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