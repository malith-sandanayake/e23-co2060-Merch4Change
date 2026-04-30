import React from "react";
import "./OrgCommunities.css";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const OrgCommunities = () => {
  return (
    <div className="communities-page flex-center">
      <div className="under-construction-card bg-card">
        <h2>Connected Communities</h2>
        <p className="text-muted">
          This section is currently under construction and will show the list of
          communities soon.
        </p>
        <Link to="/" className="back-link">
          <Home size={18} />
          <span>Back to Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default OrgCommunities;
