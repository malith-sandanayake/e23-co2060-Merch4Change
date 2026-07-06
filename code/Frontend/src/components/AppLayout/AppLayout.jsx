import { useEffect, useState } from "react";
import TopNavbar from "../TopNavbar/TopNavbar";
import Sidebar from "../Sidebar/Sidebar";
import { refreshStoredUser } from "../../utils/authStorage";
import "../../pages/Home/Home.css";

const defaultProfile = {
  firstName: "Guest",
  lastName: "User",
  userName: "guest",
};

export default function AppLayout({ children }) {
  const [profileData, setProfileData] = useState(defaultProfile);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    refreshStoredUser().then((user) => {
      if (user) {
        setProfileData(user);
      }
    });
  }, []);

  return (
    <div className={`luminous-app ${isSidebarCollapsed ? "sidebar-collapsed" : ""}`}>
      <TopNavbar
        isSidebarCollapsed={isSidebarCollapsed}
        setIsSidebarCollapsed={setIsSidebarCollapsed}
        profileData={profileData}
        activeTab="feed"
      />

      <div className="lum-layout">
        <Sidebar
          profileData={profileData}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
        />
        <main className="lum-main-content">{children}</main>
      </div>
    </div>
  );
}
