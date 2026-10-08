import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary selection:bg-accent-indigo selection:text-white">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-surface-border bg-surface/40 py-8 px-4 text-center text-xs text-text-muted">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-text-primary">CollabMatrix</span>
            <span>— Find the right people. Build the right team.</span>
          </div>
          <p className="text-text-muted">
            Frontend MVP Prototype • Designed for Student Collaboration
          </p>
        </div>
      </footer>
    </div>
  );
}
