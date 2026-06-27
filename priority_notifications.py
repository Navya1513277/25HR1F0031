from datetime import datetime
import heapq

notifications = [
    {
        "id": "1",
        "type": "Placement",
        "message": "Microsoft Hiring",
        "timestamp": "2026-04-22 17:51:18",
        "isRead": False
    },
    {
        "id": "2",
        "type": "Result",
        "message": "Mid Semester Results",
        "timestamp": "2026-04-22 17:50:42",
        "isRead": False
    },
    {
        "id": "3",
        "type": "Event",
        "message": "Tech Fest",
        "timestamp": "2026-04-22 17:50:06",
        "isRead": False
    },
    {
        "id": "4",
        "type": "Placement",
        "message": "Amazon Hiring",
        "timestamp": "2026-04-22 18:00:00",
        "isRead": False
    },
    {
        "id": "5",
        "type": "Event",
        "message": "Farewell",
        "timestamp": "2026-04-22 17:55:00",
        "isRead": True
    }
]

weights = {
    "Placement": 3,
    "Result": 2,
    "Event": 1
}

heap = []

for notification in notifications:
    if notification["isRead"]:
        continue

    priority = weights.get(notification["type"], 0)

    timestamp = datetime.strptime(
        notification["timestamp"],
        "%Y-%m-%d %H:%M:%S"
    ).timestamp()

    item = (priority, timestamp, notification)

    if len(heap) < 10:
        heapq.heappush(heap, item)
    else:
        heapq.heappushpop(heap, item)

top_notifications = sorted(
    heap,
    key=lambda x: (x[0], x[1]),
    reverse=True
)

print("\nTop Priority Notifications\n")

for _, _, notification in top_notifications:
    print("------------------------------")
    print("ID       :", notification["id"])
    print("Type     :", notification["type"])
    print("Message  :", notification["message"])
    print("Timestamp:", notification["timestamp"])