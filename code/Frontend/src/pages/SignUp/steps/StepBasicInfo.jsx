import React from "react";

function StepBasicInfo({ formData, onChange, onNext, onBack }) {
  const handleChange = (e) => {
    onChange(e.target.name, e.target.value);
  };

  const isUser = formData.accountType === "user";
  
  const isValid = isUser
    ? formData.firstName && formData.lastName && formData.dateOfBirth && formData.country
    : formData.orgName && formData.country && formData.orgType;

  return (
    <>
      <div className="eyebrow">Step 1 of 4</div>
      <h1 className="form-title">Basic information</h1>
      <p className="form-subtitle">
        {isUser ? "Tell us a little about yourself." : "Tell us about your organisation."}
      </p>

      {isUser ? (
        <>
          <div className="field">
            <label>First name</label>
            <input type="text" name="firstName" value={formData.firstName || ""} onChange={handleChange} />
          </div>
          <div className="field">
            <label>Last name</label>
            <input type="text" name="lastName" value={formData.lastName || ""} onChange={handleChange} />
          </div>
          <div className="field">
            <label>Date of birth</label>
            <input type="date" name="dateOfBirth" value={formData.dateOfBirth || ""} onChange={handleChange} />
          </div>
          <div className="field">
            <label>Country</label>
            <select name="country" value={formData.country || ""} onChange={handleChange}>
              <option value="">Select a country</option>
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
              <option value="LK">Sri Lanka</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </>
      ) : (
        <>
          <div className="field">
            <label>Organisation name</label>
            <input type="text" name="orgName" value={formData.orgName || ""} onChange={handleChange} />
          </div>
          <div className="field">
            <label>Registration number (optional)</label>
            <input type="text" name="registrationNumber" value={formData.registrationNumber || ""} onChange={handleChange} />
          </div>
          <div className="field">
            <label>Country</label>
            <select name="country" value={formData.country || ""} onChange={handleChange}>
              <option value="">Select a country</option>
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
              <option value="LK">Sri Lanka</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="field">
            <label>Organisation type</label>
            <select name="orgType" value={formData.orgType || ""} onChange={handleChange}>
              <option value="">Select a type</option>
              <option value="NGO">NGO</option>
              <option value="Social Enterprise">Social Enterprise</option>
              <option value="Charity">Charity</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </>
      )}

      <button className="btn-primary" onClick={onNext} disabled={!isValid}>
        Continue
      </button>
      <button className="btn-back" onClick={onBack}>
        Back
      </button>
    </>
  );
}

export default StepBasicInfo;
