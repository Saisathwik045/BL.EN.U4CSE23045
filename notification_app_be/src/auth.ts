import axios from "axios";
import { BASE_URL, AUTH_CREDENTIALS } from "./config";
import { Log, setAuthToken } from "logging-middleware";

let cachedToken: string | null = null;

export async function getAuthToken(): Promise<string> {
  if (cachedToken) return cachedToken;

  try {
    await Log("backend", "info", "auth", "Requesting authorization token from evaluation service");

    const response = await axios.post(`${BASE_URL}/auth`, AUTH_CREDENTIALS);
    cachedToken = response.data.access_token;

    // Provide token to logging middleware
    setAuthToken(cachedToken as string);

    await Log("backend", "info", "auth", "Authorization token obtained successfully");
    return cachedToken as string;
  } catch (err: unknown) {
    await Log("backend", "fatal", "auth", `Failed to obtain auth token: ${String(err)}`);
    throw new Error("Authentication failed");
  }
}
