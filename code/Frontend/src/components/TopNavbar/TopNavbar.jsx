import { memo, useEffect, useRef, useState } from "react";
import SearchBar from "./search/SearchBar";
import CoinBalance from "./CoinBalance";
import NotificationDropDown from "../Notifications/NotificationDropDown";
import { Bell, Menu, Search, MessageSquare } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { clearAuth } from "../../utils/authStorage";
import { fetchNotifications, markNotificationRead } from "../../services/notificationService";
import test from "../../assets/test.jpg";
import "./TopNavbar.css";

function TopNavbar({
  isSidebarCollapsed,
  setIsSidebarCollapsed,
  profileData,
  activeTab,
  onTabChange,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const isDonations = location.pathname.startsWith("/donations");
  const themeClass = isDonations ? "lum-topbar--teal" : "lum-topbar--purple";
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const popupRef = useRef(null);
  const notificationRef = useRef(null);

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) return;

    fetchNotifications()
      .then((response) => {
        if (!active) return;
        const items = (response?.data?.notifications || []).map((item) => ({
          id: item._id,
          type: item.type,
          message: item.message,
          isRead: item.isRead,
          createdAt: item.createdAt,
        }));
        setNotifications(items);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [profileData]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowLogoutPopup(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTabClick = (tab) => {
    if (tab === "feed") {
      navigate("/home");
      if (typeof onTabChange === "function") onTabChange(tab);
      return;
    }

    if (tab === "discover" || tab === "trends") {
      navigate("/under-construction");
      if (typeof onTabChange === "function") onTabChange(tab);
      return;
    }

    if (typeof onTabChange === "function") {
      onTabChange(tab);
    } else {
      navigate(`/home?tab=${tab}`);
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

    try {
      await fetch(`${apiUrl}/api/v1/auth/logout`, {
        method: "POST",
        headers: token
          ? {
            Authorization: `Bearer ${token}`,
          }
          : {},
      });
    } catch {
      // Even if the request fails, clear local auth state client-side.
    } finally {
      clearAuth();
      setShowLogoutPopup(false);
      navigate("/login");
    }
  };

  const handleNotificationDropDown = () => {
    setShowNotifications(!showNotifications);
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isRead: true } : item)),
      );
    } catch {
      // ignore
    }
  };

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <nav className={`lum-topbar ${themeClass}`}>
      {/* ... rest of JSX unchanged ... */}
    </nav>
  );
}

export default memo(TopNavbar);