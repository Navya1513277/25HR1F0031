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

---

# Stage 2

# Database Design and Persistent Storage

## Database Choice

I recommend using **PostgreSQL** as the persistent storage for the notification system.

### Why PostgreSQL?

PostgreSQL is a powerful relational database that provides:

- ACID compliance for reliable transactions.
- Excellent indexing support for fast querying.
- High performance with millions of records.
- Strong support for JSON data if needed.
- Scalability through partitioning and replication.
- Mature ecosystem and community support.

Since notifications have a well-defined structure and relationships with users, a relational database is an ideal choice.

---

# Database Schema

## Students Table

| Column | Data Type | Constraints |
|---------|-----------|------------|
| studentID | BIGINT | Primary Key |
| name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(255) | UNIQUE |
| createdAt | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

---

## Notifications Table

| Column | Data Type | Constraints |
|---------|-----------|------------|
| notificationID | UUID | Primary Key |
| studentID | BIGINT | Foreign Key → Students(studentID) |
| title | VARCHAR(255) | NOT NULL |
| message | TEXT | NOT NULL |
| notificationType | ENUM('Event','Result','Placement') | NOT NULL |
| isRead | BOOLEAN | DEFAULT FALSE |
| createdAt | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

---

# Entity Relationship

```
Students (1)
      |
      | studentID
      |
      |--------< Notifications (Many)
```

Each student can receive multiple notifications.

---

# SQL Table Creation

## Students Table

```sql
CREATE TABLE students (
    studentID BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Notifications Table

```sql
CREATE TYPE notification_type AS ENUM
('Event','Result','Placement');

CREATE TABLE notifications (
    notificationID UUID PRIMARY KEY,
    studentID BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    notificationType notification_type NOT NULL,
    isRead BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(studentID)
    REFERENCES students(studentID)
);
```

---

# Challenges as Data Volume Increases

As the notification system grows to millions of records, several challenges may occur.

### 1. Slow Queries

Searching unread notifications without proper indexes can become slow.

### 2. Increased Storage

Millions of notifications require significant disk space.

### 3. High Concurrent Requests

Many users requesting notifications simultaneously can overload the database.

### 4. Long Backup Times

Large databases require more time for backup and restoration.

### 5. Higher Memory Usage

Sorting and filtering large datasets consumes more memory.

---

# Solutions

### Database Indexing

Create indexes on frequently queried columns.

```sql
CREATE INDEX idx_student_read
ON notifications(studentID, isRead);
```

---

### Table Partitioning

Partition notifications based on creation date.

Example:

- notifications_2026
- notifications_2027

This reduces the amount of data scanned.

---

### Pagination

Instead of returning all notifications:

```
GET /notifications?page=1&limit=20
```

Return only a limited number of records.

---

### Read Replicas

Use read replicas to distribute read traffic across multiple database servers.

---

### Caching

Store frequently accessed notifications in Redis to reduce database load.

---

# SQL Queries for REST APIs

## 1. Get All Notifications

```sql
SELECT *
FROM notifications
WHERE studentID = ?
ORDER BY createdAt DESC;
```

---

## 2. Get Unread Notifications

```sql
SELECT *
FROM notifications
WHERE studentID = ?
AND isRead = FALSE
ORDER BY createdAt DESC;
```

---

## 3. Mark Notification as Read

```sql
UPDATE notifications
SET isRead = TRUE
WHERE notificationID = ?;
```

---

## 4. Mark All Notifications as Read

```sql
UPDATE notifications
SET isRead = TRUE
WHERE studentID = ?;
```

---

## 5. Delete Notification

```sql
DELETE FROM notifications
WHERE notificationID = ?;
```

---

## 6. Insert New Notification

```sql
INSERT INTO notifications
(
notificationID,
studentID,
title,
message,
notificationType,
isRead
)
VALUES
(
gen_random_uuid(),
?,
?,
?,
?,
FALSE
);
```

---

# Summary

PostgreSQL is a suitable choice for the notification system because it provides reliability, scalability, and strong query performance. The proposed schema efficiently models the relationship between students and notifications. Performance can be maintained as the database grows through indexing, partitioning, pagination, caching, and read replicas. The SQL queries directly support the REST APIs designed in Stage 1.

---

# Stage 3

# Query Optimization and Database Performance

## Existing Query

The developer implemented the following query to retrieve unread notifications for a student.

```sql
SELECT *
FROM notifications
WHERE studentID = 1042
AND isRead = FALSE
ORDER BY createdAt ASC;
```

The database currently contains:

- 50,000 students
- 5,000,000 notifications

---

## Is the Query Accurate?

Yes.

The query correctly returns all unread notifications for student **1042** ordered by their creation time in ascending order.

However, although the query is functionally correct, it is not optimized for a very large database.

---

## Why is the Query Slow?

When the notifications table grows to millions of rows, several factors reduce performance.

### 1. Full Table Scan

If no suitable index exists, the database scans all 5 million rows before finding matching notifications.

This has a time complexity of approximately:

```
O(N)
```

where **N = total number of notifications**.

---

### 2. Sorting Cost

After filtering, the database must sort the results using:

```sql
ORDER BY createdAt ASC
```

Sorting large datasets increases execution time.

---

### 3. Selecting All Columns

The query uses:

```sql
SELECT *
```

Fetching every column transfers more data than necessary, increasing I/O and memory usage.

---

## Improved Query

Instead of selecting every column, retrieve only the required fields.

```sql
SELECT
    notificationID,
    title,
    message,
    notificationType,
    createdAt
