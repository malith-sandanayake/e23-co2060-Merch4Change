import React, { useState, useEffect } from "react";
import AppLayout from "../../components/AppLayout/AppLayout";
import NotificationDropDown from "../../components/Notifications/NotificationDropDown";
import { fetchNotifications, markNotificationRead } from "../../services/notificationService";

export default function NotificationPage() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchNotifications()
      .then((response) => {
        const rawNotifications = Array.isArray(response?.data?.notifications) ? response.data.notifications : (Array.isArray(response) ? response : []);
        const items = rawNotifications.filter(item => item != null).map((item) => ({
          ...item,
          id: item._id || item.id,
        }));
        setNotifications(items);
      })
      .catch((error) => console.error("Error fetching notifications:", error));
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <AppLayout>
      <div className="p-6 flex justify-center h-full min-h-screen">
        <NotificationDropDown 
          notifications={notifications} 
          onMarkAsRead={handleMarkAsRead}
          containerClassName="bg-white rounded-xl shadow-sm border border-gray-100 w-full max-w-3xl p-6 h-fit mt-4"
        />
      </div>
    </AppLayout>
  );
}
