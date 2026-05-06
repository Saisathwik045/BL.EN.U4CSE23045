"use client";
import { useEffect, useState } from "react";
import {
  Typography,
  CircularProgress,
  Alert,
  Box,
  Slider,
} from "@mui/material";
import { fetchNotifications, getPriorityNotifications } from "@/lib/api";
import { Notification, NotificationType } from "@/lib/types";
import NotificationCard from "@/components/NotificationCard";
import FilterBar from "@/components/FilterBar";
import { Log } from "logging-middleware";

export default function PriorityInboxPage() {
  const [all, setAll] = useState<Notification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [topN, setTopN] = useState<number>(10);
  const [filter, setFilter] = useState<NotificationType>("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        await Log("frontend", "info", "page", "Priority inbox page loaded");
        const { notifications } = await fetchNotifications();
        setAll(notifications);
      } catch (err: unknown) {
        await Log("frontend", "error", "page", `Failed to load priority notifications: ${String(err)}`);
        setError("Failed to load notifications. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const markRead = (id: string) => {
    setReadIds((prev) => new Set([...prev, id]));
  };

  const priority = getPriorityNotifications(all, topN)
    .map((n) => ({ ...n, read: readIds.has(n.ID) }))
    .filter((n) => filter === "All" || n.Type === filter);

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} mb={1}>
        Priority Inbox
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={2}>
        Top notifications ranked by type weight (Placement &gt; Result &gt; Event) and recency.
      </Typography>

      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Typography variant="body2" minWidth={60}>
          Top N: {topN}
        </Typography>
        <Slider
          value={topN}
          min={10}
          max={20}
          step={5}
          marks={[
            { value: 10, label: "10" },
            { value: 15, label: "15" },
            { value: 20, label: "20" },
          ]}
          onChange={(_e, val) => setTopN(val as number)}
          sx={{ width: 200 }}
          aria-label="Top N notifications"
        />
      </Box>

      <FilterBar value={filter} onChange={setFilter} />

      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && priority.length === 0 && (
        <Alert severity="info">No notifications found.</Alert>
      )}
      {priority.map((n) => (
        <NotificationCard key={n.ID} notification={n} onRead={markRead} />
      ))}
    </Box>
  );
}
