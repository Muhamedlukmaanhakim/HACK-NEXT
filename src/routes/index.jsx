import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from '../layouts/PublicLayout';
import AuthLayout from '../layouts/AuthLayout';
import AppLayout from '../layouts/AppLayout';

// Route Guards
import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../context/AuthContext';

// Common & Auth Pages
import Landing from '../pages/Landing';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Onboarding from '../pages/Onboarding';
import FacultyOnboarding from '../pages/FacultyOnboarding';
import Settings from '../pages/Settings';
import NotFound from '../pages/NotFound';

// Student Pages
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

// Priority Feature Pages (Student Workspace)
import TrialSprint from '../pages/TrialSprint';
import ContributionLedger from '../pages/ContributionLedger';
import TeamHealthRadar from '../pages/TeamHealthRadar';
import WhatIfSimulator from '../pages/WhatIfSimulator';
import TeamAgreement from '../pages/TeamAgreement';
import SkillEvidence from '../pages/SkillEvidence';
import ProjectPassport from '../pages/ProjectPassport';

// Faculty Pages
import FacultyDashboard from '../pages/FacultyDashboard';
import FacultyOpportunities from '../pages/FacultyOpportunities';
import FacultyCreateOpportunity from '../pages/FacultyCreateOpportunity';
import FacultySupervision from '../pages/FacultySupervision';
import FacultyTrialSprintOversight from '../pages/FacultyTrialSprintOversight';
import FacultyContributionReviews from '../pages/FacultyContributionReviews';
import FacultyEvidenceReviews from '../pages/FacultyEvidenceReviews';
import FacultyHealthRadar from '../pages/FacultyHealthRadar';
import FacultyStudents from '../pages/FacultyStudents';
import FacultyMentoring from '../pages/FacultyMentoring';
import FacultyProfile from '../pages/FacultyProfile';

function AuthRoute({ children }) {
  const { isAuthenticated, isFaculty } = useAuth();
  if (isAuthenticated) {
    return <Navigate to={isFaculty ? "/faculty/dashboard" : "/dashboard"} replace />;
  }
  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* 1. Public Pages */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Landing />} />
      </Route>

      {/* 2. Authentication Pages */}
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

      {/* 3. Onboarding Wizards (Role Protected) */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <Onboarding />
          </ProtectedRoute>
        }
      />
      <Route
        path="/onboarding/faculty"
        element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <FacultyOnboarding />
          </ProtectedRoute>
        }
      />

      {/* 4. Student-Only Workspace (Strictly Restricted to 'student') */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/discover/students" element={<DiscoverStudents />} />
        <Route path="/discover/opportunities" element={<DiscoverOpportunities />} />
        <Route path="/opportunities/create" element={<CreateOpportunity />} />
        <Route path="/matches" element={<MatchResults />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/team" element={<MyTeam />} />
        <Route path="/team/gap-analysis" element={<TeamGapAnalysis />} />

        {/* Priority Features 1, 2, 3 & Adaptive Tools */}
        <Route path="/team/trial-sprint" element={<TrialSprint />} />
        <Route path="/team/contributions" element={<ContributionLedger />} />
        <Route path="/team/health" element={<TeamHealthRadar />} />
        <Route path="/team/simulator" element={<WhatIfSimulator />} />
        <Route path="/team/agreement" element={<TeamAgreement />} />
        <Route path="/skills/evidence" element={<SkillEvidence />} />
        <Route path="/passport" element={<ProjectPassport />} />

        {/* Student Profile */}
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* 5. Faculty-Only Workspace (Strictly Restricted to 'faculty') */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['faculty']}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/faculty" element={<Navigate to="/faculty/dashboard" replace />} />
        <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
        <Route path="/faculty/opportunities" element={<FacultyOpportunities />} />
        <Route path="/faculty/opportunities/create" element={<FacultyCreateOpportunity />} />
        <Route path="/faculty/supervision" element={<FacultySupervision />} />
        <Route path="/faculty/trial-sprints" element={<FacultyTrialSprintOversight />} />
        <Route path="/faculty/reviews/contributions" element={<FacultyContributionReviews />} />
        <Route path="/faculty/reviews/evidence" element={<FacultyEvidenceReviews />} />
        <Route path="/faculty/health-radar" element={<FacultyHealthRadar />} />
        <Route path="/faculty/students" element={<FacultyStudents />} />
        <Route path="/faculty/mentoring" element={<FacultyMentoring />} />
        <Route path="/faculty/profile" element={<FacultyProfile />} />
        <Route path="/faculty/settings" element={<Settings />} />
      </Route>

      {/* 6. Shared Authenticated Workspace (Available to both 'student' and 'faculty') */}
      <Route
        element={
          <ProtectedRoute allowedRoles={['student', 'faculty']}>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/settings" element={<Settings />} />
        <Route path="/opportunities/:id" element={<OpportunityDetails />} />
      </Route>

      {/* 7. 404 Catch-All */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
