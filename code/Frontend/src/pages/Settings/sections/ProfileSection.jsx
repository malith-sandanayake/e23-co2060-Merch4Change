import React, { useEffect, useState } from "react";
import "./SettingsSection.css";
import { useRef } from "react";

function ProfileSection({ profileData = {}, onUpdate = () => {} }) {
  const [userName, setUserName] = useState(profileData.userName || "");
  const [fullName, setFullName] = useState(`${profileData.firstName || ""} ${profileData.lastName || ""}`.trim());
  const [bio, setBio] = useState(profileData.profileBio || "");
  const [website, setWebsite] = useState(profileData.userLink || "");
  const [email, setEmail] = useState(profileData.email || "");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setUserName(profileData.userName || "");
    setFullName(`${profileData.firstName || ""} ${profileData.lastName || ""}`.trim());
    setBio(profileData.profileBio || "");
    setWebsite(profileData.userLink || "");
    setEmail(profileData.email || "");
  }, [profileData]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

      const parts = fullName.trim().split(" ");
      const firstName = parts.shift() || "";
      const lastName = parts.join(" ") || "";

      const body = { firstName, lastName, userName, profileBio: bio, userLink: website, email };

      const res = await fetch(`${apiUrl}/api/v1/profile/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to update profile");

      if (data?.success && data.data?.user) {
        onUpdate(data.data.user);
        // reflect saved values (in case backend normalizes)
        setUserName(data.data.user.userName || userName);
        setFullName(`${data.data.user.firstName || ""} ${data.data.user.lastName || ""}`.trim());
        setBio(data.data.user.profileBio || bio);
        setWebsite(data.data.user.userLink || website);
        setEmail(data.data.user.email || email);
      }
    } catch (err) {
      // minimal feedback; caller can enhance
      // keep simple: use alert
      // eslint-disable-next-line no-alert
      alert(err.message || "Unable to save profile");
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const token = localStorage.getItem("token") || sessionStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");

      const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const userId = profileData?._id || profileData?.id;
      if (!userId) throw new Error("Missing user id");

      const form = new FormData();
      form.append("image", file);

      const res = await fetch(`${apiUrl}/api/v1/images/user/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: form,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to upload image");

      // Refresh profile from server to pick up new image URL
      const profileRes = await fetch(`${apiUrl}/api/v1/profile/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const profileJson = await profileRes.json();
      if (profileJson?.success && profileJson.data?.user) {
        onUpdate(profileJson.data.user);
        // ensure local inputs reflect any normalized values
        setUserName(profileJson.data.user.userName || userName);
      }
    } catch (err) {
      // eslint-disable-next-line no-alert
      alert(err.message || "Unable to upload photo");
    } finally {
      setUploading(false);
      // reset file input
      if (fileInputRef.current) fileInputRef.current.value = null;
    }
  };

  return (
    <div className="s-section">
      <h2 className="s-section__title">Edit profile</h2>
      <p className="s-section__desc">Update your personal information and how it appears to others.</p>
      <div className="s-avatar-row">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handlePhotoChange}
        />
        <div className="s-avatar">{(userName?.[0] || "U").toUpperCase()}</div>
        <div className="s-avatar-info">
          <span className="s-avatar-name">{userName || "unknown"}</span>
          <span className="s-avatar-sub">Premium User</span>
        </div>
        <button className="s-btn s-btn--ghost" onClick={handlePhotoClick} disabled={uploading}>{uploading ? "Uploading..." : "Change photo"}</button>
      </div>
      <div className="s-row">
        <label className="s-label">Username</label>
        <input className="s-input" type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
      </div>
      <div className="s-row">
        <label className="s-label">Full name</label>
        <input className="s-input" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </div>
      <div className="s-row">
        <label className="s-label">Bio</label>
        <input className="s-input" type="text" placeholder="Write something about yourself..." value={bio} onChange={(e) => setBio(e.target.value)} />
      </div>
      <div className="s-row">
        <label className="s-label">Website</label>
        <input className="s-input" type="url" placeholder="https://yourwebsite.com" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>
      <div className="s-row">
        <label className="s-label">Email</label>
        <input className="s-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="s-divider" />
      <button className="s-btn s-btn--primary" onClick={handleSave} disabled={saving}>{saving ? "Saving..." : "Save changes"}</button>
    </div>
  );
}

export default ProfileSection;
