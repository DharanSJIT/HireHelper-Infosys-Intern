# Testing Guide - Milestone 3: Requests & Notifications

## Prerequisites

1. **Backend Running**: `cd Backend && npm start`
2. **Frontend Running**: `cd frontend && npm run dev`
3. **Two User Accounts**: You'll need two different users to test the full flow

---

## Test Scenario 1: Send and Receive Requests

### Setup
- **User A** (Task Owner): alice@example.com
- **User B** (Helper): bob@example.com

### Steps

#### 1. User A Creates a Task
1. Login as User A
2. Navigate to "Post a Task"
3. Fill in task details:
   - Title: "Help with Moving Furniture"
   - Description: "Need help moving a couch to 2nd floor"
   - Category: "Moving"
   - Location: "123 Main St, Boston"
   - Date & Time: Tomorrow, 2:00 PM
4. Click "Create Task"
5. Verify task appears in "My Tasks" with status "open"

#### 2. User B Sends Request
1. Logout User A, Login as User B
2. Navigate to "Task Feed"
3. Find the task created by User A
4. Click "Send Request to Help"
5. **Expected Results:**
   - Button shows loading spinner
   - Success message appears: "Request sent!"
   - Button changes to "Request Sent" (disabled)
   - Button turns green

#### 3. User A Receives Notification
1. Logout User B, Login as User A
2. **Check Notification Bell:**
   - Red badge shows "1" unread notification
3. Navigate to "Requests" page
4. **Expected Results:**
   - Stats show: 1 Pending Review, 0 Accepted, 0 Rejected
   - Request card displays:
     - Task title: "Help with Moving Furniture"
     - Helper name: Bob's full name
     - Status badge: "pending" (yellow)
     - "Accept" button (green)
     - "Reject" button (red)

#### 4. User A Accepts Request
1. Click "Accept" button on the request
2. **Expected Results:**
   - Loading spinner appears
   - Request disappears from pending list
   - Stats update: 0 Pending, 1 Accepted
   - Request reappears with "accepted" status (green badge)
3. Navigate to "My Tasks"
4. **Expected Results:**
   - Task status changed to "assigned"
   - "Assigned to" shows Bob's name

#### 5. User B Receives Acceptance Notification
1. Logout User A, Login as User B
2. **Check Notification Bell:**
   - Red badge shows "1" unread notification
3. Click notification bell → Navigate to "Notifications"
4. **Expected Results:**
   - Notification with green checkmark icon
   - Title: "Request accepted"
   - Message: "Your request was accepted. You have been assigned to this task."
   - Blue highlight (unread)
5. Click on notification
6. **Expected Results:**
   - Blue highlight disappears (marked as read)
   - Notification badge count decreases
7. Navigate to "My Requests"
8. **Expected Results:**
   - Stats show: 1 Total, 0 Pending, 1 Accepted
   - Request card shows "accepted" status with green checkmark

---

## Test Scenario 2: Reject Request

### Steps

#### 1. User A Creates Another Task
1. Login as User A
2. Create a new task: "Garden Cleanup"

#### 2. User B Sends Request
1. Login as User B
2. Send request for "Garden Cleanup" task

#### 3. User A Rejects Request
1. Login as User A
2. Navigate to "Requests"
3. Click "Reject" button
4. **Expected Results:**
   - Request status changes to "rejected" (gray badge)
   - Stats update: 0 Pending, 1 Accepted, 1 Rejected

#### 4. User B Receives Rejection Notification
1. Login as User B
2. Check notifications
3. **Expected Results:**
   - Notification with red X icon
   - Title: "Request rejected"
   - Message: "Your request was rejected by the task owner."
4. Navigate to "My Requests"
5. **Expected Results:**
   - Request shows "rejected" status with red X icon

---

## Test Scenario 3: Multiple Requests (Auto-Rejection)

### Setup
- **User A** (Task Owner)
- **User B** (Helper 1)
- **User C** (Helper 2)

### Steps

#### 1. User A Creates Task
1. Login as User A
2. Create task: "Painting Help"

#### 2. Multiple Helpers Send Requests
1. Login as User B → Send request
2. Login as User C → Send request

#### 3. User A Sees Multiple Requests
1. Login as User A
2. Navigate to "Requests"
3. **Expected Results:**
   - Stats show: 2 Pending Review
   - Two request cards visible

#### 4. User A Accepts One Request
1. Accept User B's request
2. **Expected Results:**
   - User B's request: "accepted" status
   - User C's request: "rejected" status (auto-rejected)
   - Stats: 0 Pending, 1 Accepted, 1 Rejected

#### 5. Both Helpers Receive Notifications
1. Login as User B
   - Notification: "Request accepted"
2. Login as User C
   - Notification: "Request rejected"

---

## Test Scenario 4: Validation & Error Handling

