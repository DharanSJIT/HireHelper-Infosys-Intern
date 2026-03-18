import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { io } from "socket.io-client";
import {
  getNotifications,
  getProfile,
  markAllNotificationsRead,
  markNotificationRead,
  SOCKET_URL,
} from "../config/api";

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const socketRef = useRef(null);

  /* ================= HELPERS ================= */

  const updateState = useCallback((list) => {
    setNotifications(list);
    setUnreadCount(list.filter((item) => !item.isRead).length);
  }, []);

  /* ================= LOAD ================= */

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const { data } = await getNotifications();
      const list = data?.notifications || [];

      updateState(list);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }, [updateState]);

  /* ================= MARK READ ================= */

  const markOneRead = useCallback(async (id) => {
    await markNotificationRead(id);

    setNotifications((prev) => {
      const next = prev.map((n) =>
        n._id === id
          ? { ...n, isRead: true, readAt: n.readAt || new Date().toISOString() }
          : n
      );

      setUnreadCount(next.filter((item) => !item.isRead).length);
      return next;
    });
  }, []);

  const markAllRead = useCallback(async () => {
    await markAllNotificationsRead();

    setNotifications((prev) => {
      const next = prev.map((n) => ({
        ...n,
        isRead: true,
        readAt: n.readAt || new Date().toISOString(),
      }));

      setUnreadCount(0);
      return next;
    });
  }, []);

  /* ================= SOCKET ================= */

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const init = async () => {
      try {
        setLoading(true);
        setError("");

        const [{ data: profileData }, { data: notificationData }] =
          await Promise.all([getProfile(), getNotifications()]);

        if (!mounted) return;

        const userId = profileData?.user?._id;
        const list = notificationData?.notifications || [];

        updateState(list);

        if (!userId) {
          setLoading(false);
          return;
        }

        /* 🔥 FIX: Ensure only one socket */
        if (socketRef.current) {
          socketRef.current.disconnect();
        }

        const socket = io(SOCKET_URL, {
          transports: ["websocket"],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000,
        });

        socketRef.current = socket;

        /* ✅ CONNECT */
        socket.on("connect", () => {
          console.log("🟢 Socket connected:", socket.id);

          // 🔥 FIX: SEND STRING ID
          socket.emit("register", userId.toString());

          console.log("✅ Registered user:", userId);
        });

        /* ✅ REAL-TIME NOTIFICATION */
        socket.on("new_notification", (incoming) => {
          console.log("🔔 LIVE NOTIFICATION:", incoming);

          if (!incoming?._id) return;

          setNotifications((prev) => {
            const filtered = prev.filter((n) => n._id !== incoming._id);
            const next = [incoming, ...filtered];

            setUnreadCount(next.filter((item) => !item.isRead).length);

            return next;
          });
        });

        socket.on("disconnect", () => {
          console.log("🔴 Socket disconnected");
        });

        socket.on("connect_error", (err) => {
          console.log("❌ Socket error:", err.message);
        });

      } catch (err) {
        if (!mounted) return;
        setError(err.response?.data?.message || "Failed to load notifications.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    return () => {
      mounted = false;

      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [updateState]);

  /* ================= CONTEXT VALUE ================= */

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      loading,
      error,
      loadNotifications,
      markOneRead,
      markAllRead,
      setNotifications: updateState,
    }),
    [
      notifications,
      unreadCount,
      loading,
      error,
      loadNotifications,
      markOneRead,
      markAllRead,
      updateState,
    ]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

/* ================= HOOK ================= */

export const useNotifications = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }

  return context;
};