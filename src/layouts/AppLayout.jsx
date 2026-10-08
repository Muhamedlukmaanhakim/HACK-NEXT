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
    <div className="min-h-screen bg-background text-text-primary flex flex-col lg:flex-row">
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
        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
