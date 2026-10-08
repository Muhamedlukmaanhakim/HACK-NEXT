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
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-4xl mx-auto font-mono">
      <div className="border-b border-retro-border pb-4">
        <div className="text-[10px] text-retro-muted uppercase tracking-widest mb-1">
          [ CONFIG // STATION_PREFERENCES ]
        </div>
        <h1 className="text-xl sm:text-2xl font-display font-bold text-retro-paper tracking-wide uppercase">
          Platform Configuration
        </h1>
        <p className="text-xs text-retro-muted font-sans mt-0.5">
          Manage credentials, telemetry notifications, discoverability parameters, and prototype state.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar (4 cols) */}
        <div className="md:col-span-4 p-2 rounded-none bg-retro-surface border border-retro-border space-y-1 shadow-panel">
          {[
            { id: 'account', label: '01. Account Dossier', icon: User },
            { id: 'notifications', label: '02. Notifications', icon: Bell },
            { id: 'privacy', label: '03. Visibility Grid', icon: Shield },
            { id: 'appearance', label: '04. Theme Aesthetic', icon: Palette },
            { id: 'demo', label: '05. Demo Controls', icon: RotateCcw },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-mono transition-all border ${
                activeSection === item.id
                  ? 'bg-retro-surface-elevated border-retro-orange text-retro-paper font-bold shadow-panel'
                  : 'border-transparent text-retro-paper/70 hover:text-retro-paper hover:bg-retro-surface-hover'
              }`}
            >
              <item.icon className="w-3.5 h-3.5 text-retro-amber flex-shrink-0" />
              <span className="truncate">{item.label}</span>
            </button>
          ))}

          <div className="pt-2 border-t border-retro-border/60">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-mono text-retro-red hover:bg-retro-red/10 transition-colors uppercase"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>[ LOG OUT ]</span>
            </button>
          </div>
        </div>

        {/* Setting Panel Content (8 cols) */}
        <div className="md:col-span-8 p-5 sm:p-6 rounded-none bg-retro-surface border border-retro-border space-y-6 shadow-panel">
          {/* Account & Profile */}
          {activeSection === 'account' && (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="text-[10px] text-retro-muted uppercase tracking-widest">// OPERATOR CREDENTIALS:</div>
              <h3 className="text-sm font-bold text-retro-paper uppercase">
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
                helperText="Email is bound to verified campus node."
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

              <div className="pt-4 border-t border-retro-border flex justify-end">
                <Button type="submit" variant="primary" size="sm" icon={Save}>
                  Save Changes
                </Button>
              </div>
            </form>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <div className="space-y-4">
              <div className="text-[10px] text-retro-muted uppercase tracking-widest">// TELEMETRY ALERTS:</div>
              <h3 className="text-sm font-bold text-retro-paper uppercase">
                Notification Preferences
              </h3>

              <div className="space-y-3 pt-1">
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
            <div className="space-y-4">
              <div className="text-[10px] text-retro-muted uppercase tracking-widest">// NODE DISCOVERABILITY:</div>
              <h3 className="text-sm font-bold text-retro-paper uppercase">
                Privacy & Visibility
              </h3>

              <div className="space-y-3 pt-1">
                <Toggle
                  label="Public Campus Profile"
                  description="Allow other students to locate your dossier in the candidate directory."
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
            <div className="space-y-4">
              <div className="text-[10px] text-retro-muted uppercase tracking-widest">// SYSTEM AESTHETIC:</div>
              <h3 className="text-sm font-bold text-retro-paper uppercase">
                Console Theme Language
              </h3>

              <div className="space-y-2">
                <div className="p-4 rounded-none bg-retro-surface-elevated border border-retro-orange flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-retro-paper uppercase">RETRO-FUTURISTIC MISSION CONTROL</div>
                    <p className="text-[11px] text-retro-muted mt-0.5">1970s NASA Terminal × Modern Usability</p>
                  </div>
                  <Check className="w-4 h-4 text-retro-orange" />
                </div>
              </div>
            </div>
          )}

          {/* Demo Controls */}
          {activeSection === 'demo' && (
            <div className="space-y-4">
              <div className="text-[10px] text-retro-muted uppercase tracking-widest">// PROTOTYPE DIAGNOSTICS:</div>
              <h3 className="text-sm font-bold text-retro-paper uppercase">
                Demo State Controls
              </h3>

              <p className="text-xs text-retro-muted font-sans leading-relaxed">
                Resetting the demo restores all seed students, requests, teams, and initial state back to the exact demo storyline (§6).
              </p>

              <div className="p-4 rounded-none bg-retro-surface-elevated border border-retro-border flex items-center justify-between gap-4">
                <div>
                  <h4 className="text-xs font-bold text-retro-paper">[ RESET DEMO SEED DATA ]</h4>
                  <p className="text-[10px] text-retro-muted font-sans">Clears local storage modifications and restores Lukmaan&apos;s team.</p>
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
