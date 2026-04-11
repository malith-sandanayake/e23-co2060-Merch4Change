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
  password: typeof payload.password === "string" ? payload.password.trim() : payload.password,
  confirmPassword:
    typeof payload.confirmPassword === "string" ? payload.confirmPassword.trim() : payload.confirmPassword,
  accountType: normalizeAccountType(payload.accountType),
});

export const validateRegisterBody = (payload = {}) => {
  
  if (!payload.accountType) {
    return {
      value: normalizePayload(payload),
      errors: ["accountType is required. in validator"],
    };
  }
  console.log("validation done");

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

};

export const validateLoginBody = (payload = {}) => {
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

  return {
    value: normalized,
    errors,
  };
};
