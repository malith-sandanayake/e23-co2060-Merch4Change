const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const normalizePayload = (payload) => ({
  ...payload,
  email: typeof payload.email === "string" ? payload.email.toLowerCase().trim() : payload.email,
  username:
    typeof payload.username === "string" ? payload.username.toLowerCase().trim() : payload.username,
  firstName: typeof payload.firstName === "string" ? payload.firstName.trim() : payload.firstName,
  lastName: typeof payload.lastName === "string" ? payload.lastName.trim() : payload.lastName,
});

export const validateRegisterBody = (payload = {}) => {
  const normalized = normalizePayload(payload);
  const errors = [];

  if (!normalized.fullName || typeof normalized.fullName !== "string") {
    errors.push("fullName is required and must be a string.");
  }

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
