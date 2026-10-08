import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-retro-bg text-retro-paper selection:bg-retro-orange selection:text-retro-bg bg-retro-grid">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t border-retro-border bg-retro-surface/80 py-8 px-4 text-xs font-mono text-retro-muted select-none">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <span className="font-display font-bold text-retro-paper tracking-wider">COLLABMATRIX</span>
            <span className="hidden sm:inline text-retro-muted/50">//</span>
            <span>A HIGH-PRECISION STUDENT COLLABORATION GRID</span>
          </div>
          <p className="text-[11px] text-retro-muted">
            [ ARCHITECTURE REV-4 // FRONTEND PROTOTYPE // ZERO MOCK-AI MISREPRESENTATION ]
          </p>
        </div>
      </footer>
    </div>
  );
}
