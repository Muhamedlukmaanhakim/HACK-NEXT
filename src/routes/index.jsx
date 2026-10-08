import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import AuthLayout from '../layouts/AuthLayout';
import AppLayout from '../layouts/AppLayout';

// Route Guards
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';

// Pages
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Onboarding from '../pages/Onboarding';
import Dashboard from '../pages/Dashboard';
import DiscoverStudents from '../pages/DiscoverStudents';
import DiscoverOpportunities from '../pages/DiscoverOpportunities';
import CreateOpportunity from '../pages/CreateOpportunity';
import OpportunityDetails from '../pages/OpportunityDetails';
import MatchResults from '../pages/MatchResults';
import Requests from '../pages/Requests';
import MyTeam from '../pages/MyTeam';
import TeamGapAnalysis from '../pages/TeamGapAnalysis';
import Profile from '../pages/Profile';
import Settings from '../pages/Settings';
import NotFound from '../pages/NotFound';

function AuthRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
      </Route>

      {/* Auth Pages */}
      <Route element={<AuthLayout />}>
        <Route
          path="/login"
          element={
            <AuthRoute>
              <Login />
            </AuthRoute>
          }
        />
        <Route
          path="/register"
          element={
            <AuthRoute>
              <Register />
            </AuthRoute>
          }
        />
      </Route>

      {/* Onboarding Wizard */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <Onboarding />
          </ProtectedRoute>
        }
      />

      {/* Authenticated Dashboard & Workspace */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/discover/students" element={<DiscoverStudents />} />
        <Route path="/discover/opportunities" element={<DiscoverOpportunities />} />
        <Route path="/opportunities/create" element={<CreateOpportunity />} />
        <Route path="/opportunities/:id" element={<OpportunityDetails />} />
        <Route path="/matches" element={<MatchResults />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/team" element={<MyTeam />} />
        <Route path="/team/gap-analysis" element={<TeamGapAnalysis />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
