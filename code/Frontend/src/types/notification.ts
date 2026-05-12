export interface Notification{
    id: string;
    type: "purchase" | "donation" | "follow" | "system" | "product" | "bet";
    message: string;
    isRead: boolean;
    createdAt: string; // json sends a string not Date object 
}