# Backend Testing Guide

This backend uses Node's built-in test runner.

## Run all unit tests

From the backend directory:

```bash
npm.cmd test
```

## Watch mode

```bash
npm.cmd run test:watch
```

## Run a single test file

```bash
node --test tests/unit/validators/profile.validator.test.js
```

## Notes

- Test files are in `tests/unit`.
- Use `npm.cmd` in PowerShell environments where `npm` script execution is restricted.
