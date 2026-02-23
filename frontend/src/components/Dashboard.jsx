import React, { useMemo, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';

const NAV_ITEMS = [
  {
    path: '/dashboard/feed',
    label: 'Task Feed',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" className="w-[18px] h-[18px] stroke-current">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
  {
    path: '/dashboard/my-tasks',
    label: 'My Tasks',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" className="w-[18px] h-[18px] stroke-current">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    path: '/dashboard/requests',
    label: 'Requests',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" className="w-[18px] h-[18px] stroke-current">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
  {
    path: '/dashboard/my-requests',
    label: 'My Requests',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" className="w-[18px] h-[18px] stroke-current">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    path: '/dashboard/add-task',
    label: 'Post a Task',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" className="w-[18px] h-[18px] stroke-current">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    path: '/dashboard/settings',
    label: 'Settings',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" className="w-[18px] h-[18px] stroke-current">
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const currentItem = useMemo(
    () => NAV_ITEMS.find((item) => item.path === location.pathname),
    [location.pathname],
  );

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">

      {/* ── Sidebar ────────────────────────────────────────────── */}
      <aside
        className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          fixed inset-y-0 left-0 z-50 w-64 flex-shrink-0
          bg-blue-700 flex flex-col
          transition-transform duration-300 ease-in-out`}
        style={{ boxShadow: '2px 0 16px 0 rgba(29,78,216,0.12)' }}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-blue-600/60">
          <div className="flex items-center gap-3">
            <div className="sidebar-logo-ring">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="w-4 h-4 stroke-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-sm leading-none">HireHelper</p>
              <p className="text-blue-200 text-[10px] leading-none mt-0.5">Task Platform</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-widest text-blue-300/70">Navigation</p>
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-all duration-150 ${
                  isActive
                    ? 'bg-white text-blue-700 font-semibold'
                    : 'text-blue-100 hover:bg-blue-600/50 hover:text-white'
                }`}
                style={isActive ? { boxShadow: 'var(--shadow-sm)' } : {}}
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
        <div className="px-3 py-4 border-t border-blue-600/60">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium bg-red-500 justify-center 
                       text-blue-100 hover:bg-red-600 hover:text-red-200
                       transition-colors duration-150 cursor-pointer"
          >
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" className="w-[18px] h-[18px] stroke-current">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── Main Area ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Topbar */}
        <header className="bg-white border-b border-slate-200 flex-shrink-0" style={{ boxShadow: 'var(--shadow-xs)' }}>
          <div className="flex items-center justify-between px-5 md:px-6 h-[60px]">
            {/* Left: hamburger + breadcrumb */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 cursor-pointer transition-colors duration-150"
                aria-label="Toggle menu"
              >
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="w-5 h-5 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-slate-400 font-medium">Dashboard</span>
                {currentItem && (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="w-3.5 h-3.5 stroke-slate-300">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                    <span className="font-semibold text-slate-900">{currentItem.label}</span>
                  </>
                )}
              </div>
            </div>

            {/* Right: CTA + avatar */}
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard/add-task"
                className="hidden sm:inline-flex btn-primary text-sm px-4 py-2"
              >
                <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="w-4 h-4 stroke-current">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Post Task
              </Link>
              <div
                className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:bg-blue-700 transition-colors duration-150"
                title="Profile"
              >
                U
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-5 md:p-6 page-enter">
          <Outlet />
        </main>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-40 backdrop-blur-[1px]"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}
