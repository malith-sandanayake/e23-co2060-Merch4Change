import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";

const runScript = (script, env = {}) => {
  return execFileSync(process.execPath, ["--input-type=module", "-e", script], {
    cwd: process.cwd(),
    env: { ...process.env, ...env },
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
  });
};

test("env module provides development defaults", () => {
  const output = runScript(
    "import env from './src/config/env.js'; console.log(JSON.stringify(env));",
    {
      NODE_ENV: "test",
      PORT: "",
      FRONTEND_URL: "",
      MONGODB_URI: "",
      JWT_SECRET: "",
      JWT_EXPIRES_IN: "",
    },
  );

  const parsed = JSON.parse(output.trim());
  assert.equal(parsed.nodeEnv, "test");
  assert.equal(parsed.port, 5000);
  assert.equal(parsed.frontendUrl, "http://localhost:5173");
  assert.equal(parsed.jwtSecret, "dev-secret-change-me");
  assert.equal(parsed.jwtExpiresIn, "7d");
});

test("env module throws in production when required vars are missing", () => {
  assert.throws(() => {
    runScript("import './src/config/env.js';", {
      NODE_ENV: "production",
      MONGODB_URI: "",
      JWT_SECRET: "present",
    });
  }, /Missing required environment variable: MONGODB_URI/);

  assert.throws(() => {
    runScript("import './src/config/env.js';", {
      NODE_ENV: "production",
      MONGODB_URI: "mongodb://localhost:27017/test",
      JWT_SECRET: "",
    });
  }, /Missing required environment variable: JWT_SECRET/);
});
