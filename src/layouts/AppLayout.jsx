import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import MobileNavigation from '../components/layout/MobileNavigation';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';

export default function AppLayout() {
  const { user } = useAuth();
  const { requests, resetToSeedData } = useAppData();
  const { addToast } = useToast();

  // Pending incoming requests count
  const pendingIncomingCount = (requests || []).filter(
    (r) => r.type === 'incoming' && r.status === 'Pending'
  ).length;

  const handleResetDemo = () => {
    resetToSeedData();
    addToast({
      type: 'info',
      title: 'Demo Reset',
      message: 'All application data and state have been restored to initial seed values.',
    });
  };

  return (
    <div className="min-h-screen bg-retro-bg text-retro-paper flex flex-col lg:flex-row bg-retro-grid">
      {/* Desktop Sidebar */}
      <Sidebar
        user={user}
        pendingRequestCount={pendingIncomingCount}
        onResetDemo={handleResetDemo}
        className="hidden lg:flex fixed top-0 bottom-0 left-0"
      />

      {/* Mobile Top Navigation & Bottom Tab Bar */}
      <MobileNavigation
        user={user}
        pendingRequestCount={pendingIncomingCount}
        onResetDemo={handleResetDemo}
      />

      {/* Main Content Area */}
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col pb-20 lg:pb-8">
        {/* Top Telemetry Status Strip */}
        <div className="hidden lg:flex items-center justify-between px-8 py-2 border-b border-retro-border/60 bg-retro-surface/60 text-[10px] font-mono text-retro-muted select-none">
          <div className="flex items-center gap-4">
            <span className="text-retro-amber font-semibold">● TELEMETRY // ONLINE</span>
            <span className="opacity-40">|</span>
            <span>GRID: CAMPUS-ALPHA // TERMINAL #01</span>
          </div>
          <div className="flex items-center gap-4">
            <span>SYNC FREQ: 1420 MHZ</span>
            <span className="opacity-40">|</span>
            <span className="text-retro-paper/70">SESSION: ACTIVE</span>
          </div>
        </div>

        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