FROM notifications
WHERE studentID = 1042
AND isRead = FALSE
ORDER BY createdAt ASC;
```

---

## Recommended Composite Index

Create a composite index that matches the filtering and sorting columns.

```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications(studentID, isRead, createdAt);
```

### Why this index?

The query filters by:

- studentID
- isRead

and sorts by:

- createdAt

The database can use a single index to both locate and order the matching rows efficiently.

---

## Computation Cost

### Without Index

```
Filtering : O(N)

Sorting : O(K log K)
```

where

- N = total notifications
- K = notifications belonging to one student

---

### With Composite Index

The database performs an indexed lookup.

Approximate complexity:

```
O(log N + K)
```

This is significantly faster than scanning millions of rows.

---

## Should We Add Indexes on Every Column?

No.

Adding indexes to every column is not an effective strategy.

### Disadvantages

- Increased disk space usage.
- Slower INSERT operations.
- Slower UPDATE operations.
- Slower DELETE operations.
- Additional maintenance overhead.
- Many indexes may never be used by queries.

Indexes should only be created on columns that are frequently used for:

- WHERE clauses
- JOIN conditions
- ORDER BY
- GROUP BY

A well-designed composite index is more efficient than many individual indexes.

---

## Query to Find Students Who Received Placement Notifications in the Last 7 Days

```sql
SELECT DISTINCT studentID
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= CURRENT_DATE - INTERVAL '7 days';
```

If student details are also required:

```sql
SELECT
    s.studentID,
    s.name,
    s.email
