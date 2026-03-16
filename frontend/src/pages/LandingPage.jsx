import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const NAV_LINKS = [
  { href: '#features',     label: 'Features' },
  { href: '#how',          label: 'How It Works' },
  { href: '#testimonials', label: 'Testimonials' },
  { href: '#contact',      label: 'Contact' },
];

const FEATURES = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" className="w-6 h-6 stroke-blue-600">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    number: '01',
    title: 'Clear Task Briefs',
    desc: 'Every task includes title, location, schedule, and an optional proof image — so helpers understand exactly what is needed.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" className="w-6 h-6 stroke-blue-600">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    number: '02',
    title: 'Instant Requesting',
    desc: 'Helpers can send a request to any open task in one click from the live feed, with no friction or extra steps.',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" className="w-6 h-6 stroke-blue-600">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    number: '03',
    title: 'Transparent Status',
    desc: 'Track every task through open, assigned, and completed states with a clear, real-time dashboard view.',
  },
];

const HOW_STEPS = [
  {
    step: '01',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="w-6 h-6 stroke-white">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
    title: 'Post Your Task',
    desc: 'Describe the work, set a location and schedule, and publish in minutes. Add a photo to help helpers understand the scope.',
  },
  {
    step: '02',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="w-6 h-6 stroke-white">
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Review Requests',
    desc: 'Skilled helpers browse your task and send requests. Review profiles and choose who to assign.',
  },
  {
    step: '03',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="w-6 h-6 stroke-white">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Get It Done',
    desc: 'Track progress in real time and mark tasks complete when the job is finished. Simple, fast, reliable.',
  },
];

const STATS = [
  { value: '1,000+', label: 'Active Helpers' },
  { value: '5,000+', label: 'Tasks Completed' },
  { value: '4.8★',   label: 'Average Rating' },
  { value: '98%',    label: 'Satisfaction Rate' },
];

const TESTIMONIALS = [
  {
    name: 'Sarah M.',
    role: 'Task Owner',
    text: 'HireHelper made finding help for my home move so effortless. Within an hour I had a skilled helper confirmed. The whole process was transparent and stress-free.',
    avatar: 'SM',
  },
  {
    name: 'James K.',
    role: 'Helper',
    text: 'I love how straightforward the platform is. I get clear task details upfront, so I always know exactly what to expect. Great for flexible part-time work.',
    avatar: 'JK',
  },
  {
    name: 'Priya L.',
    role: 'Task Owner',
    text: "The dashboard makes it trivially easy to track my tasks. Real-time updates mean I'm never left wondering. Highly recommend to anyone who needs reliable local help.",
    avatar: 'PL',
  },
];

