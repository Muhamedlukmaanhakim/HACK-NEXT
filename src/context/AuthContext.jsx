import React, { createContext, useContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isSupabaseConfigured() && supabase) {
      // 1. Restore initial Supabase session on mount
      supabase.auth.getSession().then(async ({ data: { session }, error }) => {
        if (!error && session?.user) {
          const profile = await authService.fetchSupabaseProfile(session.user.id);
          if (profile) {
            setUser(profile);
          }
        }
      }).catch((e) => {
        console.warn('[CollabMatrix] Supabase getSession error:', e.message);
      });

      // 2. Subscribe to auth state changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_OUT') {
          const current = authService.getCurrentUser();
          if (current && !current.isDemo) {
            setUser(null);
          }
        } else if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          if (session?.user) {
            const profile = await authService.fetchSupabaseProfile(session.user.id);
            if (profile) {
              setUser(profile);
            }
          }
        }
      });

      return () => {
        subscription?.unsubscribe();
      };
    }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const loggedUser = await authService.login(email, password);
      setUser(loggedUser);
      return loggedUser;
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemo = async () => {
    setLoading(true);
    try {
      const demoUser = await authService.loginAsDemoUser();
      setUser(demoUser);
      return demoUser;
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemoFaculty = async () => {
    setLoading(true);
    try {
      const demoFaculty = await authService.loginAsDemoFaculty();
      setUser(demoFaculty);
      return demoFaculty;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const gUser = await authService.loginWithGoogle();
      setUser(gUser);
      return gUser;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const newUser = await authService.register(userData);
      setUser(newUser);
      return newUser;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  const updateProfile = async (updates) => {
    const updated = await authService.updateProfile(updates);
    setUser(updated);
    return updated;
  };

  const completeOnboarding = async (profileData) => {
    const updated = await authService.updateProfile({
      ...profileData,
      hasCompletedOnboarding: true,
    });
    setUser(updated);
    return updated;
  };

  const isFaculty = user?.role === 'faculty';
  const isStudent = Boolean(user && user.role !== 'faculty');

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isFaculty,
        isStudent,
        loading,
        login,
        loginAsDemo,
        loginAsDemoFaculty,
        loginWithGoogle,
        register,
        logout,
        updateProfile,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
