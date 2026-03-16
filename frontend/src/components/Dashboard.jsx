import React, { useMemo, useState, useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { getProfile } from "../config/api";
import { useNotifications } from "../context/NotificationContext";
import logo from "../assets/logo.png";

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
  Bell,
  X,
  ChevronRight as ItemArrow,
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
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true
  );
  const [user, setUser] = useState(null);
  const { unreadCount } = useNotifications();

  const location = useLocation();
  const navigate = useNavigate();

  /* ================= LOAD USER PROFILE ================= */

  useEffect(() => {
    loadProfile();
  }, []);

  useEffect(() => {
    const onResize = () => {
      const desktop = window.innerWidth >= 1024;
      setIsDesktop(desktop);
      setSidebarOpen(desktop);
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getProfile();
      setUser(res.data?.user || null);
    } catch (err) {
      console.log(err);
    }
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
  const userInitial = (user?.first_name?.charAt(0) || "U").toUpperCase();
  const userName = [user?.first_name, user?.last_name].filter(Boolean).join(" ") || "User";
  const userEmail = user?.email_id || "Signed in";

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const closeSidebarOnMobile = () => {
    if (!isDesktop) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="relative flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && !isDesktop && (
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-slate-900/30 lg:hidden"
          aria-label="Close menu overlay"
        />
      )}

      {/* ================= SIDEBAR ================= */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-[#103fbc] via-[#123fb2] to-[#0b2f88] flex flex-col overflow-hidden
          transition-transform duration-300 ease-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:static lg:z-auto lg:inset-auto
          lg:transition-all
          ${sidebarOpen ? "lg:w-72" : "lg:w-0"}
        `}
      >
        <div className="absolute -top-20 -right-14 w-56 h-56 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute top-40 -left-12 w-40 h-40 rounded-full bg-cyan-300/10 blur-2xl pointer-events-none" />

        {/* Logo */}

        <div className="relative px-5 py-5 border-b border-white/15 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="bg-white/14 backdrop-blur border border-white/20 p-1.5 rounded-xl shadow-sm">
              <img src={logo} alt="HireHelper logo" className="w-7 h-7 rounded-lg object-cover" />
            </div>

            <div>
              <p className="text-white font-extrabold tracking-tight text-md">HireHelper</p>
              <p className="text-blue-100/80 text-[10px] uppercase tracking-[0.16em]">Work Platform</p>
            </div>
          </div>

          {!isDesktop && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg text-blue-100 hover:bg-white/10 hover:text-white"
              aria-label="Close sidebar"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* NAVIGATION */}

        <nav className="relative flex-1 px-3.5 py-5 space-y-1.5 overflow-y-auto">
          <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-[0.18em] text-blue-100/70">
            Navigation
          </p>

          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={closeSidebarOnMobile}
                className={`group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-white text-blue-700 shadow-[0_8px_18px_rgba(4,26,89,0.22)]"
                    : "text-blue-100/90 hover:bg-white/10 hover:text-white hover:translate-x-0.5"
                }`}
              >
                <span
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    isActive ? "bg-blue-50 text-blue-700" : "bg-white/10 text-blue-100 group-hover:bg-white/15"
                  }`}
                >
                  {item.icon}
                </span>

                <span className="truncate">{item.label}</span>

                {isActive && (
                  <span className="ml-auto flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    <ItemArrow className="w-3.5 h-3.5 text-blue-500" />
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT */}

        <div className="relative p-4 border-t border-white/15 bg-[#0a2a78]/40 backdrop-blur-sm">
          <Link
            to="/dashboard/settings"
            className="mb-3 flex items-center gap-3 rounded-xl border border-white/15 bg-white/10 px-3 py-2.5 hover:bg-white/15 transition-colors"
          >
            {user?.profilePicture ? (
              <img
                src={user.profilePicture}
                alt={userName}
                className="w-9 h-9 rounded-lg object-cover border border-white/30 bg-white/90"
              />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-white text-blue-700 font-bold flex items-center justify-center">
                {userInitial}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{userName}</p>
              <p className="text-[11px] text-blue-100/80 truncate">{userEmail}</p>
            </div>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold
                       bg-red-500 text-white border border-red-400 hover:bg-red-600 hover:border-red-500 transition-colors"
          >
            <LogOut className="w-[18px] h-[18px]" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ================= MAIN AREA ================= */}

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* TOP BAR */}

        <header className="bg-white border-b border-slate-200">
          <div className="flex items-center justify-between px-4 sm:px-6 h-[60px]">
            {/* LEFT */}

            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-slate-100"
                aria-label="Toggle sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-sm min-w-0">
                <span className="text-slate-400 hidden sm:block">Dashboard</span>

                {currentItem && (
                  <>
                    <ChevronRight className="w-4 h-4 text-slate-300" />
                    <span className="font-bold text-slate-900 truncate">
                      {currentItem.label}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* RIGHT */}

            <div className="flex items-center gap-2 sm:gap-4">
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

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
