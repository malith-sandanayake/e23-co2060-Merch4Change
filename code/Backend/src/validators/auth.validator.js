import { validateUserProfileCreateBody, validateOrganizationProfileCreateBody } from "./profile.validator.js";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordStrongPattern = /^(?=.*[A-Za-z])(?=.*\d).+$/;

const normalizeString = (value) => (typeof value === "string" ? value.trim() : value);

const normalizeAccountType = (accountType) => {
  if (typeof accountType !== "string") {
    return accountType;
  }

  const normalized = accountType.toLowerCase().trim();

  if (["user"].includes(normalized)) {
    return "individual";
  }

  if (["organization"].includes(normalized)) {
    return "organization";
  }

  return normalized;
};

const normalizePayload = (payload) => ({
  ...payload,
  fullName: normalizeString(payload.fullName),
  email: typeof payload.email === "string" ? payload.email.toLowerCase().trim() : payload.email,
<<<<<<< HEAD
  username:
    typeof payload.username === "string" ? payload.username.toLowerCase().trim() : payload.username,
  firstName: typeof payload.firstName === "string" ? payload.firstName.trim() : payload.firstName,
  lastName: typeof payload.lastName === "string" ? payload.lastName.trim() : payload.lastName,
=======
  password: typeof payload.password === "string" ? payload.password.trim() : payload.password,
  confirmPassword:
    typeof payload.confirmPassword === "string" ? payload.confirmPassword.trim() : payload.confirmPassword,
  accountType: normalizeAccountType(payload.accountType),
>>>>>>> backend
});

export const validateRegisterBody = (payload = {}) => {
  
  if (!payload.accountType) {
    return {
      value: normalizePayload(payload),
      errors: ["accountType is required."],
    };
  }

<<<<<<< HEAD
  if (normalized.firstName !== undefined) {
    if (typeof normalized.firstName !== "string" || normalized.firstName.length < 1) {
      errors.push("firstName must be a non-empty string.");
    }
  }

  if (normalized.lastName !== undefined) {
    if (typeof normalized.lastName !== "string" || normalized.lastName.length < 1) {
      errors.push("lastName must be a non-empty string.");
    }
  }

  if (!normalized.email || typeof normalized.email !== "string") {
    errors.push("email is required and must be a string.");
  } else if (!emailPattern.test(normalized.email)) {
    errors.push("email must be a valid email address.");
  }

  if (normalized.username !== undefined) {
    if (typeof normalized.username !== "string") {
      errors.push("username must be a string.");
    } else {
      const username = normalized.username.trim();
      if (username.length < 3 || username.length > 50) {
        errors.push("username must be between 3 and 50 characters.");
      }
    }
  }

  if (!normalized.password || typeof normalized.password !== "string") {
    errors.push("password is required and must be a string.");
  } else if (normalized.password.length < 8) {
    errors.push("password must be at least 8 characters.");
  }

  if (
    normalized.accountType &&
    !["individual", "organization"].includes(normalized.accountType)
  ) {
    errors.push("accountType must be either 'individual' or 'organization'.");
  }

  return {
    value: normalized,
    errors,
  };
=======
  const normalizedAccountType = normalizeAccountType(payload.accountType);

  if (!["individual", "organization"].includes(normalizedAccountType)) {
    return {
      value: normalizePayload(payload),
      errors: [`Unsupported accountType. Supported types are: individual, organization.`],
    };
  }
  if (normalizedAccountType === "individual") {
    return validateUserProfileCreateBody(payload);
  }
  if (normalizedAccountType === "organization") {
    return validateOrganizationProfileCreateBody(payload);
  }

>>>>>>> backend
};

export const validateLoginBody = (payload = {}) => {
  console.log("Login attempt with body:", payload);
  const normalized = normalizePayload(payload);
  const errors = [];

  if (!normalized.email || typeof normalized.email !== "string") {
    errors.push("email is required and must be a string.");
  } else if (!emailPattern.test(normalized.email)) {
    errors.push("email must be a valid email address.");
  }

  if (!normalized.password || typeof normalized.password !== "string") {
    errors.push("password is required and must be a string.");
  }
  console.log("Validate Login Body:");

  return {
    value: normalized,
    errors,
  };
};
