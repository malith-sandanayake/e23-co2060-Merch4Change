import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import SettingsSidebar from "./components/SettingsSidebar";
import {
  ProfileSection,
  SecuritySection,
  PrivacySection,
  OrganizationVerificationSection,
  NotificationsSection,
  AppearanceSection,
  LanguageSection,
  HelpSection,
} from "./sections/Sections";
import apiClient from "../../api/apiClient";
import "./Settings.css";

const SECTIONS = {
  profile: ProfileSection,
  security: SecuritySection,
  privacy: PrivacySection,
  notifications: NotificationsSection,
  appearance: AppearanceSection,
  language: LanguageSection,
  help: HelpSection,
  organization: OrganizationVerificationSection,
};

function Settings() {
  const [searchParams] = useSearchParams();
  const initialSection = searchParams.get("section") || "profile";
  const [activeSection, setActiveSection] = useState(initialSection);
  const [profileData, setProfileData] = useState({
    firstName: "Guest",
    lastName: "User",
    userName: "guest",
  });

  useEffect(() => {
  useEffect(() => {
    apiClient.get("/api/v1/profile/me")
      .then((res) => {
        const data = res.data;
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
        <SettingsSidebar
          activeSection={activeSection}
          onSelect={handleSelect}
          showOrganization={profileData.accountType === "organization"}
        />
        <main className="settings-content">
          <ActiveSection profileData={profileData} onUpdate={setProfileData} />
        </main>
      </div>
    </div>
  );
}

export default Settings;