const LIVE_TASKS = [
  { title: 'Help move a sofa',         category: 'Moving',  status: 'open',     time: 'Today, 3:00 PM',     loc: 'Dublin 2' },
  { title: 'Apartment deep clean',      category: 'Cleaning',status: 'assigned', time: 'Tomorrow, 10:00 AM', loc: 'Dublin 4' },
  { title: 'IKEA furniture assembly',   category: 'General', status: 'open',     time: 'Feb 25, 9:00 AM',    loc: 'Dublin 8' },
];

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-900 overflow-x-hidden">

      {/* ── Sticky Header ─────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-50 bg-white transition-shadow duration-200 ${
          scrolled ? 'border-b border-slate-200 shadow-sm' : 'border-b border-transparent'
        }`}
      >
        <div className="container-app h-[68px] flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center" style={{ boxShadow: 'var(--shadow-sm)' }}>
              <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="w-5 h-5 stroke-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="font-extrabold text-[18px] text-slate-900 tracking-tight">HireHelper</span>
          </div>

          {/* Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors duration-150 relative group"
              >
                {label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-blue-600 rounded-full transition-all duration-200 group-hover:w-full" />
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-2.5">
            <Link to="/login"  className="btn-secondary text-sm px-4 py-2">Sign In</Link>
            <Link to="/signup" className="btn-primary  text-sm px-4 py-2">Get Started →</Link>
          </div>
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="relative bg-white border-b border-slate-200 overflow-hidden">
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 hero-dots opacity-50 pointer-events-none" />

        <div className="relative container-app py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

            {/* Left: Copy */}
            <div className="page-enter">
              {/* Live badge */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-xs font-semibold text-blue-700 mb-7">
                <span className="live-dot" />
                1,000+ helpers active now
              </div>

              <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight text-slate-900">
                Post tasks.<br />
                <span className="text-blue-600">Find helpers.</span><br />
                Get things done.
              </h1>

              <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-lg">
                HireHelper connects task owners with skilled local helpers — with a clean workflow built for speed, transparency, and reliable coordination.
              </p>

              <div className="mt-9 flex flex-col sm:flex-row gap-3">
                <Link to="/signup" className="btn-primary  text-[15px] px-7 py-3.5">Post a Task Free</Link>
                <Link to="/login"  className="btn-secondary text-[15px] px-7 py-3.5">Browse Tasks →</Link>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 pt-10 border-t border-slate-100">
                {STATS.map(({ value, label }) => (
                  <div key={label}>
                    <p className="text-2xl font-extrabold text-slate-900 stat-number">{value}</p>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Platform Preview */}
            <div className="animate-fade-scale">
              <div className="surface-card p-1.5">
                {/* Mock browser chrome */}
                <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 rounded-t-xl flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                  </div>
                  <div className="flex-1 mx-3">
                    <div className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 flex items-center gap-2">
                      <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" className="w-3 h-3 stroke-slate-400 flex-shrink-0">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <span className="text-[10px] text-slate-400 font-medium">app.hirehelper.io/dashboard</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  {/* Row header */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Live Feed</p>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5">Task Dashboard</h3>
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-bold">
                      <span className="live-dot" style={{ width: 6, height: 6 }} />
                      3 Open
                    </span>
                  </div>

                  {LIVE_TASKS.map((task) => (
                    <div
                      key={task.title}
                      className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-blue-200 hover:bg-blue-50/40 transition-all duration-150 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex-shrink-0 flex items-center justify-center">
                          <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.75" className="w-4 h-4 stroke-blue-600">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                          </svg>
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 truncate">{task.title}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{task.loc} · {task.time}</p>
                        </div>
                      </div>
                      <span className={`flex-shrink-0 ml-3 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                        task.status === 'open'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                  ))}

                  <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <span className="live-dot" style={{ width: 5, height: 5 }} />
                      Updating live
                    </span>
                    <span className="text-blue-600 font-semibold cursor-pointer hover:text-blue-700">View all →</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── Trust bar ─────────────────────────────────────────── */}
      <div className="bg-slate-50 border-b border-slate-200 py-5">
        <div className="container-app">
          <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400 text-center mb-4">
            Trusted by helpers across Ireland
          </p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {['Dublin', 'Cork', 'Galway', 'Limerick', 'Waterford', 'Belfast'].map((city) => (
              <span key={city} className="text-sm font-bold text-slate-400">{city}</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── Features ──────────────────────────────────────────── */}
      <section id="features" className="py-24 bg-white">
        <div className="container-app">
          <div className="text-center mb-16">
            <span className="pill-tag mb-4">Why HireHelper</span>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              Built for clarity and speed
            </h2>
            <p className="mt-4 text-slate-500 max-w-lg mx-auto leading-relaxed">
              A clean, focused workflow for both task owners and helpers. No unnecessary complexity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <article
                key={f.title}
                className="relative overflow-hidden surface-card-hover p-7"
              >
                <span className="feature-number">{f.number}</span>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mb-5">
                  {f.icon}
                </div>
                <h3 className="text-[17px] font-bold text-slate-900 mb-3">{f.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{f.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────── */}
      <section id="how" className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="container-app">
          <div className="text-center mb-16">
            <span className="pill-tag mb-4">The Process</span>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              Three steps to get it done
            </h2>
            <p className="mt-4 text-slate-500 max-w-lg mx-auto leading-relaxed">
              From posting to completion — HireHelper makes the whole process fast and simple.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {HOW_STEPS.map((s, i) => (
              <div key={s.step} className="relative">
                {i < HOW_STEPS.length - 1 && (
                  <div className="connector-line hidden md:block" />
                )}
                <div className="surface-card card-lift p-7 h-full">
                  <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center mb-5" style={{ boxShadow: 'var(--shadow-sm)' }}>
                    {s.icon}
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Step {s.step}</p>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link to="/signup" className="btn-primary text-[15px] px-8 py-3.5">
              Start for Free — No Credit Card
            </Link>
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────── */}
      <section id="testimonials" className="py-24 bg-white">
        <div className="container-app">
          <div className="text-center mb-16">
            <span className="pill-tag mb-4">Testimonials</span>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
              Loved by owners and helpers
            </h2>
            <p className="mt-4 text-slate-500 max-w-lg mx-auto leading-relaxed">
              Real stories from real people using HireHelper every day.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="surface-card card-lift p-7 flex flex-col gap-4">
                {/* Stars */}
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-amber-400">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>

                <p className="text-slate-700 text-sm leading-relaxed flex-1">"{t.text}"</p>

                <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                  <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────── */}
      <section className="bg-blue-600 py-20">
        <div className="container-app text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-5">
            Ready to get help?
          </h2>
          <p className="text-blue-200 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Join thousands of people who use HireHelper to get things done. Sign up free — no commitment required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-white text-blue-700 text-[15px] font-bold hover:bg-blue-50 transition-colors duration-150 cursor-pointer"
              style={{ boxShadow: 'var(--shadow-md)' }}
            >
              Post Your First Task Free
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border-2 border-white/40 text-white text-[15px] font-semibold hover:border-white/70 hover:bg-blue-500 transition-all duration-150 cursor-pointer"
            >
              Sign In to Browse Tasks →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer id="contact" className="bg-slate-900 text-slate-400">
        <div className="container-app py-14">
          <div className="flex flex-col md:flex-row justify-between items-start gap-10">

            {/* Brand */}
            <div className="max-w-xs">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" strokeWidth="2" className="w-4 h-4 stroke-white">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <span className="text-white font-extrabold text-[17px] tracking-tight">HireHelper</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                On-demand local task assistance — connecting people who need help with skilled helpers nearby.
              </p>
              <div className="flex gap-5 mt-5">
                <div>
                  <p className="text-white font-bold text-sm">1,000+</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">Helpers</p>
                </div>
                <div className="w-px bg-slate-800" />
                <div>
                  <p className="text-white font-bold text-sm">5,000+</p>
                  <p className="text-[11px] text-slate-600 mt-0.5">Tasks Done</p>
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-col md:flex-row gap-10">
              <div className="flex flex-col gap-3 text-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1">Platform</p>
                <a href="#features"     className="hover:text-slate-200 transition-colors duration-150">Features</a>
                <a href="#how"          className="hover:text-slate-200 transition-colors duration-150">How It Works</a>
                <a href="#testimonials" className="hover:text-slate-200 transition-colors duration-150">Testimonials</a>
              </div>
              <div className="flex flex-col gap-3 text-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600 mb-1">Legal</p>
                <a href="#" className="hover:text-slate-200 transition-colors duration-150">Privacy Policy</a>
                <a href="#" className="hover:text-slate-200 transition-colors duration-150">Terms of Service</a>
                <a href="#" className="hover:text-slate-200 transition-colors duration-150">Support</a>
              </div>
            </div>
          </div>

          <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-600">
            <span>© {new Date().getFullYear()} HireHelper. All rights reserved.</span>
            <span>Made with ♥ for helpers everywhere</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
