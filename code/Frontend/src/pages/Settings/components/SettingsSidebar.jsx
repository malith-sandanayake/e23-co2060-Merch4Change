import React from "react";
import { User, Lock, Shield, Bell, Sun, Globe, HelpCircle, LogOut } from "lucide-react";
import "./SettingsSidebar.css";

const GROUPS = [
  {
    label: "Account",
    items: [
      { id: "profile", icon: <User size={16} />, label: "Edit profile" },
      { id: "security", icon: <Lock size={16} />, label: "Account security" },
      { id: "privacy", icon: <Shield size={16} />, label: "Privacy" },
    ],
  },
  {
    label: "Preferences",
    items: [
      { id: "notifications", icon: <Bell size={16} />, label: "Notifications" },
      { id: "appearance", icon: <Sun size={16} />, label: "Appearance" },
      { id: "language", icon: <Globe size={16} />, label: "Language" },
    ],
  },
  {
    label: "More",
    items: [
      { id: "help", icon: <HelpCircle size={16} />, label: "Help & support" },
      { id: "logout", icon: <LogOut size={16} />, label: "Log out", isDanger: true },
    ],
  },
];

function SettingsSidebar({ activeSection, onSelect }) {
  return (
    <aside className="ss-nav">
      <div className="ss-nav__header">Settings</div>
      {GROUPS.map((group) => (
        <div key={group.label} className="ss-nav__group">
          <span className="ss-nav__group-label">{group.label}</span>
          {group.items.map((item) => (
            <button
              key={item.id}
              className={`ss-nav__item${activeSection === item.id ? " ss-nav__item--active" : ""}${item.isDanger ? " ss-nav__item--danger" : ""}`}
              onClick={() => onSelect(item.id)}
            >
              <span className="ss-nav__icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      ))}
    </aside>
  );
}

export default SettingsSidebar;
