# Quick Start Guide - HireHelper

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running locally or MongoDB Atlas)
- npm or yarn

---

## 📦 Installation

### 1. Clone the Repository
```bash
cd /Volumes/Volume-F/HireHelper-Batch4
```

### 2. Install Backend Dependencies
```bash
cd Backend
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

---

## ⚙️ Configuration

### Backend Environment Variables
Create/verify `.env` file in `Backend/` directory:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/hirehelper
JWT_SECRET=your_jwt_secret_key_here
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
```

### Frontend Configuration
Verify API base URL in `frontend/src/config/api.js`:
```javascript
baseURL: 'http://localhost:3000/api/auth'
```

---

## 🏃 Running the Application

### Option 1: Run Both Servers Separately

#### Terminal 1 - Backend
```bash
cd Backend
npm start
```
Backend will run on: `http://localhost:3000`

#### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```
Frontend will run on: `http://localhost:5173` (or next available port)

### Option 2: Using Concurrently (if configured)
```bash
npm run dev
```

---

## 🧪 Testing Milestone 3 Features

### Create Test Users

#### User 1 (Task Owner)
1. Go to `http://localhost:5173/signup`
2. Register:
   - First Name: Alice
   - Last Name: Smith
   - Email: alice@example.com
   - Password: password123
3. Verify OTP (check console logs for OTP)
4. Login

#### User 2 (Helper)
1. Open incognito/private window
2. Go to `http://localhost:5173/signup`
3. Register:
   - First Name: Bob
   - Last Name: Johnson
   - Email: bob@example.com
   - Password: password123
4. Verify OTP
5. Login

---

## 🎯 Feature Testing Flow

### 1. Create a Task (User 1 - Alice)
1. Login as Alice
2. Click "Post a Task" or navigate to `/dashboard/add-task`
3. Fill in task details:
   ```
   Title: Help with Moving Furniture
   Description: Need help moving a couch to 2nd floor
   Category: Moving
   Location: 123 Main St, Boston, MA
   Start Date: Tomorrow
   Start Time: 2:00 PM
   ```
4. Upload image (optional)
5. Click "Create Task"
6. Verify task appears in "My Tasks"

### 2. Send Request (User 2 - Bob)
1. Login as Bob (in incognito window)
2. Navigate to "Task Feed"
3. Find Alice's task
4. Click "Send Request to Help"
5. Verify success message appears
6. Navigate to "My Requests"
7. Verify request appears with "pending" status

### 3. Review Request (User 1 - Alice)
1. Switch back to Alice's window
2. Check notification bell (should show "1")
3. Navigate to "Requests"
4. Verify Bob's request appears
5. Click "Accept" button
6. Verify:
   - Request status changes to "accepted"
   - Stats update
   - Task in "My Tasks" shows "assigned" status

### 4. Check Notification (User 2 - Bob)
1. Switch to Bob's window
2. Check notification bell (should show "1")
3. Click bell icon → Navigate to "Notifications"
4. Verify acceptance notification appears
5. Click notification to mark as read
6. Navigate to "My Requests"
7. Verify request status is "accepted"

---

## 📱 Navigation Guide

### Main Pages

#### Dashboard (`/dashboard`)
- Default landing page after login
- Redirects to Task Feed

#### Task Feed (`/dashboard/feed`)
- Browse all open tasks
- Send requests to help
- View task details

#### My Tasks (`/dashboard/my-tasks`)
- View tasks you created
- See task status (open, assigned, completed)
- View assigned helpers

#### Requests (`/dashboard/requests`)
- View incoming requests for your tasks
- Accept or reject requests
- See request statistics

#### My Requests (`/dashboard/my-requests`)
- View requests you sent
- Track request status
- See acceptance/rejection status

#### Notifications (`/dashboard/notifications`)
- View all notifications
- Mark notifications as read
- See notification history

#### Post a Task (`/dashboard/add-task`)
- Create new tasks
- Upload task images
- Set task details

#### Settings (`/dashboard/settings`)
- Update profile
- Change profile picture
- Manage account settings

---

## 🔧 Troubleshooting

### Backend Issues

#### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Start MongoDB service
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

#### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solution:** Kill process on port 3000
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Frontend Issues

#### Module Not Found
```
Error: Cannot find module 'axios'
```
**Solution:** Reinstall dependencies
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

#### API Connection Error
```
Network Error / CORS Error
```
**Solution:** 
1. Verify backend is running
2. Check API base URL in `api.js`
3. Verify CORS is enabled in backend

### Common Issues

#### OTP Not Received
**Solution:** Check backend console logs for OTP code

#### Images Not Uploading
**Solution:** Verify Cloudinary credentials in `.env`

#### Notifications Not Updating
**Solution:** 
1. Check browser console for errors
2. Verify backend is running
3. Clear browser cache

---

## 📊 Database Structure

### Collections

#### users
- User accounts and profiles
- Authentication data

#### tasks
- Task details
- Status tracking
- Assignment information

#### requests
- Task requests
- Request status
- Helper-Task linkage

#### notifications
- User notifications
- Read/unread status
- Notification types

---

## 🔐 API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/verify-otp` - Verify OTP
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile

### Tasks
- POST `/api/tasks/create` - Create task
- GET `/api/tasks/my-tasks` - Get user's tasks
- GET `/api/tasks/feed` - Get all open tasks

### Requests
- POST `/api/requests/:taskId` - Send request
- GET `/api/requests/my-tasks` - Get requests for user's tasks
- GET `/api/requests/my-requests` - Get user's sent requests
- PATCH `/api/requests/:requestId/accept` - Accept request
- PATCH `/api/requests/:requestId/reject` - Reject request

### Notifications
- GET `/api/requests/notifications` - Get notifications
- PATCH `/api/requests/notifications/:id/read` - Mark as read
- PATCH `/api/requests/notifications/read-all` - Mark all as read

---

## 📝 Development Tips

### Hot Reload
Both frontend and backend support hot reload:
- Frontend: Vite automatically reloads on file changes
- Backend: Use `nodemon` for auto-restart

### Debugging
- Backend: Add `console.log()` in controllers
- Frontend: Use React DevTools browser extension
- Network: Check browser DevTools Network tab

### Database Inspection
```bash
# Connect to MongoDB
mongosh

# Use database
use hirehelper

# View collections
show collections

# Query data
db.users.find()
db.tasks.find()
db.requests.find()
db.notifications.find()
```

---

## 🎉 Success Indicators

You'll know everything is working when:
- ✅ Backend starts without errors
- ✅ Frontend loads at localhost:5173
- ✅ You can register and login
- ✅ Tasks appear in feed
- ✅ Requests can be sent
- ✅ Notifications appear
- ✅ No console errors

---

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Review error messages in console
3. Check browser DevTools Network tab
4. Verify all dependencies are installed
5. Ensure MongoDB is running
6. Check environment variables

---

## 🚀 Next Steps

After successful setup:
1. Complete manual testing (see TESTING_GUIDE.md)
2. Review API documentation (see API_DOCUMENTATION.md)
3. Check milestone completion (see MILESTONE_3_CHECKLIST.md)
4. Start building Milestone 4 features

---

**Happy Coding! 🎉**