FROM students s
JOIN notifications n
ON s.studentID = n.studentID
WHERE n.notificationType = 'Placement'
AND n.createdAt >= CURRENT_DATE - INTERVAL '7 days';
```

---

# Additional Performance Improvements

To further improve scalability, the following strategies can be adopted.

### Pagination

Instead of loading all notifications:

```
GET /notifications?page=1&limit=20
```

Only a limited number of notifications are returned.

---

### Table Partitioning

Partition notifications by creation date.

Example:

- notifications_2025
- notifications_2026

This reduces the amount of data scanned.

---

### Redis Cache

Store frequently accessed unread notifications in Redis.

This reduces repeated database queries and improves response time.

---

### Read Replicas

Use one primary database for writes and multiple read replicas for read-heavy workloads.

This distributes query load and improves scalability.

---

# Conclusion

The original query is functionally correct but inefficient for a database containing millions of notifications. By replacing `SELECT *` with only the required columns, creating a composite index on `(studentID, isRead, createdAt)`, and adopting strategies such as pagination, partitioning, caching, and read replicas, the notification system can efficiently scale to support large numbers of users while maintaining fast response times.

---

# Stage 4

# Improving Notification System Performance

## Problem Statement

Currently, the frontend requests all notifications from the database every time a student loads or refreshes a page. As the number of users and notifications increases, this approach places excessive load on the database, resulting in slower response times and a poor user experience.

---

# Proposed Solutions

## 1. Redis Caching

### Description

Instead of querying the database on every request, frequently accessed notifications can be stored in an in-memory cache such as Redis. When a user requests notifications:

1. Check Redis for cached notifications.
2. If available, return them immediately.
3. If not available, fetch from PostgreSQL, return the data, and store it in Redis for future requests.

### Advantages

- Very fast response times (milliseconds).
- Significantly reduces database load.
- Ideal for frequently accessed data.

### Trade-offs

- Requires additional infrastructure.
- Cache invalidation must be handled correctly when notifications are added or updated.
- Cached data may become temporarily stale.

---

## 2. Pagination

### Description

Instead of returning every notification, return only a fixed number of records per request.

Example:

```http
GET /notifications?page=1&limit=20
```

Only 20 notifications are loaded at a time.

### Advantages

- Smaller database queries.
- Reduced network bandwidth.
- Faster page loading.
- Improved frontend performance.

### Trade-offs

- Additional API requests are required when the user navigates to the next page.
- Slightly more complex frontend implementation.

---

## 3. Lazy Loading / Infinite Scrolling

### Description

Initially load only the first set of notifications. Additional notifications are fetched only when the user scrolls.

### Advantages

- Fast initial page load.
- Reduced unnecessary database queries.
- Better user experience for large notification lists.

### Trade-offs

- More frontend logic is required.
- Users cannot immediately access all notifications.

---

## 4. WebSocket-Based Real-Time Updates

### Description

Instead of requesting notifications repeatedly, establish a WebSocket connection after login. The server pushes new notifications to the client whenever they are created.

### Advantages

- Eliminates unnecessary polling.
- Instant notification delivery.
- Reduced number of API requests.

### Trade-offs

- Persistent connections consume server resources.
- Slightly more complex backend implementation.

---

## 5. Database Indexing

### Description

Create indexes on frequently queried columns.

Example:

```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications(studentID, isRead, createdAt);
```

### Advantages

- Faster filtering.
- Faster sorting.
- Improved query execution.

### Trade-offs

- Increased storage usage.
- Slower INSERT and UPDATE operations because indexes must also be updated.

---

## 6. Read Replicas

### Description

Use one primary database for write operations and one or more replica databases for read operations.

### Advantages

- Distributes read traffic.
- Improves scalability.
- Prevents overloading the primary database.

### Trade-offs

- Slight replication delay may occur.
- Additional infrastructure and maintenance costs.

---

## 7. Database Partitioning

### Description

Split the notifications table into smaller partitions based on time.

Example:

- notifications_2025
- notifications_2026
- notifications_2027

### Advantages

- Queries scan only relevant partitions.
- Faster performance with large datasets.
- Easier maintenance and archival.

### Trade-offs

- More complex database administration.
- Queries spanning multiple partitions may require additional processing.

---

## 8. Background Cleanup and Archiving

### Description

Older notifications can be archived into a separate table or storage after a defined period.

Example:

- Keep recent notifications in the primary table.
- Move notifications older than one year to an archive table.

### Advantages

- Keeps the active table small.
- Improves query performance.
- Reduces storage costs.

### Trade-offs

- Archived data is not immediately available.
- Additional maintenance jobs are required.

---

# Recommended Architecture

```
                 User
                  │
                  ▼
            React Frontend
                  │
                  ▼
          Notification API
                  │
        ┌─────────┴─────────┐
        │                   │
        ▼                   ▼
     Redis Cache      PostgreSQL
        │                   │
        └─────────┬─────────┘
                  │
                  ▼
             WebSocket Server
                  │
                  ▼
          Real-Time Updates
