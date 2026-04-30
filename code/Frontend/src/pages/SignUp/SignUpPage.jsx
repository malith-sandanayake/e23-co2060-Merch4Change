import React, { useState } from 'react';
import './SignUpPage.css';
import StepAccountType from './steps/StepAccountType';
import StepBasicInfo    from './steps/StepBasicInfo';
import StepCredentials  from './steps/StepCredentials';
import StepProfile      from './steps/StepProfile';
import StepDone         from './steps/StepDone';

const TOTAL_STEPS = 4;

const LEFT_HEADLINES = {
  1: { main: 'What brings you', em: 'here?'         },
  2: { main: 'Tell us a little', em: 'about you.'   },
  3: { main: 'Keep your account', em: 'secure.'     },
  4: { main: 'Make it', em: 'yours.'                },
  5: { main: "You're all", em: 'set.'               },
};

export default function SignUpPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [formData, setFormData] = useState({
    accountType: '',
    firstName: '', lastName: '', dob: '', country: '',
    orgName: '', regNumber: '', orgType: '',
    email: '', username: '', password: '', confirmPassword: '',
    photo: null, bio: '', website: '', social: '',
  });

  const onChange = (field, value) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const isOrg  = formData.accountType === 'org';

      const body = isOrg
        ? {
            orgName:         formData.orgName,
            email:           formData.email,
            password:        formData.password,
            confirmPassword: formData.confirmPassword,
            website:         formData.website,
            accountType:     'organization',
          }
        : {
            firstName:       formData.firstName,
            lastName:        formData.lastName,
            fullName:        `${formData.firstName} ${formData.lastName}`.trim(),
            userName:        formData.username,
            email:           formData.email,
            password:        formData.password,
            confirmPassword: formData.confirmPassword,
            accountType:     'user',
          };

      const response = await fetch(`${apiUrl}/api/v1/auth/register`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMsg(data.message || 'Signup failed. Please try again.');
        return;
      }

      if (data?.data?.token) {
        localStorage.setItem('token', data.data.token);
      }

      setCurrentStep(5);
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onNext = () => {
    if (currentStep === 4) {
      handleSubmit();
    } else {
      setCurrentStep(s => Math.min(s + 1, 5));
    }
  };

  const onBack = () => setCurrentStep(s => Math.max(s - 1, 1));

  const headline = LEFT_HEADLINES[currentStep] || LEFT_HEADLINES[1];
  const leftMain = currentStep === 2 && formData.accountType === 'org'
    ? 'Tell us about your' : headline.main;
  const leftEm   = currentStep === 2 && formData.accountType === 'org'
    ? 'organisation.'      : headline.em;

  const stepProps = { formData, onChange, onNext, onBack };

  return (
    <div className="signup-page">
      <div className="signup-left">
        <div className="signup-brand">
          <div className="signup-brand-icon">
            <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z"/></svg>
          </div>
          <span className="signup-brand-name">Merch4Change</span>
        </div>

        <div className="signup-left-content">
          <p className="signup-tagline">
            {leftMain}<br /><em>{leftEm}</em>
          </p>
        </div>

        <div>
          <svg className="signup-dot-grid" viewBox="0 0 160 160">
            {Array.from({ length: 8 }).map((_, row) =>
              Array.from({ length: 8 }).map((_, col) => (
                <circle key={`${row}-${col}`} cx={col * 22 + 8} cy={row * 22 + 8} r="2" fill="#4a24e1" />
              ))
            )}
          </svg>
          <div className="signup-testimonial">
            <p className="signup-testimonial-text">
              "Merch4Change made it so easy to support causes I care about — just by shopping brands I already love."
            </p>
            <div className="signup-testimonial-author">
              <div className="signup-testimonial-avatar">SK</div>
              <div>
                <div className="signup-testimonial-name">Sasha Kim</div>
                <div className="signup-testimonial-role">Community Member</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="signup-right">
        {currentStep <= 4 && (
          <div className="signup-progress-wrapper">
            <div className="signup-progress-label">
              {currentStep === 1 ? 'Getting started' : `Step ${currentStep - 1} of ${TOTAL_STEPS - 1}`}
            </div>
            <div className="progress-bar">
              {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
                <div key={i} className={`progress-segment${i < currentStep ? ' active' : ''}`} />
              ))}
            </div>
          </div>
        )}

        {currentStep === 1 && <StepAccountType {...stepProps} />}
        {currentStep === 2 && <StepBasicInfo   {...stepProps} />}
        {currentStep === 3 && <StepCredentials {...stepProps} />}
        {currentStep === 4 && (
          <StepProfile {...stepProps} isSubmitting={isSubmitting} errorMsg={errorMsg} />
        )}
        {currentStep === 5 && <StepDone />}
      </div>
    </div>
  );
}
