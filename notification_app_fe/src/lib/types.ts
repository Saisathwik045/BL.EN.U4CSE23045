export interface Notification {
  ID: string;
  Type: "Placement" | "Result" | "Event";
  Message: string;
  Timestamp: string;
  read?: boolean;
}

export type NotificationType = "Placement" | "Result" | "Event" | "All";
