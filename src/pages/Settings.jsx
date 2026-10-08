import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Bell,
  Shield,
  Palette,
  RotateCcw,
  LogOut,
  Save,
  Check,
} from 'lucide-react';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Toggle from '../components/ui/Toggle';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import { DEPARTMENTS, YEARS } from '../services/taxonomyService';

export default function Settings() {
  const { user, updateProfile, logout } = useAuth();
  const { resetToSeedData } = useAppData();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('account');

  const [settings, setSettings] = useState({
    name: user?.name || 'Lukmaan Hakim',
    email: user?.email || 'lukmaan.hakim@campus.edu',
    department: user?.department || 'Computer Science (CSE)',
    year: user?.year || '2nd Year',
    emailNotifications: true,
    requestAlerts: true,
    weeklyMatches: true,
    publicProfile: true,
    showAvailability: true,
  });

  const handleSave = async (e) => {
    e.preventDefault();
    await updateProfile({
      name: settings.name,
      department: settings.department,
      year: settings.year,
    });
    addToast({
      type: 'success',
      title: 'Preferences Saved',
      message: 'Your settings have been updated.',
    });
  };

  const handleResetDemo = () => {
    resetToSeedData();
    addToast({
      type: 'info',
      title: 'Demo State Reset',
      message: 'All application data, teams, and requests restored to initial seed state.',
    });
  };

  const handleLogout = async () => {
    await logout();
    addToast({
      type: 'info',
      title: 'Signed Out',
      message: 'You have been signed out of CollabMatrix.',
    });
    navigate('/login');
  };

  return (
    <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
          Platform Settings
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Manage your account credentials, notifications, privacy, and prototype state.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar (4 cols) */}
        <div className="md:col-span-4 p-3 rounded-2xl bg-surface border border-surface-border space-y-1">
          {[
            { id: 'account', label: 'Account & Profile', icon: User },
            { id: 'notifications', label: 'Notifications', icon: Bell },
            { id: 'privacy', label: 'Privacy & Visibility', icon: Shield },
            { id: 'appearance', label: 'Theme & Appearance', icon: Palette },
            { id: 'demo', label: 'Demo Controls', icon: RotateCcw },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                activeSection === item.id
                  ? 'bg-accent-indigo text-white shadow-sm'
                  : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          ))}

          <div className="pt-3 border-t border-surface-border/60">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-medium text-status-danger hover:bg-status-danger/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>

        {/* Setting Panel Content (8 cols) */}
        <div className="md:col-span-8 p-6 rounded-2xl bg-surface border border-surface-border space-y-6">
          {/* Account & Profile */}
          {activeSection === 'account' && (
            <form onSubmit={handleSave} className="space-y-5">
              <h3 className="text-base font-semibold text-text-primary">
                Account Credentials
              </h3>

              <Input
                label="Full Name"
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              />

              <Input
                label="College Email"
                value={settings.email}
                disabled
                helperText="Email is bound to your verified campus domain."
              />

              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="Department"
                  value={settings.department}
                  onChange={(e) => setSettings({ ...settings, department: e.target.value })}
                  options={DEPARTMENTS}
                />
                <Select
                  label="Year"
                  value={settings.year}
                  onChange={(e) => setSettings({ ...settings, year: e.target.value })}
                  options={YEARS}
                />
              </div>

              <div className="pt-4 border-t border-surface-border flex justify-end">
                <Button type="submit" variant="primary" size="sm" icon={Save}>
                  Save Changes
                </Button>
              </div>
            </form>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <div className="space-y-5">
              <h3 className="text-base font-semibold text-text-primary">
                Notification Preferences
              </h3>

              <div className="space-y-4">
                <Toggle
                  label="Collaboration Request Alerts"
                  description="Receive instant alerts when a peer requests to join your project."
                  checked={settings.requestAlerts}
                  onChange={(v) => setSettings({ ...settings, requestAlerts: v })}
                />
                <Toggle
                  label="Weekly Compatibility Digest"
                  description="Get a weekly summary of new campus projects seeking your skill stack."
                  checked={settings.weeklyMatches}
                  onChange={(v) => setSettings({ ...settings, weeklyMatches: v })}
                />
                <Toggle
                  label="Email Notifications"
                  description="Forward collaboration notifications to your verified college inbox."
                  checked={settings.emailNotifications}
                  onChange={(v) => setSettings({ ...settings, emailNotifications: v })}
                />
              </div>
            </div>
          )}

          {/* Privacy */}
          {activeSection === 'privacy' && (
            <div className="space-y-5">
              <h3 className="text-base font-semibold text-text-primary">
                Privacy & Discoverability
              </h3>

              <div className="space-y-4">
                <Toggle
                  label="Public Campus Profile"
                  description="Allow other students to find you in the Discover Students directory."
                  checked={settings.publicProfile}
                  onChange={(v) => setSettings({ ...settings, publicProfile: v })}
                />
                <Toggle
                  label="Show Availability Hours"
                  description="Display your weekday/weekend availability on your project badge."
                  checked={settings.showAvailability}
                  onChange={(v) => setSettings({ ...settings, showAvailability: v })}
                />
              </div>
            </div>
          )}

          {/* Appearance */}
          {activeSection === 'appearance' && (
            <div className="space-y-5">
              <h3 className="text-base font-semibold text-text-primary">
                Appearance & Theme
              </h3>

              <div className="space-y-3">
                <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">
                  Interface Theme
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-xl bg-surface-elevated border-2 border-accent-indigo flex items-center justify-between cursor-pointer">
                    <span className="text-xs font-bold text-text-primary">Dark Premium SaaS</span>
                    <Check className="w-4 h-4 text-accent-indigo" />
                  </div>
                  <div className="p-4 rounded-xl bg-surface-elevated/40 border border-surface-border opacity-50 flex items-center justify-between cursor-not-allowed">
                    <span className="text-xs font-medium text-text-muted">Light Mode (Coming Soon)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Demo Controls */}
          {activeSection === 'demo' && (
            <div className="space-y-5">
              <h3 className="text-base font-semibold text-text-primary">
                Demo & Prototype Diagnostics
              </h3>

              <p className="text-xs text-text-secondary leading-relaxed">
                Resetting the demo restores all seed students, requests, teams, and initial state back to the exact initial demo storyline (§6).
              </p>

              <div className="p-4 rounded-xl bg-accent-indigo/10 border border-accent-indigo/25 flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-semibold text-text-primary">Reset Demo Seed Data</h4>
                  <p className="text-[11px] text-text-muted">Clears local storage modifications and restores Lukmaan&apos;s team.</p>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  icon={RotateCcw}
                  onClick={handleResetDemo}
                >
                  Reset Demo
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
