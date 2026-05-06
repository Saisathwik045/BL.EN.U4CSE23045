"use client";
import { useEffect, useState } from "react";
import { Typography, CircularProgress, Alert, Box, Pagination } from "@mui/material";
import { fetchNotifications } from "@/lib/api";
import { Notification, NotificationType } from "@/lib/types";
import NotificationCard from "@/components/NotificationCard";
import FilterBar from "@/components/FilterBar";
import { Log } from "logging-middleware";

const PAGE_LIMIT = 10;

export default function AllNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<NotificationType>("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        await Log("frontend", "info", "page", `All notifications page loaded (page=${page}, type=${filter})`);
        const params: { limit: number; page: number; notification_type?: string } = {
          limit: PAGE_LIMIT,
          page,
        };
        if (filter !== "All") params.notification_type = filter;

        const { notifications: data, total } = await fetchNotifications(params);
        setNotifications(data);
        setTotalPages(Math.max(1, Math.ceil(total / PAGE_LIMIT)));
      } catch (err: unknown) {
        await Log("frontend", "error", "page", `Failed to load notifications: ${String(err)}`);
        setError("Failed to load notifications. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [page, filter]);

  const handleFilterChange = (val: NotificationType) => {
    setFilter(val);
    setPage(1);
  };

  const markRead = (id: string) => {
    setReadIds((prev) => new Set([...prev, id]));
  };

  const displayed = notifications.map((n) => ({ ...n, read: readIds.has(n.ID) }));

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} mb={2}>
        All Notifications
      </Typography>
      <FilterBar value={filter} onChange={handleFilterChange} />
      {loading && <CircularProgress />}
      {error && <Alert severity="error">{error}</Alert>}
      {!loading && !error && displayed.length === 0 && (
        <Alert severity="info">No notifications found.</Alert>
      )}
      {displayed.map((n) => (
        <NotificationCard key={n.ID} notification={n} onRead={markRead} />
      ))}
      {!loading && !error && totalPages > 1 && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_e, val) => setPage(val)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}
