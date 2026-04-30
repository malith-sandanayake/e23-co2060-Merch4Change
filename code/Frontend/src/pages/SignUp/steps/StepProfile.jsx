import React, { useRef, useState } from 'react';

const MAX_BIO = 150;

export default function StepProfile({ formData, onChange, onNext, onBack, onSkip, isSubmitting, errorMsg }) {
  const fileRef = useRef();
  const [preview, setPreview] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    onChange('photo', file);
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const bioLength = (formData.bio || '').length;

  return (
    <div>
      <button className="signup-back" onClick={onBack}>← Back</button>
      <p className="signup-eyebrow">Step 3 of 3</p>
      <h1 className="signup-title">Set up your profile</h1>
      <p className="signup-subtitle">This is how others will see you on Merch4Change.</p>

      <div className="photo-upload-area">
        <div className="photo-upload-circle" onClick={() => fileRef.current.click()} title="Upload profile photo">
          {preview
            ? <img src={preview} alt="Profile preview" />
            : <div className="photo-upload-placeholder">
                <svg viewBox="0 0 24 24" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <span>Upload photo</span>
              </div>
          }
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display:'none' }} onChange={handlePhotoChange} />
      </div>

      <div className="signup-field">
        <label className="signup-label">Bio / About</label>
        <textarea className="signup-textarea" placeholder="Write a short intro about yourself…"
          maxLength={MAX_BIO} value={formData.bio}
          onChange={e => onChange('bio', e.target.value)} />
        <div className="char-count">{bioLength} / {MAX_BIO}</div>
      </div>

      <div className="signup-field">
        <label className="signup-label">
          Website URL <span style={{ color:'#bbb', fontSize:12 }}>(optional)</span>
        </label>
        <input className="signup-input" type="url" placeholder="https://yourwebsite.com"
          value={formData.website} onChange={e => onChange('website', e.target.value)} />
      </div>

      <div className="signup-field">
        <label className="signup-label">
          Social handle <span style={{ color:'#bbb', fontSize:12 }}>(optional)</span>
        </label>
        <div className="signup-input-adornment">
          <span className="adornment-prefix">@</span>
          <input className="signup-input" type="text" placeholder="yourhandle"
            value={formData.social} onChange={e => onChange('social', e.target.value)} />
        </div>
      </div>

      {errorMsg && (
        <div style={{ color:'#e24b4a', fontSize:13, marginBottom:10, lineHeight:1.5 }}>
          {errorMsg}
        </div>
      )}

      <button className="signup-btn" onClick={onNext} disabled={isSubmitting} style={{ marginTop:8 }}>
        {isSubmitting ? 'Creating your account…' : 'Continue'}
      </button>

      <div className="signup-skip" onClick={onSkip}>Skip for now</div>
    </div>
  );
}
