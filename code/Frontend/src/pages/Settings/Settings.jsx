import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import SettingsSidebar from "./components/SettingsSidebar";
import ProfileSection from "./sections/ProfileSection";
import {
  SecuritySection,
  PrivacySection,
  NotificationsSection,
  AppearanceSection,
  LanguageSection,
  HelpSection,
} from "./sections/Sections";
import "./Settings.css";

const SECTIONS = {
  profile: ProfileSection,
  security: SecuritySection,
  privacy: PrivacySection,
  notifications: NotificationsSection,
  appearance: AppearanceSection,
  language: LanguageSection,
  help: HelpSection,
};

function Settings() {
  const [activeSection, setActiveSection] = useState("profile");
  const [profileData, setProfileData] = useState({
    firstName: "Guest",
    lastName: "User",
    userName: "guest",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
    fetch(`${apiUrl}/api/v1/profile/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.data?.user) {
          setProfileData(data.data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleSelect = (id) => {
    if (id === "logout") return;
    setActiveSection(id);
  };

  const ActiveSection = SECTIONS[activeSection] || ProfileSection;

  return (
    <div className="settings-page">
      <Sidebar profileData={profileData} />
      <div className="settings-body">
        <SettingsSidebar activeSection={activeSection} onSelect={handleSelect} />
        <main className="settings-content">
          <ActiveSection profileData={profileData} />
        </main>
      </div>
    </div>
  );
}

export default Settings;
