const notifications = [
  {
    id: "1",
    type: "Placement",
    title: "Microsoft Hiring Drive",
    message: "Applications are open for the campus hiring drive.",
    timestamp: "2026-04-22 17:51:18",
    isRead: false,
  },
  {
    id: "2",
    type: "Result",
    title: "Mid Semester Results",
    message: "Your mid semester results are now available.",
    timestamp: "2026-04-22 17:50:42",
    isRead: false,
  },
  {
    id: "3",
    type: "Event",
    title: "Tech Fest Registration",
    message: "Register for the annual technical fest before Friday.",
    timestamp: "2026-04-22 17:50:06",
    isRead: false,
  },
  {
    id: "4",
    type: "Placement",
    title: "Amazon Hiring Update",
    message: "Shortlisted students should confirm interview availability.",
    timestamp: "2026-04-22 18:00:00",
    isRead: false,
  },
  {
    id: "5",
    type: "Event",
    title: "Farewell Ceremony",
    message: "Final year farewell invitations have been published.",
    timestamp: "2026-04-22 17:55:00",
    isRead: true,
  },
  {
    id: "6",
    type: "Result",
    title: "Revaluation Window",
    message: "The result revaluation request window closes tomorrow.",
    timestamp: "2026-04-22 18:08:00",
    isRead: true,
  },
];

const priorityWeights = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

function rankNotifications(items) {
  return [...items].sort((a, b) => {
    const priorityDiff = priorityWeights[b.type] - priorityWeights[a.type];

    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    return new Date(b.timestamp) - new Date(a.timestamp);
  });
}

export async function fetchNotifications({ filter = "All", page = 1, limit = 4 } = {}) {
  await new Promise((resolve) => setTimeout(resolve, 250));

  const filtered =
    filter === "All"
      ? notifications
      : notifications.filter((notification) => notification.type === filter);

  const ordered = rankNotifications(filtered);
  const start = (page - 1) * limit;
  const paginated = ordered.slice(start, start + limit);

  return {
    notifications: paginated,
    total: ordered.length,
    totalPages: Math.max(1, Math.ceil(ordered.length / limit)),
  };
}