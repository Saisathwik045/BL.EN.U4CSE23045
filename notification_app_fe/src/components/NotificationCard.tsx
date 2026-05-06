import { Card, CardContent, Typography, Chip, Box } from "@mui/material";
import { Notification } from "@/lib/types";

const TYPE_COLOR: Record<string, "success" | "warning" | "info"> = {
  Placement: "success",
  Result: "warning",
  Event: "info",
};

interface Props {
  notification: Notification;
  onRead?: (id: string) => void;
}

export default function NotificationCard({ notification, onRead }: Props) {
  const isNew = !notification.read;

  return (
    <Card
      onClick={() => onRead?.(notification.ID)}
      sx={{
        mb: 1.5,
        cursor: onRead ? "pointer" : "default",
        borderLeft: isNew ? "4px solid #1976d2" : "4px solid transparent",
        backgroundColor: isNew ? "#e3f2fd" : "#fff",
        transition: "background-color 0.2s",
        "&:hover": { boxShadow: 3 },
      }}
    >
      <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
          <Box display="flex" alignItems="center" gap={1}>
            <Chip
              label={notification.Type}
              color={TYPE_COLOR[notification.Type] ?? "default"}
              size="small"
            />
            {isNew && (
              <Chip label="New" color="primary" size="small" variant="outlined" />
            )}
          </Box>
          <Typography variant="caption" color="text.secondary">
            {new Date(notification.Timestamp).toLocaleString()}
          </Typography>
        </Box>
        <Typography variant="body2">{notification.Message}</Typography>
      </CardContent>
    </Card>
  );
}
