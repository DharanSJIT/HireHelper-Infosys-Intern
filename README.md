# HireHelper 

<img width="1918" height="881" alt="image" src="https://github.com/user-attachments/assets/2b7e88c1-0757-4498-bb99-d7d52ee9e56e" />
<br>
HireHelper is a full-stack web application that allows users to post tasks and request help from others. Users can create tasks, send requests to perform tasks, accept or reject requests, and receive notifications for different activities on the platform.

The goal of this platform is to simplify everyday help by connecting people who need assistance with those willing to complete tasks.

---

## Features

### User Authentication

* User registration with email verification using OTP
* Secure login using JWT authentication
* Password reset using OTP
* Profile management and profile picture upload

### Task Management

* Create new tasks with details such as title, description, category, location, and schedule
* Upload images for tasks
* View tasks created by the user
* Browse tasks posted by other users
* View assigned tasks

### Request System

* Send requests to perform tasks
* Accept or reject task requests
* Prevent duplicate task requests
* Track status of requests

### Notification System

* Receive notifications when someone requests your task
* Receive notifications when your request is accepted or rejected
* Mark notifications as read

### Profile Settings

* Update personal information
* Upload or update profile picture
* View activity statistics

---

## Tech Stack

### Frontend

* React
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### Authentication

* JSON Web Tokens (JWT)
* bcrypt for password hashing

### Cloud Storage

* Cloudinary for image uploads
---

## Installation

### 1. Clone the repository

```
git clone https://github.com/springboard-mentor-batch13/HireHelper-Batch4.git
```

### 2. Install dependencies

Backend:

```
cd app
npm install
```

Frontend:

```
cd frontend
npm install
```

### 3. Setup environment variables

Create a `.env` file in the backend directory.

Example:

```
PORT=3000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
EMAIL_USER=your_email
EMAIL_PASS=your_password
```

### 4. Run the application

Start backend:

```
npm run dev
```

Start frontend:

```
npm start
```
---

## License

This project is open-source and available for learning and development purposes.
