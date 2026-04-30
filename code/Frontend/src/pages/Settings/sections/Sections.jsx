import React, { useState } from "react";
import "./SettingsSection.css";

function Toggle({ label, desc, badge, checked, onChange }) {
  return (
    <div className="s-toggle-row">
      <div className="s-toggle-row__info">
        <span className="s-toggle-row__label">{label}{badge && <span className="s-toggle-row__badge">{badge}</span>}</span>
        {desc && <span className="s-toggle-row__desc">{desc}</span>}
      </div>
      <label className="s-switch">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="s-switch__slider" />
      </label>
    </div>
  );
}

export function SecuritySection() {
  const [twoFA, setTwoFA] = useState(true);
  const [alerts, setAlerts] = useState(true);
  return (
    <div className="s-section">
      <h2 className="s-section__title">Account security</h2>
      <p className="s-section__desc">Manage your password and keep your account safe.</p>
      <div className="s-row"><label className="s-label">Current password</label><input className="s-input" type="password" placeholder="Enter current password" /></div>
      <div className="s-row"><label className="s-label">New password</label><input className="s-input" type="password" placeholder="Enter new password" /></div>
      <div className="s-row"><label className="s-label">Confirm new password</label><input className="s-input" type="password" placeholder="Confirm new password" /></div>
      <div className="s-divider" />
      <Toggle label="Two-factor authentication" desc="Require a code when logging in from a new device" badge="Recommended" checked={twoFA} onChange={() => setTwoFA(p => !p)} />
      <Toggle label="Login activity alerts" desc="Get notified when your account is accessed from a new location" checked={alerts} onChange={() => setAlerts(p => !p)} />
      <div className="s-divider" />
      <button className="s-btn s-btn--primary">Update password</button>
    </div>
  );
}

export function PrivacySection() {
  const [s, setS] = useState({ private: false, activity: true, messages: true, receipts: false });
  const tog = (k) => setS(p => ({ ...p, [k]: !p[k] }));
  return (
    <div className="s-section">
      <h2 className="s-section__title">Privacy</h2>
      <p className="s-section__desc">Control who can see your content and interact with you.</p>
      <Toggle label="Private account" desc="Only approved followers can see your posts" checked={s.private} onChange={() => tog("private")} />
      <Toggle label="Show activity status" desc="Let people see when you were last active" checked={s.activity} onChange={() => tog("activity")} />
      <Toggle label="Allow message requests" desc="Let people you don't follow send message requests" checked={s.messages} onChange={() => tog("messages")} />
      <Toggle label="Hide read receipts" desc="Others won't know when you've read their messages" checked={s.receipts} onChange={() => tog("receipts")} />
      <div className="s-divider" />
      <div className="s-row">
        <label className="s-label">Who can comment on your posts</label>
        <select className="s-input s-input--select" defaultValue="following">
          <option value="everyone">Everyone</option>
          <option value="followers">Followers only</option>
          <option value="following">People you follow</option>
          <option value="none">No one</option>
        </select>
      </div>
    </div>
  );
}

export function NotificationsSection() {
  const [s, setS] = useState({ likes: true, comments: true, followers: true, dms: true, email: false });
  const tog = (k) => setS(p => ({ ...p, [k]: !p[k] }));
  return (
    <div className="s-section">
      <h2 className="s-section__title">Notifications</h2>
      <p className="s-section__desc">Choose what you get notified about.</p>
      <Toggle label="Likes" desc="When someone likes your posts" checked={s.likes} onChange={() => tog("likes")} />
      <Toggle label="Comments" desc="When someone comments on your posts" checked={s.comments} onChange={() => tog("comments")} />
      <Toggle label="New followers" desc="When someone starts following you" checked={s.followers} onChange={() => tog("followers")} />
      <Toggle label="Direct messages" desc="When you receive a new message" checked={s.dms} onChange={() => tog("dms")} />
      <Toggle label="Email notifications" desc="Receive a summary of activity to your email" checked={s.email} onChange={() => tog("email")} />
    </div>
  );
}

export function AppearanceSection() {
  return (
    <div className="s-section">
      <h2 className="s-section__title">Appearance</h2>
      <p className="s-section__desc">Customize how the app looks for you.</p>
      <div className="s-row"><label className="s-label">Theme</label><select className="s-input s-input--select" defaultValue="system"><option value="system">System default</option><option value="light">Light</option><option value="dark">Dark</option></select></div>
      <div className="s-row"><label className="s-label">Font size</label><select className="s-input s-input--select" defaultValue="medium"><option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option></select></div>
      <div className="s-divider" />
      <button className="s-btn s-btn--primary">Save preferences</button>
    </div>
  );
}

export function LanguageSection() {
  return (
    <div className="s-section">
      <h2 className="s-section__title">Language</h2>
      <p className="s-section__desc">Choose your preferred language for the app.</p>
      <div className="s-row">
        <label className="s-label">App language</label>
        <select className="s-input s-input--select" defaultValue="en-US">
          <option value="en-US">English (US)</option>
          <option value="en-UK">English (UK)</option>
          <option value="si">Sinhala</option>
          <option value="ta">Tamil</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="ja">Japanese</option>
        </select>
      </div>
      <div className="s-divider" />
      <button className="s-btn s-btn--primary">Save</button>
    </div>
  );
}

export function HelpSection() {
  return (
    <div className="s-section">
      <h2 className="s-section__title">Help & support</h2>
      <p className="s-section__desc">Find answers or get in touch with the support team.</p>
      <div className="s-list-row"><span>Help center</span><span className="s-list-row__chevron">›</span></div>
      <div className="s-list-row"><span>Report a problem</span><span className="s-list-row__chevron">›</span></div>
      <div className="s-list-row"><span>Privacy policy</span><span className="s-list-row__chevron">›</span></div>
      <div className="s-divider" />
      <button className="s-btn s-btn--danger">Delete account</button>
    </div>
  );
}
