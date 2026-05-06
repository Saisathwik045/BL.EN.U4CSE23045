import axios from "axios";

const LOG_API_URL = "http://20.207.122.201/evaluation-service/logs";

type Stack = "backend" | "frontend";
type Level = "debug" | "info" | "warn" | "error" | "fatal";
type BackendPackage =
  | "cache"
  | "controller"
  | "cron_job"
  | "db"
  | "domain"
  | "handler"
  | "repository"
  | "route"
  | "service"
  | "auth"
  | "config"
  | "middleware"
  | "utils";
type FrontendPackage =
  | "api"
  | "component"
  | "hook"
  | "page"
  | "state"
  | "style"
  | "auth"
  | "config"
  | "middleware"
  | "utils";
type Package = BackendPackage | FrontendPackage;

let authToken: string | null = null;

/**
 * Set the Bearer token used for authenticated log API calls.
 */
export function setAuthToken(token: string): void {
  authToken = token;
}

/**
 * Log(stack, level, package, message)
 * Sends a log entry to the AffordMed evaluation log server.
 */
export async function Log(
  stack: Stack,
  level: Level,
  pkg: Package,
  message: string
): Promise<void> {
  if (!authToken) {
    console.warn("[logging-middleware] Auth token not set. Call setAuthToken() first.");
    return;
  }

  try {
    await axios.post(
      LOG_API_URL,
      {
        stack,
        level,
        package: pkg,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      console.error(
        `[logging-middleware] Failed to send log: ${err.response?.status} ${err.message}`
      );
    } else {
      console.error("[logging-middleware] Unexpected error sending log:", err);
    }
  }
}
