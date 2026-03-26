require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const connectDB = require("./config/connectDB");

const authRoutes = require("./routes/authRoutes.js");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes.js");
const authMiddleware = require("./middlewares/authMiddleware.js");
const requestRoutes = require("./routes/requestRoutes.js");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();
const isVercel = process.env.VERCEL === "1";
const onlineUsers = new Map();
const dbConnectionPromise = connectDB();

app.set("io", null);
app.set("onlineUsers", onlineUsers);

/* ================= MIDDLEWARE ================= */
const allowedOrigins = [
  "https://hirehelper.vercel.app",
  "https://hirehelper-infosys-intern.vercel.app",
];

const corsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json({ limit: "10mb" }));
app.use(async (req, res, next) => {
  try {
    await dbConnectionPromise;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/api/dashboard", authMiddleware, (req, res) => {
  res.json({ message: "Welcome to Dashboard" });
});

app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Backend is running" });
});

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;

if (!isVercel) {
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  /* ================= SOCKET CONNECTION ================= */
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("register", (userId) => {
      if (!userId) return;

      const id = userId.toString();
      onlineUsers.set(id, socket.id);
    });

    socket.on("disconnect", () => {
      for (let [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }
    });
  });

  app.set("io", io);

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
