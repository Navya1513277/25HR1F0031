import {
  Box,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import EventIcon from "@mui/icons-material/Event";

const typeConfig = {
  Placement: {
    color: "primary",
    icon: <BusinessCenterIcon fontSize="small" />,
  },
  Result: {
    color: "success",
    icon: <EmojiEventsIcon fontSize="small" />,
  },
  Event: {
    color: "warning",
    icon: <EventIcon fontSize="small" />,
  },
};

function formatTimestamp(timestamp) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(timestamp));
}

export function NotificationCard({ notification }) {
  const config = typeConfig[notification.type] ?? typeConfig.Event;

  return (
    <Card
      variant="outlined"
      sx={{
        borderColor: notification.isRead ? "divider" : "primary.light",
        bgcolor: notification.isRead ? "background.paper" : "primary.50",
      }}
    >
      <CardContent>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "flex-start" }}>
          <Box sx={{ color: `${config.color}.main`, pt: 0.25 }}>
            {config.icon}
          </Box>

          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1}
              sx={{
                alignItems: { xs: "flex-start", sm: "center" },
                justifyContent: "space-between",
              }}
            >
              <Typography variant="subtitle1" fontWeight={700}>
                {notification.title}
              </Typography>
              <Chip
                label={notification.type}
                color={config.color}
                size="small"
                variant={notification.isRead ? "outlined" : "filled"}
              />
            </Stack>

            <Typography color="text.secondary" mt={0.75}>
              {notification.message}
            </Typography>

            <Typography variant="caption" color="text.secondary" mt={1.25} display="block">
              {formatTimestamp(notification.timestamp)}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
