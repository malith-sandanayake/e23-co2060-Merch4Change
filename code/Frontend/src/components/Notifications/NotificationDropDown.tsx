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

    // button styling 
    const activeBtn = "bg-purple-100 text-purple-700 font-medium rounded-full px-3 py-1 text-sm border-none cursor-pointer";
    const inactiveBtn = "bg-gray-100 text-gray-500 rounded-full px-3 py-1 text-sm border-none cursor-pointer";

    return (
        <div className="bg-white rounded-xl shadow-lg w-80 p-4">
            <div className="border-b  border-gray-100 pb-3">
                <h3 className="text-base font-bold text-gray-900">Notifications</h3>
            </div>
            
            <div className="flex gap-2 py-3">
                <button onClick={() => handleFilter("all")} className={activeFilter === "all" ? activeBtn : inactiveBtn}>All</button>
                <button onClick={() => handleFilter("new_products")} className={activeFilter === "new_products" ? activeBtn : inactiveBtn}>New products</button>
                <button onClick={() => handleFilter("bets")} className={activeFilter === "bets" ? activeBtn : inactiveBtn}>Bets</button>
            </div>
            

            <div className="flex flex-col gap-1">
                {filtered.length > 0 ? (
                filtered.map((notification) => (
                    <div className="p-3 rounded-lg cursor-pointer hover:bg-gray-50"
                        key={notification.id}
                        onClick={() => !notification.isRead && onMarkAsRead?.(notification.id)}    
                    >
                        <div className="flex items-center gap-2">
                            {!notification.isRead? <span className="bg-purple-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">New</span>: null}
                            <p className="text-sm text-gray-800 m-0">{notification.message}</p>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 m-0">{formatDate(notification.createdAt)}</p>
                    </div>
                ))
            ) : (
                <p className="text-sm text-gray-400 text-center py-6">No {activeFilter !== "all" ? activeFilter.replace("_", " ") : ""} notifications yet.</p>
            )}
            </div>
        </div >
    );
};

export default NotificationDropDown