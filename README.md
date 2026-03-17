# HireHelper

HireHelper is a full-stack task marketplace where users can post local tasks, request to help on open tasks, and manage request decisions with real-time in-app notifications.

## Current Project Status

- Backend and frontend are both implemented and runnable locally.
- Core milestone features (authentication, task posting, request flow, notification center) are integrated end-to-end.
- Real-time in-app notifications are implemented with Socket.IO (in addition to REST APIs).

## Implemented Features

### 1) Authentication & Account Security

- User signup with:
  - first name, last name, email, phone number, password
- Password policy enforcement (uppercase, lowercase, number, special character, minimum 8 chars)
- OTP-based email verification
- OTP resend flow
- Login with JWT token authentication
- Forgot password + OTP-based password reset
- Protected dashboard routes on frontend

### 2) User Profile

- Fetch logged-in user profile
- Update profile details (name, phone)
- Upload/update profile picture (Cloudinary via multer-storage-cloudinary)
- Profile stats API provides:
  - tasks posted
  - tasks completed (based on `completed` status)
  - requests sent

### 3) Task Management

- Create task with:
  - title, description, category, location
  - start date/time and optional end date/time
  - optional image upload (base64 -> Cloudinary)
- View task feed (open tasks from other users)
- View my posted tasks
- View assigned tasks (API available)
- Get task by ID
- Edit task (owner only)
- Delete task (owner only)
- Task statuses supported by data model:
  - `open`
  - `assigned`
  - `completed`

### 4) Request Workflow

- Send request to help on an open task
- Prevent invalid actions:
  - cannot request your own task
  - cannot request non-open task
  - cannot send duplicate request for same task
- View incoming requests for tasks I posted
- View requests I sent
- Accept request:
  - marks selected request `accepted`
  - assigns helper to task (`assignedTo`)
  - marks task `assigned`
  - auto-rejects other pending requests for that task
- Reject request manually

### 5) Notifications (Realtime + API)

- Notification types:
  - `new_request`
  - `request_accepted`
  - `request_rejected`
- Notification center UI with unread counters
- Mark one notification read
- Mark all notifications read
- Real-time push delivery using Socket.IO:
  - frontend registers user socket on login session
  - backend emits `new_notification` to online recipients

### 6) Frontend UX

- Landing page + full auth screens
- Dashboard shell with responsive sidebar
- Task feed with:
  - title/location search
  - category filtering
  - loading/error/empty states
- My Tasks with edit/delete actions and confirmation dialog
- Requests/My Requests dashboards with status stats
- Toast notifications and confirm dialog contexts

## Tech Stack

### Frontend

- React 18
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- Lucide React
- Socket.IO Client

### Backend

- Node.js
- Express
- MongoDB + Mongoose
- JWT
- bcryptjs
- Nodemailer (OTP email)
- Cloudinary + Multer
- Socket.IO

## Project Structure

```text
HireHelper-Batch4/
├── Backend/
│   ├── app.js
│   ├── config/
│   ├── Controllers/
│   ├── middlewares/
│   ├── Models/
│   ├── routes/
│   └── utils/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── config/api.js
│   └── package.json
├── API_DOCUMENTATION.md
├── QUICK_START.md
└── TESTING_GUIDE.md
```

## Local Setup

## 1) Prerequisites

- Node.js 18+
- npm
- MongoDB (local or Atlas)
- Cloudinary account (for image upload)
- SMTP credentials (for OTP email)

## 2) Install Dependencies

```bash
cd Backend
npm install

cd ../frontend
npm install
```

## 3) Backend Environment

Create `Backend/.env`:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/hirehelper
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

EMAIL=your_email@example.com
EMAIL_PASS=your_email_app_password
```

## 4) Frontend Environment

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```

(If omitted, the frontend defaults to `http://localhost:3000/api` and derives socket URL automatically.)

## 5) Run

Backend:

```bash
cd Backend
npm run dev
```

Frontend:

```bash
cd frontend
npm run dev
```

Open the frontend URL shown by Vite (usually `http://localhost:5173`).

## API Groups

- `/api/auth` - register, verify OTP, login, resend OTP, forgot/reset password
- `/api/users` - profile fetch/update, profile picture upload
- `/api/tasks` - create/read/update/delete tasks + feed + assigned
- `/api/requests` - send/manage requests
- `/api/notifications` - list and mark notifications read

For endpoint-level details, see `API_DOCUMENTATION.md`.

## Notes / Current Gaps

- Task completion transition (`assigned -> completed`) is present in the model/stats but there is currently no dedicated API/UI action in this repo to mark a task completed.
- Existing docs (`MILESTONE_3_SUMMARY.md`, `QUICK_START.md`, `TESTING_GUIDE.md`) are still useful, but this README is now the canonical high-level status.