```

---

# Best Overall Approach

For a production-scale notification system, the following combination provides the best balance of performance and scalability:

- PostgreSQL as the primary database.
- Redis for caching frequently accessed notifications.
- Pagination to limit the number of records returned.
- WebSockets for real-time notification delivery.
- Composite indexes on frequently queried columns.
- Read replicas for scaling read operations.
- Partitioning and archiving for long-term data management.

This architecture minimizes database load, improves response time, supports large numbers of concurrent users, and ensures a responsive user experience.

---

# Conclusion

Fetching notifications from the database on every page load is inefficient and does not scale well. A combination of Redis caching, pagination, lazy loading, WebSockets, database indexing, read replicas, partitioning, and archival strategies provides a scalable and reliable solution. Each technique has trade-offs, but together they significantly improve system performance while maintaining data consistency and a smooth user experience.

---

# Stage 5

# Reliable and Scalable Notification Delivery

## Existing Implementation

```python
function notify_all(student_ids, message):

    for student_id in student_ids:

        send_email(student_id, message)

        save_to_db(student_id, message)

        push_to_app(student_id, message)
```

---

# Shortcomings of the Current Implementation

The above implementation is simple but not suitable for a production environment with 50,000 students.

### 1. Sequential Processing

Each student is processed one after another.

If sending one email takes 200 milliseconds:

```
50,000 × 200 ms = 10,000 seconds
≈ 2.8 hours
```

This is far too slow.

---

### 2. Single Point of Failure

If `send_email()` fails for one student, the remaining students may never receive notifications.

Example:

```
Student 1 ✓

Student 2 ✓

...

Student 200 ✗

Process Stops
```

Students after 200 will not receive notifications.

---

### 3. No Retry Mechanism

Temporary failures (network issues, email provider downtime, etc.) are ignored.

Notifications are permanently lost.

---

### 4. Tight Coupling

Saving to the database, sending email, and pushing in-app notifications are executed together.

Failure in one operation affects the others.

---

### 5. Poor Scalability

Processing notifications one by one cannot efficiently handle thousands of users.

---

### 6. No Monitoring

The implementation provides no way to determine:

- Which notifications succeeded.
- Which notifications failed.
- Which notifications are still pending.

---

# What Happens if send_email() Fails for 200 Students?

If email delivery fails midway:

- Some students receive emails.
- Some students receive only in-app notifications.
- Some students receive nothing.
- The system becomes inconsistent.
- Administrators cannot easily determine which students were affected.

This leads to poor reliability and user experience.

---

# Improved System Design

Instead of sending notifications synchronously, use an asynchronous architecture with a message queue.

```
                HR Clicks "Notify All"
                         │
                         ▼
                  Notification API
                         │
               Save Notification to DB
                         │
                         ▼
                 Message Queue
               (RabbitMQ / Kafka)
                    │        │
          ┌─────────┘        └─────────┐
          ▼                            ▼
   Email Worker                 Push Notification Worker
          │                            │
          ▼                            ▼
    Email Service              WebSocket Server
