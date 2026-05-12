import { Notification } from "../../types/notification";

interface NotificationDropDownProps {
    notifications: Notification[];
}

function NotificationDropDown({ notifications }: NotificationDropDownProps): JSX.Element {
    return (
        <div className="notify-section">
            <div className="notify-header">
                <h1>Notifications</h1>
            </div>
            <div className="notify-filter">
                <div className="filters">
                    <button>All</button>
                    <button>New products</button>
                    <button>Bets</button>
                </div>
            </div>

            <div className="notify-list">
                {notifications.length > 0 ? (
                notifications.map((notification) => (
                    <div key={notification.id} >
                        {!notification.isRead? <span>[New]</span>: null}
                        <p>{notification.message}</p>
                        <p>{notification.createdAt}</p>
                    </div>
                ))
            ) : (
                <p>No notifications yet.</p>
            )}
            </div>
        </div >
    );
};

export default NotificationDropDown