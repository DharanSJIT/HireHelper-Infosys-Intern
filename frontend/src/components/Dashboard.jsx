import React, { useMemo, useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { getNotifications } from '../config/api';
import { 
  Rss, 
  ListTodo, 
  Inbox, 
  Send, 
  PlusCircle, 
  Settings as SettingsIcon,
  Menu,
  X,
  ChevronRight,
  LogOut,
  Hexagon,
  Bell
} from 'lucide-react';

const NAV_ITEMS = [
  {
    path: '/dashboard/feed',
    label: 'Task Feed',
    icon: <Rss className="w-[18px] h-[18px]" strokeWidth={2} />,
  },
  {
    path: '/dashboard/my-tasks',
    label: 'My Tasks',
    icon: <ListTodo className="w-[18px] h-[18px]" strokeWidth={2} />,
  },
  {
    path: '/dashboard/requests',
    label: 'Requests',
    icon: <Inbox className="w-[18px] h-[18px]" strokeWidth={2} />,
  },
  {
    path: '/dashboard/my-requests',
    label: 'My Requests',
    icon: <Send className="w-[18px] h-[18px]" strokeWidth={2} />,
  },
  {
    path: '/dashboard/add-task',
    label: 'Post a Task',
    icon: <PlusCircle className="w-[18px] h-[18px]" strokeWidth={2} />,
  },
  {
    path: '/dashboard/settings',
    label: 'Settings',
    icon: <SettingsIcon className="w-[18px] h-[18px]" strokeWidth={2} />,
  },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      const { data } = await getNotifications();
      setUnreadCount(data?.unreadCount || 0);
    } catch (err) {
      // Silent fail
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const currentItem = useMemo(
    () => NAV_ITEMS.find((item) => item.path === location.pathname),
    [location.pathname],
  );

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      {/* ── Sidebar ───────── */}
      <aside
        className={`flex-shrink-0 bg-blue-700 flex flex-col transition-all duration-300 ease-in-out ${
          sidebarOpen ? 'w-64' : 'w-0'
        }`}
        style={{ boxShadow: sidebarOpen ? '4px 0 20px 0 rgba(29,78,216,0.18)' : 'none' }}
      >
        {/* Logo */}
        <div className={`px-5 py-5 border-b border-blue-600/60 flex items-center gap-3 overflow-hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="sidebar-logo-ring bg-blue-600/50">
            <Hexagon className="w-4 h-4 text-white" fill="currentColor" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none whitespace-nowrap">HireHelper</p>
            <p className="text-blue-200 text-[10px] leading-none mt-0.5 tracking-wider uppercase whitespace-nowrap">Platform</p>
          </div>
        </div>

        {/* Nav */}
        <nav className={`flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0'
        }`}>
          <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest text-blue-300/70 whitespace-nowrap">Navigation</p>
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-white text-blue-700 shadow-sm'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className={`p-4 border-t border-blue-600/60 overflow-hidden ${
          sidebarOpen ? 'opacity-100' : 'opacity-0'
        }`}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold 
                       bg-blue-800/40 text-blue-100 hover:bg-red-500 hover:text-white transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            <LogOut className="w-[18px] h-[18px]" strokeWidth={2} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main Area ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 flex-shrink-0" style={{ boxShadow: 'var(--shadow-xs)' }}>
          <div className="flex items-center justify-between px-5 md:px-6 h-[60px]">

            {/* Left: hamburger + breadcrumb */}
            <div className="flex items-center gap-3">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer transition-colors duration-150 active:bg-slate-200"
                aria-label="Toggle menu"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400 font-medium hidden sm:inline-block">Dashboard</span>
                {currentItem && (
                  <>
                    <ChevronRight className="w-4 h-4 text-slate-300 hidden sm:inline-block" />
                    <span className="font-bold text-slate-900">{currentItem.label}</span>
                  </>
                )}
              </div>
            </div>

            {/* Right: CTA + notifications + avatar */}
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard/add-task"
                className="hidden sm:inline-flex btn-primary text-sm px-4 py-2"
              >
                <PlusCircle className="w-4 h-4" />
                Post Task
              </Link>
              
              {/* Notification Bell */}
              <Link
                to="/dashboard/notifications"
                className="relative p-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </Link>
              
              {/* Profile avatar link to settings */}
              <Link
                to="/dashboard/settings"
                className="relative inline-flex items-center justify-center w-9 h-9 bg-blue-100 rounded-full text-blue-700 text-sm font-bold cursor-pointer hover:bg-blue-200 transition-colors border-2 border-white shadow-sm"
                title="Profile"
              >
                U
                {/* Online indicator */}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-6 page-enter">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
