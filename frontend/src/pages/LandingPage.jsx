import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F2] font-['DM_Sans'] text-[#1a1a1a]">

      {/* ── Header ── */}
      <header className="bg-white border-b border-[#e0ddd9] sticky top-0 z-50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center h-20">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center text-white font-semibold text-lg">H</div>
            <span className="font-semibold text-xl text-black tracking-tight">HireHelper</span>
          </div>

          <nav className="hidden md:flex gap-8 items-center">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-black transition-colors tracking-wide">Features</a>
            <a href="#about"    className="text-sm font-medium text-gray-600 hover:text-black transition-colors tracking-wide">About</a>
            <a href="#contact"  className="text-sm font-medium text-gray-600 hover:text-black transition-colors tracking-wide">Contact</a>
          </nav>

          <div className="flex gap-4 items-center">
            <Link
              to="/login"
              className="px-5 py-2.5 text-sm font-medium text-black bg-transparent border-[1.5px] border-[#e0ddd9] rounded-md hover:border-black hover:bg-[#f9f8f7] transition-all tracking-wide"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-5 py-2.5 text-sm font-medium text-white bg-black rounded-md hover:bg-gray-800 hover:shadow-lg transition-all tracking-wide"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-6 py-20 md:py-[120px] text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-black/5 border border-black/10 rounded-full text-xs font-medium text-gray-600 mb-8 tracking-wide">
          <span>✨ Professional Development Platform</span>
        </div>
        <h1 className="font-['Playfair_Display'] text-5xl md:text-6xl lg:text-7xl font-semibold text-black leading-tight mb-6 tracking-tight">
          Your career journey starts here
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-12">
          Experience professional development through our comprehensive virtual internship program.
          Build real-world skills with industry-standard technologies and methodologies.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            to="/signup"
            className="px-8 py-4 text-base font-medium text-white bg-black border-2 border-black rounded-lg hover:bg-gray-800 hover:shadow-xl transition-all tracking-wide"
          >
            Begin Your Journey
          </Link>
          <Link
            to="/login"
            className="px-8 py-4 text-base font-medium text-black bg-transparent border-2 border-[#e0ddd9] rounded-lg hover:border-black hover:bg-[#f9f8f7] transition-all tracking-wide"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { stat: "100%", label: "Remote Access",     desc: "Complete program accessible from anywhere" },
          { stat: "8+",   label: "Learning Modules",  desc: "Comprehensive curriculum coverage" },
          { stat: "24/7", label: "Mentor Support",    desc: "Guidance available round the clock" },
        ].map(({ stat, label, desc }) => (
          <div
            key={label}
            className="bg-white p-10 rounded-xl border border-[#e0ddd9] text-center hover:shadow-2xl hover:-translate-y-0.5 transition-all duration-300"
          >
            <div className="font-['Playfair_Display'] text-5xl font-semibold text-black mb-2">{stat}</div>
            <div className="text-lg font-semibold text-black mb-2">{label}</div>
            <div className="text-sm text-gray-600 leading-relaxed">{desc}</div>
          </div>
        ))}
      </section>

      {/* ── Features ── */}
      <section id="features" className="bg-white pt-20 pb-[120px]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="font-['Playfair_Display'] text-4xl md:text-5xl font-semibold text-black mb-4 tracking-tight">
              Program Features
            </h2>
            <p className="text-lg text-gray-600 max-w-lg mx-auto leading-relaxed">
              Everything you need to accelerate your professional development
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Feature 01 */}
            <div className="p-12 border border-[#e0ddd9] rounded-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-[#f5f4f2] border border-[#e0ddd9] rounded-lg flex items-center justify-center font-semibold text-black mb-6">
                01
              </div>
              <h3 className="text-2xl font-semibold text-black mb-4 tracking-tight">Modern Tech Stack</h3>
              <p className="text-base text-gray-600 leading-relaxed mb-6">
                Hands-on experience with React.js, Tailwind CSS, and modern development practices.
                Learn industry-standard tools and frameworks.
              </p>
              <ul className="space-y-2">
                {["React.js & React Router", "Tailwind CSS & Responsive Design", "Authentication Systems"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-black rounded-full flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Feature 02 */}
            <div className="p-12 border border-[#e0ddd9] rounded-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-12 h-12 bg-[#f5f4f2] border border-[#e0ddd9] rounded-lg flex items-center justify-center font-semibold text-black mb-6">
                02
              </div>
              <h3 className="text-2xl font-semibold text-black mb-4 tracking-tight">Professional Development</h3>
              <p className="text-base text-gray-600 leading-relaxed mb-6">
                Gain practical skills through project-based learning. Work on real-world scenarios
                that prepare you for professional environments.
              </p>
              <ul className="space-y-2">
                {["Project-Based Learning", "Code Review & Best Practices", "Professional Workflow"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-black rounded-full flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-white border-t border-[#e0ddd9] pt-10 pb-6 mt-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-black rounded-md flex items-center justify-center text-white font-semibold text-base">H</div>
              <div>
                <h3 className="text-lg font-semibold text-black mb-0.5">HireHelper</h3>
                <p className="text-xs text-gray-600">Virtual Internship Platform</p>
              </div>
            </div>
            <div className="flex gap-8 flex-wrap">
              <a href="#" className="text-sm text-gray-600 hover:text-black transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm text-gray-600 hover:text-black transition-colors">Terms of Service</a>
              <a href="#" className="text-sm text-gray-600 hover:text-black transition-colors">Contact Support</a>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-[#e0ddd9] text-sm text-gray-500">
            © {new Date().getFullYear()} HireHelper Virtual Internship. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}