```

---

# Why Use a Message Queue?

A message queue (such as RabbitMQ or Apache Kafka) stores notification jobs and distributes them to worker processes.

Benefits include:

- Asynchronous processing.
- Better scalability.
- Independent services.
- Automatic retries.
- Improved fault tolerance.
- Higher throughput.

---

# Retry Mechanism

If email delivery fails:

1. Store the job as **Failed**.
2. Retry automatically after a delay.
3. Retry multiple times (for example, three attempts).
4. If all retries fail, move the job to a **Dead Letter Queue (DLQ)** for manual inspection.

This ensures temporary failures do not result in lost notifications.

---

# Should Saving to the Database and Sending Email Happen Together?

No.

These operations should be separated.

### Step 1

Save the notification to the database.

This guarantees that every notification is permanently stored.

### Step 2

Publish a message to the queue.

### Step 3

Worker services send:

- Email notifications.
- In-app notifications.

If email delivery fails, the notification still exists in the database and can be retried later.

This approach ensures reliability and prevents data loss.

---

# Revised Pseudocode

```python
function notify_all(student_ids, message):

    for student_id in student_ids:

        notification = {
            "student_id": student_id,
            "message": message,
            "status": "Pending"
        }

        save_to_database(notification)

        publish_to_queue(notification)
```

---

## Email Worker

```python
while queue.has_message():

    notification = queue.consume()

    try:

        send_email(notification)

        update_status(notification, "Email Sent")

    except:

        retry(notification)

        if retry_limit_exceeded():

            move_to_dead_letter_queue(notification)
```

---

## Push Notification Worker

```python
while queue.has_message():

    notification = queue.consume()

    push_to_app(notification)

    update_status(notification, "Delivered")
```

---

# Benefits of the Improved Design

- Handles notifications for thousands of users efficiently.
- Prevents data loss.
- Supports automatic retries.
- Enables parallel processing.
- Improves fault tolerance.
- Scales horizontally by adding more worker instances.
- Provides monitoring of notification status.
- Delivers faster response times to users.

---

# Conclusion

The original implementation is suitable only for small systems and does not scale to tens of thousands of users. By introducing asynchronous processing with a message queue, separating database writes from notification delivery, implementing retry mechanisms, and using dedicated worker services, the notification platform becomes reliable, fault tolerant, and capable of handling large-scale notification delivery efficiently.

---

# Stage 6

# Priority Inbox Design

## Objective

The Priority Inbox displays the top **N** unread notifications based on a combination of:

1. Notification Type (Weight)
2. Recency (Latest notifications first)

The priority order is:

1. Placement (Highest Priority)
2. Result
3. Event (Lowest Priority)

If two notifications have the same priority, the newer notification appears first.

---

# Priority Calculation

Each notification type is assigned a weight.

| Notification Type | Weight |
|-------------------|--------|
| Placement | 3 |
| Result | 2 |
| Event | 1 |

The notifications are sorted using:

1. Highest Weight
2. Latest Timestamp

Only unread notifications are considered.

---

# Algorithm

1. Fetch notifications from the Notification API.
2. Filter unread notifications.
3. Assign weights based on notification type.
4. Sort notifications by:
   - Weight (Descending)
   - Timestamp (Descending)
5. Return the top N notifications.

---

# Time Complexity

Filtering unread notifications:

```
O(n)
```

Sorting:

```
O(n log n)
```

Selecting Top N:

```
O(n)
```

Overall:

```
O(n log n)
```

---

# Efficient Maintenance of Top 10

Instead of sorting every time a new notification arrives, maintain a **Min-Heap (Priority Queue)** of size **10**.

Steps:

- Insert each new notification into the heap.
- If the heap size exceeds 10, remove the lowest-priority notification.
- The heap always stores the top 10 highest-priority unread notifications.

Complexity:

Insertion:

```
O(log 10)
≈ O(1)
```

Memory:

```
O(10)
```

This approach is much more efficient for continuously arriving notifications than repeatedly sorting the entire list.

---

# Advantages

- Fast retrieval of top notifications.
- Efficient memory usage.
- Suitable for real-time updates.
- Easily scalable for large datasets.
- Supports configurable values of N (10, 15, 20, etc.).

---

# Conclusion

The Priority Inbox ranks notifications based on business importance and recency. Using a Min-Heap allows the system to maintain the top unread notifications efficiently as new notifications arrive without repeatedly sorting the full notification list.
