type Stack = "backend" | "frontend";
type Level = "debug" | "info" | "warn" | "error" | "fatal";
type BackendPackage = "cache" | "controller" | "cron_job" | "db" | "domain" | "handler" | "repository" | "route" | "service" | "auth" | "config" | "middleware" | "utils";
type FrontendPackage = "api" | "component" | "hook" | "page" | "state" | "style" | "auth" | "config" | "middleware" | "utils";
type Package = BackendPackage | FrontendPackage;
/**
 * Set the Bearer token used for authenticated log API calls.
 */
export declare function setAuthToken(token: string): void;
/**
 * Log(stack, level, package, message)
 * Sends a log entry to the AffordMed evaluation log server.
 */
export declare function Log(stack: Stack, level: Level, pkg: Package, message: string): Promise<void>;
export {};
//# sourceMappingURL=index.d.ts.map