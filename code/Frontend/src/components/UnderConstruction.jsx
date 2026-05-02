import React from 'react';
import { Construction, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './UnderConstruction.css';

export default function UnderConstruction() {
  const navigate = useNavigate();

  return (
    <div className="under-construction">
      <div className="uc-container">
        <button 
          className="uc-back-btn" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
          Go Back
        </button>
        
        <div className="uc-content">
          <div className="uc-icon-wrapper">
            <Construction size={64} className="uc-icon" />
          </div>
          
          <h1 className="uc-title">Under Construction</h1>
          
          <p className="uc-message">
            This page is currently being built and will be available soon.
          </p>
          
          <p className="uc-submessage">
            We're working hard to bring you this feature. Check back later!
          </p>
          
          <div className="uc-actions">
            <button 
              className="uc-home-btn" 
              onClick={() => navigate('/home')}
            >
              Go to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
