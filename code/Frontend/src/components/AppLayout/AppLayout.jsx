import { useEffect, useState } from "react";
import TopNavbar from "../TopNavbar/TopNavbar";
import Sidebar from "../Sidebar/Sidebar";
import { useAuth } from "../../context/Context";
import "../../pages/Home/Home.css";

const defaultProfile = {
  firstName: "Guest",
  lastName: "User", 
  userName: "guest",
};

export default function AppLayout({ children }) {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(defaultProfile);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData(user);
    }
  }, [user]);

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
