import { useState } from "react";
import { Notification } from "../../types/notification";

type FilterType = "all" | "new_products" | "bets";

interface NotificationDropDownProps {
    notifications: Notification[];
    onMarkAsRead?: (id: string) => void;
}

function NotificationDropDown({ notifications, onMarkAsRead }: NotificationDropDownProps): JSX.Element {
    const [activeFilter, setActiveFilter] = useState<FilterType>("all");
    
    const handleFilter = (value: FilterType) => {
        setActiveFilter(value);
    };

    const filtered = notifications.filter((n) =>{
        if (activeFilter === "all") return true;
        if (activeFilter === "new_products") return n.type === "product";
        if (activeFilter === "bets") return n.type === "bet";
        return true 
    });

    const formatDate = (dateStr: string) => 
        new Date(dateStr).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        })

    return (
        <div className="notify-section">
            <div className="notify-header">
                <h3>Notifications</h3>
            </div>
            <div className="notify-filter">
                <div className="filters">
                    <button onClick={() => handleFilter("all")}>All</button>
                    <button onClick={() => handleFilter("new_products")}>New products</button>
                    <button onClick={() => handleFilter("bets")}>Bets</button>
                </div>
            </div>

            <div className="notify-list">
                {filtered.length > 0 ? (
                filtered.map((notification) => (
                    <div 
                        key={notification.id}
                        onClick = {() => !notification.isRead && onMarkAsRead?.(notification.id)}    
                    >
                        {!notification.isRead? <span>[New]</span>: null}
                        <p>{notification.message}</p>
                        <p>{formatDate(notification.createdAt)}</p>
                    </div>
                ))
            ) : (
                <p>No {activeFilter !== "all" ? activeFilter.replace("_", " ") : ""} notifications yet.</p>
            )}
            </div>
        </div >
    );
};

export default NotificationDropDown