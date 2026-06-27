# Stage 1

# Notification System Design

## Objective

The Notification System provides RESTful APIs that allow authenticated users to receive, view, update, and manage notifications. The APIs follow REST principles, use JSON for request and response bodies, and secure all endpoints using JWT authentication.

---

## Base URL

```
https://api.example.com/api/v1
```

---

## Authentication

All endpoints require JWT authentication.

### Request Headers

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
Accept: application/json
```

---

## Notification Object Schema

```json
{
  "id": "string",
  "title": "string",
  "message": "string",
  "type": "info | success | warning | error",
  "isRead": false,
  "createdAt": "2026-06-27T10:30:00Z"
}
```

---

## Core Actions Supported

The notification platform supports the following actions:

- Retrieve all notifications
- Retrieve unread notifications
- Mark a notification as read
- Mark all notifications as read
- Delete a notification
- Receive real-time notifications

---

# REST API Endpoints

## 1. Get All Notifications

### Endpoint

```http
GET /notifications
```

### Headers

```http
Authorization: Bearer <JWT_TOKEN>
Accept: application/json
```

### Request Body

None

### Success Response

```json
{
  "success": true,
  "count": 2,
  "notifications": [
    {
      "id": "1",
      "title": "Assignment Submitted",
      "message": "Your assignment has been submitted successfully.",
      "type": "success",
      "isRead": false,
      "createdAt": "2026-06-27T10:00:00Z"
    },
    {
      "id": "2",
      "title": "Placement Drive",
      "message": "A new placement drive has been announced.",
      "type": "info",
      "isRead": true,
      "createdAt": "2026-06-26T15:20:00Z"
    }
  ]
}
```

---

## 2. Get Unread Notifications

### Endpoint

```http
GET /notifications/unread
```

### Headers

```http
Authorization: Bearer <JWT_TOKEN>
Accept: application/json
```

### Request Body

None

### Success Response

```json
{
  "success": true,
  "count": 1,
  "notifications": [
    {
      "id": "1",
      "title": "Assignment Submitted",
      "message": "Your assignment has been submitted successfully.",
      "type": "success",
      "isRead": false,
      "createdAt": "2026-06-27T10:00:00Z"
    }
  ]
}
```

---

## 3. Mark Notification as Read

### Endpoint

```http
PATCH /notifications/{notificationId}/read
```

### Headers

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Request Body

```json
{}
```

### Success Response

```json
{
  "success": true,
  "message": "Notification marked as read."
}
```

---

## 4. Mark All Notifications as Read

### Endpoint

```http
PATCH /notifications/read-all
```

### Headers

```http
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

### Request Body

```json
{}
```

### Success Response

```json
{
  "success": true,
  "message": "All notifications marked as read."
}
```

---

## 5. Delete Notification

### Endpoint

```http
DELETE /notifications/{notificationId}
```

### Headers

```http
Authorization: Bearer <JWT_TOKEN>
```

### Request Body

None

### Success Response

```json
{
  "success": true,
  "message": "Notification deleted successfully."
}
```

---

## Standard Error Response

```json
{
  "success": false,
  "error": {
    "code": 401,
    "message": "Unauthorized"
  }
}
```

---

## HTTP Status Codes

| Status Code | Description           |
| ----------- | --------------------- |
| 200         | OK                    |
| 201         | Created               |
| 400         | Bad Request           |
| 401         | Unauthorized          |
| 403         | Forbidden             |
| 404         | Not Found             |
| 500         | Internal Server Error |

---

# Real-Time Notification Mechanism

## Technology

The notification system uses **WebSockets** for real-time communication.

Once a user logs in, the frontend opens a WebSocket connection with the backend. Whenever a new notification is created, the backend immediately sends it to the connected client without requiring the user to refresh the page.

---

## WebSocket Endpoint

```http
GET /ws/notifications
```

### Connection Headers

```http
Authorization: Bearer <JWT_TOKEN>
```

---

## Example Server Push Event

```json
{
  "event": "notification.created",
  "data": {
    "id": "15",
    "title": "Placement Update",
    "message": "Microsoft has scheduled interviews.",
    "type": "Placement",
    "isRead": false,
    "createdAt": "2026-06-27T11:30:00Z"
  }
}
```

---

# API Design Principles

- Use RESTful endpoints.
- Use nouns instead of verbs in endpoint names.
- Use proper HTTP methods (GET, PATCH, DELETE).
- Use JSON for request and response bodies.
- Secure APIs using JWT authentication.
- Return meaningful HTTP status codes.
- Keep response structures consistent.
- Support API versioning.

---

# Conclusion

This notification system provides a secure, scalable, and RESTful API for displaying and managing notifications. It supports retrieving notifications, updating their read status, deleting notifications, and delivering real-time updates through WebSockets. The design follows REST best practices and provides a consistent API contract for frontend developers.
