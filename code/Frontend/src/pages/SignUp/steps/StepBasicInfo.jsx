import React from 'react';

const COUNTRIES = [
  'Sri Lanka','Australia','Canada','France','Germany',
  'India','Japan','New Zealand','Singapore',
  'United Kingdom','United States','Other',
];
const ORG_TYPES = ['NGO','Social Enterprise','Charity','Other'];

export default function StepBasicInfo({ formData, onChange, onNext, onBack }) {
  const isOrg = formData.accountType === 'org';

  const isValid = isOrg
    ? formData.orgName && formData.country
    : formData.firstName && formData.lastName && formData.dob && formData.country;

  return (
    <div>
      <button className="signup-back" onClick={onBack}>← Back</button>
      <p className="signup-eyebrow">Step 1 of 3</p>
      <h1 className="signup-title">Basic information</h1>
      <p className="signup-subtitle">
        {isOrg ? 'Tell us about your organisation.' : 'Tell us a little about yourself.'}
      </p>

      {!isOrg ? (
        <>
          <div className="signup-input-row">
            <div className="signup-field">
              <label className="signup-label">First name</label>
              <input className="signup-input" type="text" placeholder="Aiden"
                value={formData.firstName} onChange={e => onChange('firstName', e.target.value)} />
            </div>
            <div className="signup-field">
              <label className="signup-label">Last name</label>
              <input className="signup-input" type="text" placeholder="Silva"
                value={formData.lastName} onChange={e => onChange('lastName', e.target.value)} />
            </div>
          </div>
          <div className="signup-field">
            <label className="signup-label">Date of birth</label>
            <input className="signup-input" type="date"
              value={formData.dob} onChange={e => onChange('dob', e.target.value)} />
          </div>
          <div className="signup-field">
            <label className="signup-label">Country</label>
            <select className="signup-input" value={formData.country}
              onChange={e => onChange('country', e.target.value)}>
              <option value="">Select your country</option>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </>
      ) : (
        <>
          <div className="signup-field">
            <label className="signup-label">Organisation name</label>
            <input className="signup-input" type="text" placeholder="Green Future Foundation"
              value={formData.orgName} onChange={e => onChange('orgName', e.target.value)} />
          </div>
          <div className="signup-field">
            <label className="signup-label">
              Registration number <span style={{ color:'#bbb', fontSize:12 }}>(optional)</span>
            </label>
            <input className="signup-input" type="text" placeholder="e.g. PV 0012345"
              value={formData.regNumber} onChange={e => onChange('regNumber', e.target.value)} />
          </div>
          <div className="signup-field">
            <label className="signup-label">Country</label>
            <select className="signup-input" value={formData.country}
              onChange={e => onChange('country', e.target.value)}>
              <option value="">Select your country</option>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="signup-field">
            <label className="signup-label">Organisation type</label>
            <select className="signup-input" value={formData.orgType}
              onChange={e => onChange('orgType', e.target.value)}>
              <option value="">Select type</option>
              {ORG_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </>
      )}

      <button className="signup-btn" onClick={onNext} disabled={!isValid} style={{ marginTop:8 }}>
        Continue
      </button>
    </div>
  );
}
