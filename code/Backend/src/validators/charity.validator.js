const CHARITY_CATEGORIES = [
  "health",
  "education",
  "environment",
  "humanitarian",
  "animal",
  "other",
];

const normalizeProofDocuments = (proofDocuments) => {
  if (!Array.isArray(proofDocuments)) {
    return [];
  }

  return proofDocuments
    .map((doc) => ({
      label: String(doc?.label ?? "").trim(),
      url: String(doc?.url ?? "").trim(),
    }))
    .filter((doc) => doc.label && doc.url);
};

export const validateCharityVerificationBody = (payload = {}) => {
  const errors = [];

  const publicName = String(payload.publicName ?? "").trim();
  const legalName = String(payload.legalName ?? "").trim();
  const description = String(payload.description ?? "").trim();
  const logoUrl = String(payload.logoUrl ?? "").trim();
  const contactEmail = String(payload.contactEmail ?? "").trim().toLowerCase();
  const website = String(payload.website ?? "").trim();
  const registrationNumber = String(payload.registrationNumber ?? "").trim();
  const category = String(payload.category ?? "other").trim().toLowerCase();
  const country = String(payload.country ?? "").trim();
  const address = String(payload.address ?? "").trim();
  const proofDocuments = normalizeProofDocuments(payload.proofDocuments);

  if (!publicName || publicName.length < 2) {
    errors.push("publicName is required and must be at least 2 characters.");
  }

  if (!registrationNumber) {
    errors.push("registrationNumber is required.");
  }

  if (!CHARITY_CATEGORIES.includes(category)) {
    errors.push(`category must be one of: ${CHARITY_CATEGORIES.join(", ")}.`);
  }

  if (proofDocuments.length === 0) {
    errors.push("At least one proof document with label and URL is required.");
  }

  return {
    value: {
      publicName,
      legalName,
      description,
      logoUrl,
      contactEmail,
      website,
      registrationNumber,
      category,
      country,
      address,
      proofDocuments,
    },
    errors,
  };
};

export const validateCharityRejectBody = (payload = {}) => {
  const reason = String(payload.reason ?? "").trim();
  const errors = [];

  if (reason.length < 5) {
    errors.push("reason is required and must be at least 5 characters.");
  }

  return {
    value: { reason },
    errors,
  };
};
