import express from "express";
import cors from "cors";
import { getAuthToken } from "./auth";
import { Log } from "logging-middleware";
import routes from "./routes";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use("/api", routes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

async function start() {
  try {
    // Authenticate on startup so token is ready
    await getAuthToken();
    await Log("backend", "info", "service", `Server starting on port ${PORT}`);

    app.listen(PORT, () => {
      console.log(`[notification_app_be] Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("[notification_app_be] Failed to start:", err);
    process.exit(1);
  }
}

start();
