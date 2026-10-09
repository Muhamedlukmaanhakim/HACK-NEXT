import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-ink selection:bg-signal-yellow selection:text-ink">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="border-t-2 border-ink bg-white py-6 px-4 text-xs font-mono text-ink select-none">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <span className="font-display font-extrabold text-ink tracking-tight uppercase">
              COLLAB / MATRIX
            </span>
            <span className="hidden sm:inline text-ink/40">//</span>
            <span className="text-ink/80 text-[11px] font-bold">
              CAMPUS COLLABORATION NETWORK · EDITORIAL SPECIFICATION
            </span>
          </div>
          <p className="text-[10px] text-ink/70 font-mono">
            [ CAMPUS DIRECTORY // 01 · BOLD · TACTILE · HUMAN ]
          </p>
        </div>
      </footer>
    </div>
  );
}
