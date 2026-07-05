import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, AlertCircle } from "lucide-react";
import { getMyCharity } from "../../../services/charityApi";
import { getStoredUser } from "../../../utils/authStorage";
import "./OrganizationVerificationSection.css";

const STATUS_COPY = {
  unsubmitted: {
    title: "Verification not started",
    message: "Submit your organization details and proof documents to receive donations.",
    cta: "Start verification",
    href: "/charity/verify",
  },
  pending: {
    title: "Verification under review",
    message: "Your application is being reviewed by our admin team.",
    cta: "View application",
    href: "/charity/verify",
  },
  rejected: {
    title: "Verification rejected",
    message: "Update your details and resubmit your application.",
    cta: "Resubmit verification",
    href: "/charity/verify",
  },
  verified: {
    title: "Organization verified",
    message: "Your organization is verified and can receive donations.",
    cta: "View public profile",
    href: null,
  },
};

function OrganizationVerificationSection() {
  const [charity, setCharity] = useState(null);
  const [loading, setLoading] = useState(true);
  const storedUser = getStoredUser();

  useEffect(() => {
    getMyCharity()
      .then((response) => setCharity(response?.data?.charity || null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="org-verify-section">
        <p>Loading verification status...</p>
      </div>
    );
  }

  const status = charity?.verificationStatus || "unsubmitted";
  const copy = STATUS_COPY[status] || STATUS_COPY.unsubmitted;
  const profileHref = storedUser?.userName
    ? `/organization/${storedUser.userName}`
    : "/profile/me";

  return (
    <div className="org-verify-section">
      <h2 className="s-section__title">Organization verification</h2>
      <p className="s-section__desc">
        Verified organizations can receive coin donations and appear in the donations directory.
      </p>

      <div className={`org-verify-card org-verify-card--${status}`}>
        <div className="org-verify-card__header">
          <ShieldCheck size={20} />
          <div>
            <h3>{copy.title}</h3>
            <span className={`org-verify-badge org-verify-badge--${status}`}>{status}</span>
          </div>
        </div>

        <p>{copy.message}</p>

        {status === "rejected" && charity?.rejectionReason && (
          <div className="org-verify-rejection">
            <AlertCircle size={16} />
            <span>{charity.rejectionReason}</span>
          </div>
        )}

        {charity?.registrationNumber && (
          <p className="org-verify-meta">Registration #: {charity.registrationNumber}</p>
        )}

        <Link
          to={status === "verified" ? profileHref : copy.href}
          className="org-verify-link"
        >
          {copy.cta}
        </Link>
      </div>
    </div>
  );
}

export default OrganizationVerificationSection;
