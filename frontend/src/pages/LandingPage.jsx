import React from 'react';
import { Link } from 'react-router-dom';

const NAV_LINKS = [
  { href: '#features', label: 'Features' },
  { href: '#how', label: 'How It Works' },
  { href: '#contact', label: 'Contact' },
];

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" className="w-5 h-5 stroke-blue-600">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'Clear Task Briefs',
    desc: 'Every task includes title, location, schedule, and an optional proof image — so helpers understand exactly what is needed.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" className="w-5 h-5 stroke-blue-600">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'Instant Requesting',
    desc: 'Helpers can send a request to any open task in one click from the live feed, with no friction or extra steps.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" className="w-5 h-5 stroke-blue-600">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Transparent Status',
    desc: 'Track every task through open, assigned, and completed states with a clear, real-time dashboard view.',
  },
];

const HOW_STEPS = [
  {
    step: '01',
    title: 'Post Your Task',
    desc: 'Describe the work, set a location and schedule, and publish in minutes.',
  },
  {
    step: '02',
    title: 'Review Requests',
    desc: 'Helpers browse your task and send requests. You choose who to assign.',
  },
  {
    step: '03',
    title: 'Get It Done',
    desc: 'Track progress in real time and mark tasks complete when the job is finished.',
  },
];

const STATS = [
  { value: '1,000+', label: 'Active Helpers' },
  { value: '5,000+', label: 'Tasks Completed' },
  { value: '4.8 / 5', label: 'Average Rating' },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">

      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200" style={{ boxShadow: 'var(--shadow-xs)' }}>
        <div className="container-app h-[68px] flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="w-5 h-5 stroke-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-bold text-[17px] text-slate-900 tracking-tight">HireHelper</span>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors duration-150"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-2.5">
            <Link to="/login" className="btn-secondary text-sm px-4 py-2">Sign In</Link>
            <Link to="/signup" className="btn-primary text-sm px-4 py-2">Get Started</Link>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-slate-200">
        {/* Dot texture background */}
        <div className="absolute inset-0 hero-dots opacity-60 pointer-events-none" />

        <div className="relative container-app py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            {/* Left: Copy */}
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-xs font-semibold text-blue-700 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                On-demand local task assistance
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold leading-[1.15] tracking-tight text-slate-900">
                Post tasks.<br />
                <span className="text-blue-600">Find helpers.</span><br />
                Get things done.
              </h1>

              <p className="mt-5 text-base md:text-lg text-slate-600 leading-relaxed max-w-lg">
                HireHelper connects task owners with skilled local helpers — with a clean workflow built for speed, transparency, and reliable coordination.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <Link to="/signup" className="btn-primary text-sm px-6 py-3">Post a Task</Link>
                <Link to="/login" className="btn-secondary text-sm px-6 py-3">Browse Tasks</Link>
              </div>

              {/* Trust Bar */}
              <div className="mt-10 flex items-center gap-6 flex-wrap">
                {STATS.map(({ value, label }) => (
                  <div key={label} className="text-center">
                    <p className="text-xl font-bold text-slate-900 stat-number">{value}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Platform Preview Card */}
            <div className="surface-card p-1 overflow-hidden">
              {/* Card Header */}
              <div className="bg-slate-50 border-b border-slate-200 px-5 py-4 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                </div>
                <span className="text-xs font-medium text-slate-500 ml-2">HireHelper — Task Dashboard</span>
              </div>

              <div className="p-5 space-y-3">
                {[
                  { title: 'Help move a sofa', category: 'Moving', status: 'open', time: 'Today, 3:00 PM' },
                  { title: 'Apartment deep clean', category: 'Cleaning', status: 'assigned', time: 'Tomorrow, 10:00 AM' },
                  { title: 'IKEA furniture assembly', category: 'General', status: 'open', time: 'Feb 25, 9:00 AM' },
                ].map((task) => (
                  <div key={task.title} className="flex items-center justify-between p-4 rounded-lg border border-slate-200 hover:border-blue-200 transition-colors duration-150 cursor-pointer">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-100 flex-shrink-0 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" className="w-4 h-4 stroke-blue-600">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{task.title}</p>
                        <p className="text-xs text-slate-500">{task.category} · {task.time}</p>
                      </div>
                    </div>
                    <span className={`badge flex-shrink-0 ml-3 ${task.status === 'open' ? 'badge-green' : 'badge-amber'}`}>
                      {task.status}
                    </span>
                  </div>
                ))}

                <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>3 tasks shown</span>
                  <span className="text-blue-600 font-medium cursor-pointer">View all →</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────── */}
      <section id="features" className="bg-slate-50 border-b border-slate-200 py-20">
        <div className="container-app">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">Why HireHelper</p>
            <h2 className="section-head text-3xl">Built for clarity and speed</h2>
            <p className="section-sub mt-3 max-w-lg mx-auto">
              A clean, focused workflow for both task owners and helpers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {FEATURES.map((f) => (
              <article key={f.title} className="surface-card-hover p-6">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-4">
                  {f.icon}
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────── */}
      <section id="how" className="py-20">
        <div className="container-app">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600 mb-3">The Process</p>
            <h2 className="section-head text-3xl">How it works</h2>
            <p className="section-sub mt-3 max-w-lg mx-auto">Three straightforward steps to get any task done.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {HOW_STEPS.map((s, i) => (
              <div key={s.step} className="relative">
                {/* Connector line */}
                {i < HOW_STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-6 left-[calc(50%+2rem)] right-0 h-px border-t-2 border-dashed border-slate-200" />
                )}
                <div className="surface-card p-6">
                  <div className="w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center mb-5">
                    <span className="text-white text-sm font-bold">{s.step}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link to="/signup" className="btn-primary text-sm px-7 py-3">Create Your Free Account</Link>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────── */}
      <footer id="contact" className="bg-slate-900 text-slate-400">
        <div className="container-app py-12">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="w-4 h-4 stroke-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-white font-bold text-base">HireHelper</span>
              </div>
              <p className="text-sm text-slate-500 max-w-xs leading-relaxed">
                On-demand local task assistance — connecting people who need help with skilled helpers nearby.
              </p>
            </div>

            {/* Links */}
            <div className="flex flex-col gap-2.5 text-sm">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Legal</p>
              <a href="#" className="hover:text-slate-200 transition-colors duration-150">Privacy Policy</a>
              <a href="#" className="hover:text-slate-200 transition-colors duration-150">Terms of Service</a>
              <a href="#" className="hover:text-slate-200 transition-colors duration-150">Support</a>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-slate-800 text-sm text-slate-600 text-center">
            © {new Date().getFullYear()} HireHelper. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}
