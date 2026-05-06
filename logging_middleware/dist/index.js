"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = exports.setAuthToken = void 0;
const axios_1 = __importDefault(require("axios"));
const LOG_API_URL = "http://20.207.122.201/evaluation-service/logs";
let authToken = null;
/**
 * Set the Bearer token used for authenticated log API calls.
 */
function setAuthToken(token) {
    authToken = token;
}
exports.setAuthToken = setAuthToken;
/**
 * Log(stack, level, package, message)
 * Sends a log entry to the AffordMed evaluation log server.
 */
async function Log(stack, level, pkg, message) {
    var _a;
    if (!authToken) {
        console.warn("[logging-middleware] Auth token not set. Call setAuthToken() first.");
        return;
    }
    try {
        await axios_1.default.post(LOG_API_URL, {
            stack,
            level,
            package: pkg,
            message,
        }, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                "Content-Type": "application/json",
            },
        });
    }
    catch (err) {
        if (axios_1.default.isAxiosError(err)) {
            console.error(`[logging-middleware] Failed to send log: ${(_a = err.response) === null || _a === void 0 ? void 0 : _a.status} ${err.message}`);
        }
        else {
            console.error("[logging-middleware] Unexpected error sending log:", err);
        }
    }
}
exports.Log = Log;
//# sourceMappingURL=index.js.map