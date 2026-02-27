# API Documentation - Requests & Notifications

## Base URL
```
http://localhost:3000/api/requests
```

## Authentication
All endpoints require Bearer token in Authorization header:
```
Authorization: Bearer <token>
```

---

## Request Endpoints

### 1. Send Request for Task
**POST** `/api/requests/:taskId`

Send a request to help with a specific task.

**Parameters:**
- `taskId` (URL param): Task ID to request

**Response:**
```json
{
  "success": true,
  "message": "Request sent successfully",
  "request": {
    "_id": "...",
    "task": "...",
    "requestedBy": "...",
    "status": "pending",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Validations:**
- Cannot request own task
- Cannot request assigned tasks
- Cannot send duplicate requests

---

### 2. Get Requests for My Tasks
**GET** `/api/requests/my-tasks`

Get all requests received for tasks you created.

**Response:**
```json
{
  "success": true,
  "requests": [
    {
      "_id": "...",
      "task": {
        "_id": "...",
        "title": "...",
        "description": "...",
        "status": "open"
      },
      "requestedBy": {
        "_id": "...",
        "first_name": "...",
        "last_name": "...",
        "profilePicture": "..."
      },
      "status": "pending",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

### 3. Get My Sent Requests
**GET** `/api/requests/my-requests`

Get all requests you have sent to help with tasks.

**Response:**
```json
{
  "success": true,
  "requests": [
    {
      "_id": "...",
      "task": {
        "_id": "...",
        "title": "...",
        "description": "...",
        "location": "...",
        "createdBy": {
          "first_name": "...",
          "last_name": "..."
        }
      },
      "status": "pending",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

### 4. Accept Request
**PATCH** `/api/requests/:requestId/accept`

Accept a request for your task.

**Parameters:**
- `requestId` (URL param): Request ID to accept

**Response:**
```json
{
  "success": true,
  "message": "Request accepted",
  "task": {
    "_id": "...",
    "title": "...",
    "status": "assigned",
    "assignedTo": {
      "_id": "...",
      "first_name": "...",
      "last_name": "..."
    }
  }
}
```

**Side Effects:**
- Task status changes to "assigned"
- Task assignedTo field is set
- All other pending requests are automatically rejected
- Notification sent to helper

**Validations:**
- Only task owner can accept
- Request must be in "pending" status

---

### 5. Reject Request
**PATCH** `/api/requests/:requestId/reject`

Reject a request for your task.

**Parameters:**
- `requestId` (URL param): Request ID to reject

**Response:**
```json
{
  "success": true,
  "message": "Request rejected"
}
```

**Side Effects:**
- Request status changes to "rejected"
- Notification sent to helper

**Validations:**
- Only task owner can reject
- Request must be in "pending" status

---

## Notification Endpoints

### 6. Get Notifications
**GET** `/api/requests/notifications`

Get all notifications for the current user.

**Response:**
```json
{
  "success": true,
  "notifications": [
    {
      "_id": "...",
      "recipient": "...",
      "actor": {
        "first_name": "...",
        "last_name": "...",
        "profilePicture": "..."
      },
      "task": {
        "_id": "...",
        "title": "...",
        "status": "..."
      },
      "type": "new_request",
      "title": "New task request",
      "message": "A helper sent a request for your task.",
      "isRead": false,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "unreadCount": 3
}
```

**Notification Types:**
- `new_request`: Helper requested your task
- `request_accepted`: Your request was accepted
- `request_rejected`: Your request was rejected

**Limit:** Returns last 30 notifications

---

### 7. Mark Notification as Read
**PATCH** `/api/requests/notifications/:notificationId/read`

Mark a specific notification as read.

**Parameters:**
- `notificationId` (URL param): Notification ID to mark as read

**Response:**
```json
{
  "success": true,
  "notification": {
    "_id": "...",
    "isRead": true,
    "readAt": "2024-01-15T10:30:00.000Z"
  }
}
```

---

### 8. Mark All Notifications as Read
**PATCH** `/api/requests/notifications/read-all`

Mark all notifications as read for the current user.

**Response:**
```json
{
  "success": true,
  "message": "All notifications marked as read"
}
```

---

## Error Responses

All endpoints may return error responses in this format:

```json
{
  "success": false,
  "message": "Error message here"
}
```

or

```json
{
  "error": "Error message here"
}
```

### Common Error Codes:
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (not authorized for this action)
- `404`: Not Found (resource doesn't exist)
- `500`: Internal Server Error

---

## Frontend Usage Examples

### Send Request
```javascript
import { requestTask } from '../config/api';

const handleRequest = async (taskId) => {
  try {
    const { data } = await requestTask(taskId);
    console.log(data.message); // "Request sent successfully"
  } catch (error) {
    console.error(error.response?.data?.message);
  }
};
```

### Get Incoming Requests
```javascript
import { getRequestsForMyTasks } from '../config/api';

const loadRequests = async () => {
  try {
    const { data } = await getRequestsForMyTasks();
    setRequests(data.requests);
  } catch (error) {
    console.error(error.response?.data?.message);
  }
};
```

### Accept Request
```javascript
import { acceptRequest } from '../config/api';

const handleAccept = async (requestId) => {
  try {
    const { data } = await acceptRequest(requestId);
    console.log(data.message); // "Request accepted"
  } catch (error) {
    console.error(error.response?.data?.message);
  }
};
```

### Get Notifications
```javascript
import { getNotifications } from '../config/api';

const loadNotifications = async () => {
  try {
    const { data } = await getNotifications();
    setNotifications(data.notifications);
    setUnreadCount(data.unreadCount);
  } catch (error) {
    console.error(error.response?.data?.message);
  }
};
```
