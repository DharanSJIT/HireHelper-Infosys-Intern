import React, { useMemo, useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { getNotifications, getProfile } from "../config/api";

import {
  Rss,
  ListTodo,
  Inbox,
  Send,
  PlusCircle,
  Settings as SettingsIcon,
  Menu,
  ChevronRight,
  LogOut,
  Hexagon,
  Bell
} from "lucide-react";

const NAV_ITEMS = [
  {
    path: "/dashboard/feed",
    label: "Task Feed",
    icon: <Rss className="w-[18px] h-[18px]" strokeWidth={2} />,
  },
  {
    path: "/dashboard/my-tasks",
    label: "My Tasks",
    icon: <ListTodo className="w-[18px] h-[18px]" strokeWidth={2} />,
  },
  {
    path: "/dashboard/requests",
    label: "Requests",
    icon: <Inbox className="w-[18px] h-[18px]" strokeWidth={2} />,
  },
  {
    path: "/dashboard/my-requests",
    label: "My Requests",
    icon: <Send className="w-[18px] h-[18px]" strokeWidth={2} />,
  },
  {
    path: "/dashboard/add-task",
    label: "Post a Task",
    icon: <PlusCircle className="w-[18px] h-[18px]" strokeWidth={2} />,
  },
  {
    path: "/dashboard/settings",
    label: "Settings",
    icon: <SettingsIcon className="w-[18px] h-[18px]" strokeWidth={2} />,
  },
];

export default function Dashboard() {

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const [user, setUser] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  /* ================= LOAD USER PROFILE ================= */

  useEffect(() => {
    loadProfile();
    loadNotifications();

    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);

  }, []);

  const loadProfile = async () => {
    try {
      const res = await getProfile();
      setUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  /* ================= NOTIFICATIONS ================= */

  const loadNotifications = async () => {
    try {
      const { data } = await getNotifications();
      setUnreadCount(data?.unreadCount || 0);
    } catch (err) {}
  };

  /* ================= LOGOUT ================= */

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const currentItem = useMemo(
    () => NAV_ITEMS.find((item) => item.path === location.pathname),
    [location.pathname]
  );

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      {/* ================= SIDEBAR ================= */}

      <aside
        className={`flex-shrink-0 bg-blue-700 flex flex-col transition-all duration-300 ${
          sidebarOpen ? "w-64" : "w-0"
        }`}
      >
        {/* Logo */}

        <div className="px-5 py-5 border-b border-blue-600 flex items-center gap-3">
          <div className="bg-blue-600/50 p-2 rounded">
            <Hexagon className="w-4 h-4 text-white" fill="currentColor" />
          </div>

          <div>
            <p className="text-white font-bold text-sm">HireHelper</p>
            <p className="text-blue-200 text-[10px] uppercase">Platform</p>
          </div>
        </div>

        {/* NAVIGATION */}

        <nav className="flex-1 px-3 py-4 space-y-1">

          <p className="px-3 mb-3 text-[10px] font-bold uppercase text-blue-300">
            Navigation
          </p>

          {NAV_ITEMS.map((item) => {

            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? "bg-white text-blue-700"
                    : "text-blue-100 hover:bg-white/10"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>

                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT */}

        <div className="p-4 border-t border-blue-600">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold 
                       bg-blue-800/40 text-blue-100 hover:bg-red-500 hover:text-white"
          >
            <LogOut className="w-[18px] h-[18px]" />
            Sign Out
          </button>
        </div>

      </aside>

      {/* ================= MAIN AREA ================= */}

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* TOP BAR */}

        <header className="bg-white border-b border-slate-200">

          <div className="flex items-center justify-between px-6 h-[60px]">

            {/* LEFT */}

            <div className="flex items-center gap-3">

              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-slate-100"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-sm">

                <span className="text-slate-400 hidden sm:block">
                  Dashboard
                </span>

                {currentItem && (
                  <>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                    <span className="font-bold text-slate-900">
                      {currentItem.label}
                    </span>
                  </>
                )}

              </div>

            </div>

            {/* RIGHT */}

            <div className="flex items-center gap-4">

              <Link
                to="/dashboard/add-task"
                className="hidden sm:inline-flex bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                <PlusCircle className="w-4 h-4 mr-1" />
                Post Task
              </Link>

              {/* Notifications */}

              <Link
                to="/dashboard/notifications"
                className="relative p-2 rounded-lg hover:bg-slate-100"
              >
                <Bell className="w-5 h-5" />

                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Link>

              {/* PROFILE AVATAR */}
              <Link
              to="/dashboard/settings"
              className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center font-bold text-blue-700 uppercase"
              >
              {user?.first_name ? user.first_name.charAt(0) : "U"}
              </Link>

            </div>

          </div>

        </header>

        {/* PAGE CONTENT */}

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>

      </div>

    </div>
  );
}