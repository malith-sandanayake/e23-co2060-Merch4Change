import { Notification } from "../../types/notification";

interface NotificationDropDownProps {
    notifications: Notification[];
}

function NotificationDropDown({ notifications }: NotificationDropDownProps): JSX.Element {
    return (
        <div className="notify-section">
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
        </div >
    );
};

export default NotificationDropDown