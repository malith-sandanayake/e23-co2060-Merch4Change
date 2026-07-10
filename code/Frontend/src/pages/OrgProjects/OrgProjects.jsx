import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../../context/Context";
import { Heart, Plus, X, ArrowLeft } from "lucide-react";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./OrgProjects.css";

const OrgProjects = () => {
  const { username } = useParams();
  const { user, accessToken } = useAuth();
  
  const [profile, setProfile] = useState(null);
  const [charity, setCharity] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", goalAmount: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const isOwner = user?.userName === username;

  useEffect(() => {
    const fetchOrgProfile = async () => {
      try {
        const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
        const response = await fetch(`${apiBaseUrl}/api/v1/orgs/profile/${username}`);
        const data = await response.json();
        
        if (response.ok && data.success) {
          setProfile(data.data.user);
          setCharity(data.data.charity);
          setProjects(data.data.projects || []);
        } else {
          setError(data.message || "Failed to load organization projects.");
        }
      } catch (err) {
        setError("Network error occurred.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrgProfile();
  }, [username]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);
    
    try {
      const apiBaseUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      
      const response = await fetch(`${apiBaseUrl}/api/v1/orgs/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        },
        body: JSON.stringify(form)
      });
      
      const data = await response.json();
      if (response.ok && data.success) {
        setProjects(prev => [data.data.project, ...prev]);
        setIsModalOpen(false);
        setForm({ title: "", description: "", goalAmount: "" });
      } else {
        setFormError(data.message || "Failed to create project.");
      }
    } catch (err) {
      setFormError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="org-projects-loading">Loading projects...</div>;
  if (error) return <div className="org-projects-error">{error}</div>;

  return (
    <div className="luminous-app">
      <div className="lum-layout">
        <Sidebar setIsSidebarCollapsed={() => {}} />
        <main className="lum-main-content">
          <div className="org-projects-container">
      <div className="org-projects-header">
        <div className="org-projects-header-text">
          <Link to={`/profile/${username}`} className="org-projects-back">
            <ArrowLeft size={18} /> Back to Profile
          </Link>
          <h2>Projects by {profile?.firstName || username}</h2>
        </div>
        
        {isOwner && charity?.verificationStatus === "verified" && (
          <button className="org-projects-add-btn" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Add New Project
          </button>
        )}
      </div>

      {isOwner && charity?.verificationStatus !== "verified" && (
        <div className="org-projects-verification-notice">
          <div className="org-projects-verification-text">
            <h3>Almost there! 🚀</h3>
            <p>To ensure trust and safety in our community, we just need to quickly verify your organization's details before you can start publishing funding projects.</p>
          </div>
          <Link to="/charity/verify" className="org-projects-verify-btn">
            Start Verification Process
          </Link>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="org-projects-empty">
          <p>No projects have been added yet.</p>
        </div>
      ) : (
        <div className="org-projects-grid">
          {projects.map(project => (
            <div key={project.id} className="org-project-card">
              <h3>{project.title}</h3>
              <p className="org-project-desc">{project.description}</p>
              
              <div className="org-project-progress">
                <div className="org-project-stats">
                  <span>LKR {project.collectedAmount.toLocaleString()} raised</span>
                  <span>of LKR {project.goalAmount.toLocaleString()}</span>
                </div>
                <div className="org-project-bar">
                  <div 
                    className="org-project-bar-fill" 
                    style={{ width: `${Math.min(100, (project.collectedAmount / project.goalAmount) * 100)}%` }} 
                  />
                </div>
              </div>
              
              <div className="org-project-footer">
                <span className={`org-project-status status-${project.status}`}>
                  {project.status.toUpperCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="org-modal-overlay">
          <div className="org-modal-content">
            <div className="org-modal-header">
              <h3>Create New Project</h3>
              <button className="org-modal-close" onClick={() => setIsModalOpen(false)}><X size={20} /></button>
            </div>
            
            <form onSubmit={handleCreateProject} className="org-modal-form">
              {formError && <div className="org-modal-error">{formError}</div>}
              
              <div className="org-form-group">
                <label>Project Title</label>
                <input 
                  type="text" 
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="E.g., Clean Water Initiative"
                  required 
                />
              </div>
              
              <div className="org-form-group">
                <label>Description</label>
                <textarea 
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the goals and impact of this project..."
                  rows={4}
                  required 
                />
              </div>
              
              <div className="org-form-group">
                <label>Goal Amount (LKR)</label>
                <input 
                  type="number" 
                  min="1"
                  value={form.goalAmount}
                  onChange={e => setForm({ ...form, goalAmount: e.target.value })}
                  placeholder="100000"
                  required 
                />
              </div>
              
              <div className="org-modal-actions">
                <button type="button" className="org-btn-cancel" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="org-btn-submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
          </div>
        )}
      </div>
    </main>
  </div>
</div>
  );
};

export default OrgProjects;
