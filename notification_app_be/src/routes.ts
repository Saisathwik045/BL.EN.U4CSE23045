import { Router, Request, Response } from "express";
import { fetchNotifications, getTopNPriorityNotifications } from "./notificationService";
import { Log } from "logging-middleware";

const router = Router();

// GET /notifications - all notifications
router.get("/notifications", async (req: Request, res: Response) => {
  await Log("backend", "info", "route", "GET /notifications called");
  try {
    const notifications = await fetchNotifications();
    res.json({ notifications });
  } catch (err: unknown) {
    await Log("backend", "error", "route", `GET /notifications failed: ${String(err)}`);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// GET /notifications/priority?n=10 - top N priority notifications
router.get("/notifications/priority", async (req: Request, res: Response) => {
  const n = parseInt((req.query.n as string) ?? "10", 10);
  await Log("backend", "info", "route", `GET /notifications/priority called with n=${n}`);

  try {
    const all = await fetchNotifications();
    const priority = getTopNPriorityNotifications(all, n);
    await Log("backend", "info", "route", `Returning top ${priority.length} priority notifications`);
    res.json({ notifications: priority, count: priority.length });
  } catch (err: unknown) {
    await Log("backend", "error", "route", `GET /notifications/priority failed: ${String(err)}`);
    res.status(500).json({ error: "Failed to fetch priority notifications" });
  }
});

export default router;