### Test 4.1: Cannot Request Own Task
1. Login as User A
2. Create a task
3. Navigate to "Task Feed"
4. Try to request your own task
5. **Expected Result:**
   - Error message: "You cannot request your own task"

### Test 4.2: Cannot Send Duplicate Request
1. Login as User B
2. Send request for a task
3. Try to send request again for same task
4. **Expected Result:**
   - Error message: "You already requested this task"

### Test 4.3: Cannot Request Assigned Task
1. Login as User B
2. Try to request a task that's already assigned
3. **Expected Result:**
   - Error message: "Task is not available for requests"

### Test 4.4: Only Owner Can Accept/Reject
1. Login as User B (not the task owner)
2. Try to directly call accept/reject API
3. **Expected Result:**
   - Error: "Not authorized"

---

## Test Scenario 5: Notification Features

### Test 5.1: Notification Bell Badge
1. Login with unread notifications
2. **Expected Results:**
   - Red badge on bell icon
   - Shows count (e.g., "3")
   - Shows "9+" if more than 9

### Test 5.2: Mark Single Notification as Read
1. Navigate to "Notifications"
2. Click on an unread notification (blue highlight)
3. **Expected Results:**
   - Blue highlight disappears
   - Badge count decreases by 1

### Test 5.3: Mark All as Read
1. Navigate to "Notifications" with multiple unread
2. Click "Mark all read" button
3. **Expected Results:**
   - All blue highlights disappear
   - Badge count becomes 0

### Test 5.4: Auto-Refresh Notifications
1. Login as User A
2. Keep dashboard open
3. Have User B send a request
4. **Expected Results:**
   - Within 30 seconds, badge count updates automatically
   - No page refresh needed

---

## Test Scenario 6: Empty States

### Test 6.1: No Requests Received
1. Login as new user with no tasks
2. Navigate to "Requests"
3. **Expected Results:**
   - Empty state icon (inbox)
   - Message: "No requests yet"
   - Button: "Post a New Task"

### Test 6.2: No Requests Sent
1. Login as new user
2. Navigate to "My Requests"
3. **Expected Results:**
   - Empty state icon (send)
   - Message: "No requests sent yet"
   - Button: "Browse Task Feed"

### Test 6.3: No Notifications
1. Login as new user
2. Navigate to "Notifications"
3. **Expected Results:**
   - Empty state icon (bell)
   - Message: "No notifications yet"

---

## Test Scenario 7: UI/UX Features

### Test 7.1: Loading States
1. Send a request
2. **Expected Results:**
   - Button shows spinner
   - Button is disabled during loading
   - Other buttons remain functional

### Test 7.2: Status Badges
1. Check various request statuses
2. **Expected Results:**
   - Pending: Yellow badge with clock icon
   - Accepted: Green badge with checkmark
   - Rejected: Gray badge with X icon

### Test 7.3: Responsive Design
1. Test on mobile viewport (< 768px)
2. **Expected Results:**
   - Stats stack vertically
   - Request cards adapt to mobile
   - Buttons remain accessible

### Test 7.4: Real-time Stats
1. Accept/reject requests
2. **Expected Results:**
   - Stats update immediately
   - No page refresh needed

---

## Common Issues & Solutions

### Issue 1: Notification Badge Not Updating
**Solution:** Check browser console for API errors. Ensure backend is running.

### Issue 2: Request Button Stays Disabled
**Solution:** Clear browser cache and reload. Check network tab for API response.

### Issue 3: Notifications Not Appearing
**Solution:** Verify Notification model exists in backend. Check MongoDB connection.

### Issue 4: Auto-Rejection Not Working
**Solution:** Check requestController.js acceptRequest function. Verify MongoDB updateMany query.

---

## Performance Checks

1. **API Response Time:**
   - All endpoints should respond < 500ms
   - Check Network tab in DevTools

2. **Notification Polling:**
   - Should not cause performance issues
   - Check for memory leaks with long sessions

3. **Large Request Lists:**
   - Test with 50+ requests
   - Verify pagination if needed

---

## Security Checks

1. **Authentication:**
   - Try accessing endpoints without token → Should fail
   - Try accessing with expired token → Should fail

2. **Authorization:**
   - Try accepting someone else's request → Should fail
   - Try requesting own task → Should fail

3. **Data Validation:**
   - Try sending invalid taskId → Should fail
   - Try duplicate requests → Should fail

---

## Success Criteria

✅ Users can send requests for tasks
✅ Task owners receive notifications
✅ Task owners can accept/reject requests
✅ Helpers receive acceptance/rejection notifications
✅ Task status updates correctly
✅ Auto-rejection works for multiple requests
✅ Notification badge shows unread count
✅ All validations work correctly
✅ Empty states display properly
✅ Loading states work smoothly
✅ Error messages are clear and helpful
