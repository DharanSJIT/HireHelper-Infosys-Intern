import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <header className="bg-white border-b border-blue-100 sticky top-0 z-50">
        <div className="container-app h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">H</div>
            <span className="font-bold text-xl tracking-tight">HireHelper</span>
          </div>

          <nav className="hidden md:flex gap-8 items-center">
            <a href="#features" className="text-sm font-medium text-slate-700 hover:text-blue-700">Features</a>
            <a href="#how" className="text-sm font-medium text-slate-700 hover:text-blue-700">How It Works</a>
            <a href="#contact" className="text-sm font-medium text-slate-700 hover:text-blue-700">Contact</a>
          </nav>

          <div className="flex gap-3 items-center">
            <Link to="/login" className="btn-secondary text-sm px-4 py-2">Sign In</Link>
            <Link to="/signup" className="btn-primary text-sm px-4 py-2">Get Started</Link>
          </div>
        </div>
      </header>

      <section className="container-app py-16 md:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center px-3.5 py-1.5 rounded-full border border-blue-200 bg-blue-50 text-xs font-semibold text-blue-700 mb-6">
              Trusted local help, on demand
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-slate-900">
              Manage tasks and connect with helpers faster.
            </h1>
            <p className="mt-5 text-base md:text-lg text-slate-600 leading-relaxed max-w-xl">
              HireHelper helps you post tasks, receive requests, and get work done with confidence.
              Built for clarity, speed, and reliable coordination.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link to="/signup" className="btn-primary">Post a Task</Link>
              <Link to="/login" className="btn-secondary">Browse Tasks</Link>
            </div>
            <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
              <div className="surface-card p-3 text-center">
                <p className="text-xl font-bold text-blue-700">1000+</p>
                <p className="text-xs text-slate-500">Active Helpers</p>
              </div>
              <div className="surface-card p-3 text-center">
                <p className="text-xl font-bold text-blue-700">5000+</p>
                <p className="text-xs text-slate-500">Tasks Done</p>
              </div>
              <div className="surface-card p-3 text-center">
                <p className="text-xl font-bold text-blue-700">4.8/5</p>
                <p className="text-xs text-slate-500">User Rating</p>
              </div>
            </div>
          </div>

          <div className="surface-card p-6 md:p-7">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Platform Snapshot</h2>
            <div className="space-y-3">
              {[
                ['Task Posting', 'Create detailed tasks with location and timing.'],
                ['Request Workflow', 'Receive and manage helper requests in one place.'],
                ['Transparent Status', 'Track open, assigned, and completed tasks clearly.'],
              ].map(([title, desc]) => (
                <div key={title} className="rounded-lg border border-blue-100 p-4">
                  <p className="text-sm font-semibold text-slate-900">{title}</p>
                  <p className="text-sm text-slate-600 mt-1">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="bg-slate-50 border-y border-blue-100 py-14">
        <div className="container-app">
          <div className="text-center mb-10">
            <h2 className="section-head">Why Teams Choose HireHelper</h2>
            <p className="section-sub mt-2">A clean workflow for both task posters and helpers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Clear Task Briefs', desc: 'Every task includes title, location, schedule, and optional proof image.' },
              { title: 'Fast Requesting', desc: 'Helpers can request tasks in one click from the feed screen.' },
              { title: 'Simple Tracking', desc: 'Owners monitor progress through open, assigned, and completed states.' },
            ].map((item) => (
              <article key={item.title} className="surface-card p-6">
                <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed">{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how" className="container-app py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="surface-card p-6">
            <p className="text-xs font-semibold text-blue-700">STEP 1</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">Post your task</h3>
            <p className="mt-2 text-sm text-slate-600">Add title, description, location, and schedule. Publish in minutes.</p>
          </div>
          <div className="surface-card p-6">
            <p className="text-xs font-semibold text-blue-700">STEP 2</p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">Review requests</h3>
            <p className="mt-2 text-sm text-slate-600">Helpers send requests. You choose who to assign based on fit.</p>
          </div>
        </div>
      </section>

      <footer id="contact" className="bg-slate-50 border-t border-blue-100 py-10">
        <div className="container-app">
          <div className="flex flex-col md:flex-row justify-between items-center gap-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">H</div>
              <div>
                <h3 className="text-base font-bold text-slate-900">HireHelper</h3>
                <p className="text-xs text-slate-600">On-Demand Task Assistance</p>
              </div>
            </div>
            <div className="flex gap-6 text-sm text-slate-600">
              <a href="#" className="hover:text-blue-700">Privacy Policy</a>
              <a href="#" className="hover:text-blue-700">Terms of Service</a>
              <a href="#" className="hover:text-blue-700">Support</a>
            </div>
          </div>
          <div className="text-center mt-6 pt-6 border-t border-blue-100 text-sm text-slate-500">
            © {new Date().getFullYear()} HireHelper. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
