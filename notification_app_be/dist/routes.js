"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const notificationService_1 = require("./notificationService");
const logging_middleware_1 = require("logging-middleware");
const router = (0, express_1.Router)();
// GET /notifications - all notifications
router.get("/notifications", async (req, res) => {
    await (0, logging_middleware_1.Log)("backend", "info", "route", "GET /notifications called");
    try {
        const notifications = await (0, notificationService_1.fetchNotifications)();
        res.json({ notifications });
    }
    catch (err) {
        await (0, logging_middleware_1.Log)("backend", "error", "route", `GET /notifications failed: ${String(err)}`);
        res.status(500).json({ error: "Failed to fetch notifications" });
    }
});
// GET /notifications/priority?n=10 - top N priority notifications
router.get("/notifications/priority", async (req, res) => {
    var _a;
    const n = parseInt((_a = req.query.n) !== null && _a !== void 0 ? _a : "10", 10);
    await (0, logging_middleware_1.Log)("backend", "info", "route", `GET /notifications/priority called with n=${n}`);
    try {
        const all = await (0, notificationService_1.fetchNotifications)();
        const priority = (0, notificationService_1.getTopNPriorityNotifications)(all, n);
        await (0, logging_middleware_1.Log)("backend", "info", "route", `Returning top ${priority.length} priority notifications`);
        res.json({ notifications: priority, count: priority.length });
    }
    catch (err) {
        await (0, logging_middleware_1.Log)("backend", "error", "route", `GET /notifications/priority failed: ${String(err)}`);
        res.status(500).json({ error: "Failed to fetch priority notifications" });
    }
});
exports.default = router;
