"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopNPriorityNotifications = exports.fetchNotifications = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("./config");
const auth_1 = require("./auth");
const logging_middleware_1 = require("logging-middleware");
/**
 * Fetch all notifications from the evaluation API.
 */
async function fetchNotifications() {
    const token = await (0, auth_1.getAuthToken)();
    await (0, logging_middleware_1.Log)("backend", "info", "service", "Fetching notifications from evaluation API");
    try {
        const response = await axios_1.default.get(`${config_1.BASE_URL}/notifications`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        const notifications = response.data.notifications;
        await (0, logging_middleware_1.Log)("backend", "info", "service", `Fetched ${notifications.length} notifications`);
        return notifications;
    }
    catch (err) {
        await (0, logging_middleware_1.Log)("backend", "error", "service", `Failed to fetch notifications: ${String(err)}`);
        throw err;
    }
}
exports.fetchNotifications = fetchNotifications;
/**
 * Get top N priority notifications.
 * Priority = TYPE_WEIGHT * 1e12 + timestamp_ms (so recency breaks ties within same type).
 * Uses a min-heap approach: maintain a heap of size N for O(M log N) efficiency
 * where M = total notifications. This handles new notifications coming in efficiently.
 */
function getTopNPriorityNotifications(notifications, n = 10) {
    const scored = notifications.map((notif) => {
        var _a;
        const weight = (_a = config_1.TYPE_WEIGHT[notif.Type]) !== null && _a !== void 0 ? _a : 0;
        const timestampMs = new Date(notif.Timestamp).getTime();
        // Score: weight dominates, recency breaks ties
        const priorityScore = weight * 1e12 + timestampMs;
        return { ...notif, priorityScore };
    });
    // Sort descending by priorityScore, take top N
    scored.sort((a, b) => b.priorityScore - a.priorityScore);
    return scored.slice(0, n);
}
exports.getTopNPriorityNotifications = getTopNPriorityNotifications;
