import React, { useRef, useState } from "react";

function StepProfile({ formData, onChange, onNext, onBack, errorMsg }) {
  const fileInputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleChange = (e) => {
    onChange(e.target.name, e.target.value);
  };

  const handlePhotoClick = () => {
    fileInputRef.current.click();
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onChange("profilePhoto", file);
    }
  };

  return (
    <>
      <div className="eyebrow">Step 3 of 4</div>
      <h1 className="form-title">Set up your profile</h1>
      <p className="form-subtitle">Make it yours.</p>

      {errorMsg && <div className="error-message">{errorMsg}</div>}

      <div className="photo-upload" onClick={handlePhotoClick}>
        {previewUrl ? (
          <img src={previewUrl} alt="Profile preview" />
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
        )}
      </div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept="image/*"
        onChange={handlePhotoChange}
      />

      <div className="field">
        <label>Bio / About</label>
        <textarea
          name="bio"
          value={formData.bio || ""}
          onChange={handleChange}
          maxLength={150}
          rows={3}
          placeholder="Tell us a bit about yourself..."
        />
        <div className="bio-counter">
          {(formData.bio || "").length} / 150
        </div>
      </div>

      <div className="field">
        <label>Website URL (optional)</label>
        <input
          type="url"
          name="website"
          value={formData.website || ""}
          onChange={handleChange}
          placeholder="https://"
        />
      </div>

      <div className="field">
        <label>Social handle (optional)</label>
        <div className="username-shell">
          <span className="username-prefix">@</span>
          <input
            type="text"
            name="socialHandle"
            value={formData.socialHandle || ""}
            onChange={handleChange}
            className="username-input"
            placeholder="handle"
          />
        </div>
      </div>

      <button className="btn-primary" onClick={onNext}>
        Continue
      </button>
      <button className="btn-skip" onClick={onNext}>
        Skip for now
      </button>
      <button className="btn-back" onClick={onBack}>
        Back
      </button>
    </>
  );
}

export default StepProfile;
