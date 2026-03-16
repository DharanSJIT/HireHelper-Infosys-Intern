import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
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

  const applyNotifications = useCallback((nextNotifications) => {
    setNotifications(nextNotifications);
    setUnreadCount(nextNotifications.filter((item) => !item.isRead).length);
  }, []);

  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await getNotifications();
      const next = data?.notifications || [];
      setNotifications(next);
      setUnreadCount(data?.unreadCount ?? next.filter((item) => !item.isRead).length);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  const markOneRead = useCallback(async (notificationId) => {
    await markNotificationRead(notificationId);
    setNotifications((prev) => {
      const next = prev.map((n) =>
        n._id === notificationId ? { ...n, isRead: true, readAt: n.readAt || new Date().toISOString() } : n,
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

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return undefined;
    }

    let mounted = true;

    const bootstrap = async () => {
      try {
        setLoading(true);
        setError("");

        const [{ data: profileData }, { data: notificationData }] = await Promise.all([
          getProfile(),
          getNotifications(),
        ]);

        if (!mounted) return;

        const userId = profileData?.user?._id;
        const nextNotifications = notificationData?.notifications || [];

        setNotifications(nextNotifications);
        setUnreadCount(
          notificationData?.unreadCount ?? nextNotifications.filter((item) => !item.isRead).length,
        );

        if (!userId) {
          setLoading(false);
          return;
        }

        const socket = io(SOCKET_URL, {
          transports: ["websocket", "polling"],
        });

        socketRef.current = socket;

        socket.on("connect", () => {
          socket.emit("register", userId);
        });

        socket.on("new_notification", (incoming) => {
          if (!incoming?._id) return;

          setNotifications((prev) => {
            const withoutDuplicate = prev.filter((item) => item._id !== incoming._id);
            const next = [incoming, ...withoutDuplicate];
            setUnreadCount(next.filter((item) => !item.isRead).length);
            return next;
          });
        });

        socket.on("connect_error", () => {
          // keep UI working via API data even if socket reconnects in background
        });
      } catch (err) {
        if (!mounted) return;
        setError(err.response?.data?.message || "Failed to load notifications.");
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    bootstrap();

    return () => {
      mounted = false;
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      loading,
      error,
      loadNotifications,
      markOneRead,
      markAllRead,
      setNotifications: applyNotifications,
    }),
    [notifications, unreadCount, loading, error, loadNotifications, markOneRead, markAllRead, applyNotifications],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider");
  }
  return context;
};
