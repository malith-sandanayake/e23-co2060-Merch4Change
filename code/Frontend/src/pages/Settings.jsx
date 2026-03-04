import React from "react";

const Settings = ({ onNavigate }) => {
  return (
    <div style={{ padding: "40px" }}>
      <h2>Settings & Activity</h2>

      <div style={{ marginTop: "20px" }}>
        <h3>Account</h3>
        <ul>
          <li>Password</li>
          <li>Security</li>
          <li>Personal Details</li>
        </ul>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>Privacy</h3>
        <ul>
          <li>Account Privacy</li>
          <li>Blocked Users</li>
          <li>Close Friends</li>
        </ul>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>Notifications</h3>
        <ul>
          <li>Push Notifications</li>
          <li>Email Notifications</li>
        </ul>
      </div>

      <button 
        style={{ marginTop: "30px" }}
        onClick={() => onNavigate("messaging")}
      >
        Back to Messaging
      </button>
    </div>
  );
};

export default Settings;