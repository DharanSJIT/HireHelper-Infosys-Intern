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

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(express.json({ limit: "10mb" }));

/* ================= ROUTES ================= */
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);

app.get("/api/dashboard", authMiddleware, (req, res) => {
  res.json({ message: "Welcome to Dashboard" });
});

/* ================= SOCKET SERVER ================= */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

/* ================= ONLINE USERS ================= */
const onlineUsers = new Map();

/* ================= SOCKET CONNECTION ================= */
io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  /* 🔥 REGISTER USER */
  socket.on("register", (userId) => {
    if (!userId) return;

    const id = userId.toString(); // ✅ FIX (IMPORTANT)

    onlineUsers.set(id, socket.id);

    console.log("✅ User registered:", id);
    console.log("🗂️ Online Users:", Array.from(onlineUsers.entries()));
  });

  /* 🔴 DISCONNECT */
  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);

    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        console.log("❌ Removed user:", userId);
        break;
      }
    }

    console.log("🗂️ Online Users after disconnect:", Array.from(onlineUsers.entries()));
  });
});

/* ================= MAKE SOCKET GLOBAL ================= */
app.set("io", io);
app.set("onlineUsers", onlineUsers);

/* ================= START SERVER ================= */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server start error:", error);
  }
};

startServer();