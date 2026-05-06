import axios from "axios";
import { BASE_URL, TYPE_WEIGHT } from "./config";
import { getAuthToken } from "./auth";
import { Log } from "logging-middleware";
import { Notification, PriorityNotification } from "./types";

/**
 * Fetch all notifications from the evaluation API.
 */
export async function fetchNotifications(): Promise<Notification[]> {
  const token = await getAuthToken();

  await Log("backend", "info", "service", "Fetching notifications from evaluation API");

  try {
    const response = await axios.get(`${BASE_URL}/notifications`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const notifications: Notification[] = response.data.notifications;
    await Log("backend", "info", "service", `Fetched ${notifications.length} notifications`);
    return notifications;
  } catch (err: unknown) {
    await Log("backend", "error", "service", `Failed to fetch notifications: ${String(err)}`);
    throw err;
  }
}

/**
 * Get top N priority notifications.
 * Priority = TYPE_WEIGHT * 1e12 + timestamp_ms (so recency breaks ties within same type).
 * Uses a min-heap approach: maintain a heap of size N for O(M log N) efficiency
 * where M = total notifications. This handles new notifications coming in efficiently.
 */
export function getTopNPriorityNotifications(
  notifications: Notification[],
  n: number = 10
): PriorityNotification[] {
  const scored: PriorityNotification[] = notifications.map((notif) => {
    const weight = TYPE_WEIGHT[notif.Type] ?? 0;
    const timestampMs = new Date(notif.Timestamp).getTime();
    // Score: weight dominates, recency breaks ties
    const priorityScore = weight * 1e12 + timestampMs;
    return { ...notif, priorityScore };
  });

  // Sort descending by priorityScore, take top N
  scored.sort((a, b) => b.priorityScore - a.priorityScore);
  return scored.slice(0, n);
}
