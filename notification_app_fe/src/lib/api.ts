import axios from "axios";
import { getToken, BASE_URL } from "./auth";
import { Log, setAuthToken } from "logging-middleware";
import { Notification } from "./types";

const TYPE_WEIGHT: Record<string, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

export async function fetchNotifications(params?: {
  limit?: number;
  page?: number;
  notification_type?: string;
}): Promise<{ notifications: Notification[]; total: number }> {
  const token = await getToken();
  setAuthToken(token);

  await Log("frontend", "info", "api", `Fetching notifications from API (params: ${JSON.stringify(params ?? {})})`);

  try {
    const res = await axios.get(`${BASE_URL}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
      params,
    });
    const notifications: Notification[] = res.data.notifications;
    // API may return a total count; fall back to array length if not provided
    const total: number = res.data.total ?? notifications.length;
    await Log("frontend", "info", "api", `Fetched ${notifications.length} notifications (total: ${total})`);
    return { notifications, total };
  } catch (err: unknown) {
    await Log("frontend", "error", "api", `Failed to fetch notifications: ${String(err)}`);
    throw err;
  }
}

export function getPriorityNotifications(
  notifications: Notification[],
  n: number = 10
): Notification[] {
  return [...notifications]
    .map((notif) => ({
      ...notif,
      _score:
        (TYPE_WEIGHT[notif.Type] ?? 0) * 1e12 + new Date(notif.Timestamp).getTime(),
    }))
    .sort((a, b) => b._score - a._score)
    .slice(0, n);
}
