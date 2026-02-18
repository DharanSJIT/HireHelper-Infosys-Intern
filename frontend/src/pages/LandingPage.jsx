import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* ── Header ── */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center h-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">H</div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">HireHelper</span>
          </div>

          <nav className="hidden md:flex gap-10 items-center">
            <a href="#features" className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">Features</a>
            <a href="#about"    className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">About</a>
            <a href="#contact"  className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors">Contact</a>
          </nav>

          <div className="flex gap-4 items-center">
            <Link
              to="/login"
              className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:border-gray-900 hover:text-gray-900 transition-all"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="px-6 py-2.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-sm"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-xs font-semibold text-blue-700 mb-8">
            <span>✨ On-Demand Task Assistance Platform</span>
          </div>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-8 tracking-tight">
            Get help with tasks,<br/>anytime, anywhere
          </h1>
          <p className="text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto mb-12">
            Connect with skilled helpers in your area for everyday tasks. From moving furniture to home repairs,
            find trusted assistance when you need it most.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              to="/signup"
              className="px-8 py-4 text-base font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-sm"
            >
              Post a Task
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 text-base font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:border-gray-900 hover:text-gray-900 transition-all"
            >
              Find Tasks
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { stat: "1000+", label: "Active Helpers",     desc: "Skilled professionals ready to assist" },
            { stat: "5000+",   label: "Tasks Completed",  desc: "Successfully finished projects" },
            { stat: "4.8/5", label: "Average Rating",    desc: "Trusted by our community" },
          ].map(({ stat, label, desc }) => (
            <div
              key={label}
              className="bg-white p-10 rounded-xl border border-gray-200 text-center hover:border-blue-600 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-5xl font-bold text-blue-600 mb-3">{stat}</div>
              <div className="text-lg font-semibold text-gray-900 mb-2">{label}</div>
              <div className="text-sm text-gray-600 leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Simple steps to get your tasks done or start earning as a helper
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Feature 01 */}
            <div className="p-10 border-2 border-gray-200 rounded-xl hover:border-blue-600 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-lg mb-6">
                01
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Post Your Task</h3>
              <p className="text-base text-gray-600 leading-relaxed mb-6">
                Describe what you need help with, set your budget, and choose your preferred time.
                Our platform makes it easy to find the right helper for any job.
              </p>
              <ul className="space-y-3">
                {["Create detailed task descriptions", "Set your own budget and timeline", "Browse helper profiles and reviews"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Feature 02 */}
            <div className="p-10 border-2 border-gray-200 rounded-xl hover:border-blue-600 hover:shadow-lg transition-all duration-300">
              <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-lg mb-6">
                02
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Find & Complete Tasks</h3>
              <p className="text-base text-gray-600 leading-relaxed mb-6">
                Browse available tasks in your area, send requests, and start earning.
                Build your reputation and grow your helper business.
              </p>
              <ul className="space-y-3">
                {["Browse tasks that match your skills", "Send requests and get hired", "Earn money on your schedule"].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-700 font-medium">
                    <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-gray-50 border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">H</div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">HireHelper</h3>
                <p className="text-xs text-gray-600">On-Demand Task Assistance</p>
              </div>
            </div>
            <div className="flex gap-8 flex-wrap">
              <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Privacy Policy</a>
              <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Terms of Service</a>
              <a href="#" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Contact Support</a>
            </div>
          </div>
          <div className="text-center pt-8 border-t border-gray-200 text-sm text-gray-500">
            © {new Date().getFullYear()} HireHelper. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
}