import React from "react";
import "./OrgProjects.css";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const OrgProjects = () => {
  return (
    <div className="projects-page flex-center">
      <div className="under-construction-card bg-card">
        <h2>Total Projects</h2>
        <p className="text-muted">
          This page is currently under construction. Please check back later for
          detailed project list.
        </p>
        <Link to="/" className="back-link">
          <Home size={18} />
          <span>Back to Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default OrgProjects;
