import React from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoadingState from '../components/ui/LoadingState';
import Button from '../components/ui/Button';

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <LoadingState message="VERIFYING CAMPUS SESSION..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect unauthenticated users to /login and preserve destination
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If user hasn't completed onboarding and isn't already on an onboarding route
  const isOnboardingRoute = location.pathname.startsWith('/onboarding');
  if (user && !user.hasCompletedOnboarding && !isOnboardingRoute) {
    const onboardingTarget = user.role === 'faculty' ? '/onboarding/faculty' : '/onboarding';
    return <Navigate to={onboardingTarget} replace />;
  }

  // Role Authorization Check
  if (allowedRoles && allowedRoles.length > 0 && user) {
    const userRole = user.role || 'student';
    if (!allowedRoles.includes(userRole)) {
      const authorizedDashboard = userRole === 'faculty' ? '/faculty/dashboard' : '/dashboard';
      return (
        <div className="min-h-screen bg-canvas flex items-center justify-center p-4 font-mono select-none">
          <div className="max-w-md w-full bg-white border-3 border-ink shadow-brutal-xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center justify-between border-b-2 border-ink pb-3 text-xs font-bold">
              <span className="text-brutal-red uppercase">403 // ACCESS FORBIDDEN</span>
              <span className="bg-canvas border border-ink px-2 py-0.5 text-ink">NODE RESTRICTED</span>
            </div>

            <div className="w-12 h-12 bg-brutal-red/10 border-2 border-brutal-red flex items-center justify-center shadow-brutal-sm">
              <ShieldAlert className="w-7 h-7 text-brutal-red stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-display font-black text-ink uppercase">
                CLEARANCE MISMATCH
              </h2>
              <p className="text-xs font-sans text-ink/80 leading-relaxed font-normal">
                This workspace requires <strong>{allowedRoles.join(' / ').toUpperCase()}</strong> clearance. Your active session is registered as a <strong>{userRole.toUpperCase()} NODE</strong>.
              </p>
            </div>

            <div className="pt-2 border-t-2 border-ink">
              <Button
                variant="primary"
                size="md"
                className="w-full text-xs font-bold uppercase tracking-wider"
                icon={ArrowRight}
                iconPosition="right"
                onClick={() => navigate(authorizedDashboard)}
              >
                [ RETURN TO {userRole.toUpperCase()} WORKSPACE → ]
              </Button>
            </div>
          </div>
        </div>
      );
    }
  }

  return children;
}
