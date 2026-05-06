"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuthToken = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("./config");
const logging_middleware_1 = require("logging-middleware");
let cachedToken = null;
async function getAuthToken() {
    if (cachedToken)
        return cachedToken;
    try {
        await (0, logging_middleware_1.Log)("backend", "info", "auth", "Requesting authorization token from evaluation service");
        const response = await axios_1.default.post(`${config_1.BASE_URL}/auth`, config_1.AUTH_CREDENTIALS);
        cachedToken = response.data.access_token;
        // Provide token to logging middleware
        (0, logging_middleware_1.setAuthToken)(cachedToken);
        await (0, logging_middleware_1.Log)("backend", "info", "auth", "Authorization token obtained successfully");
        return cachedToken;
    }
    catch (err) {
        await (0, logging_middleware_1.Log)("backend", "fatal", "auth", `Failed to obtain auth token: ${String(err)}`);
        throw new Error("Authentication failed");
    }
}
exports.getAuthToken = getAuthToken;
