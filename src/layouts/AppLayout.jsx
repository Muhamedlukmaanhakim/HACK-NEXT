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

  const pendingIncomingCount = (requests || []).filter(
    (r) => r.type === 'incoming' && r.status === 'Pending'
  ).length;

  const handleResetDemo = () => {
    resetToSeedData();
    addToast({
      type: 'info',
      title: 'Demo State Reset',
      message: 'Initial student and project seed roster restored.',
    });
  };

  return (
    <div className="min-h-screen bg-canvas text-ink flex flex-col lg:flex-row">
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
      <main className="flex-1 lg:ml-64 min-h-screen flex flex-col pb-24 lg:pb-12 bg-canvas">
        {/* Top Editorial Ticker Strip */}
        <div className="hidden lg:flex items-center justify-between px-8 py-2.5 border-b-2 border-ink bg-white text-xs font-mono font-bold select-none">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-campus-green font-bold">
              <span className="w-2 h-2 bg-campus-green inline-block border border-ink" />
              CAMPUS NETWORK ACTIVE
            </span>
            <span className="text-ink/30">|</span>
            <span className="text-ink/70">STUDENT COLLABORATION SYSTEM</span>
          </div>
          <div className="flex items-center gap-4 text-ink/70">
            <span>PEOPLE → SKILLS → PROJECTS → TEAMS</span>
            <span className="text-ink/30">|</span>
            <span className="text-ink font-bold">LUKMAAN HAKIM</span>
          </div>
        </div>

        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
