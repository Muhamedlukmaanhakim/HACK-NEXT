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
    addToast({ type: 'success', title: 'PREFERENCES SAVED', message: 'Your settings have been updated.' });
  };

  const handleResetDemo = () => {
    resetToSeedData();
    addToast({ type: 'info', title: 'DEMO STATE RESTORED', message: 'All data restored to initial demo state.' });
  };

  const handleLogout = async () => {
    await logout();
    addToast({ type: 'info', title: 'SIGNED OUT', message: 'You have been signed out.' });
    navigate('/login');
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b-3 border-ink pb-6">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-brutal-red mb-1">
          CONFIG // 16
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-black text-ink uppercase tracking-tight leading-none">
          SYSTEM SETTINGS.
        </h1>
        <p className="text-xs sm:text-sm font-mono text-ink/70 font-semibold uppercase mt-2">
          MANAGE CREDENTIALS, NOTIFICATIONS, VISIBILITY, AND DEMO STATE
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar (4 cols) */}
        <div className="md:col-span-4 p-2 bg-white border-2 border-ink shadow-brutal space-y-1">
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
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-mono font-bold transition-all border-2 ${
                activeSection === item.id
                  ? 'bg-ink text-canvas border-ink shadow-brutal-sm'
                  : 'border-transparent text-ink hover:bg-canvas'
              }`}
            >
              <item.icon className="w-3.5 h-3.5 stroke-[2.5] flex-shrink-0" />
              <span className="truncate uppercase">{item.label}</span>
            </button>
          ))}

          <div className="pt-2 border-t-2 border-ink">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-mono font-bold text-brutal-red hover:bg-brutal-red hover:text-white transition-colors uppercase border-2 border-transparent"
            >
              <LogOut className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>[ LOG OUT ]</span>
            </button>
          </div>
        </div>

        {/* Setting Panel Content (8 cols) */}
        <div className="md:col-span-8 p-6 bg-white border-2 border-ink shadow-brutal space-y-6">
          {/* Account */}
          {activeSection === 'account' && (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="border-b-2 border-ink pb-2">
                <h3 className="font-display font-black text-base text-ink uppercase">OPERATOR CREDENTIALS</h3>
              </div>
              <Input
                label="FULL NAME"
                value={settings.name}
                onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              />
              <Input
                label="COLLEGE EMAIL"
                value={settings.email}
                disabled
                helperText="Email is bound to verified campus identity node."
              />
              <div className="grid grid-cols-2 gap-4">
                <Select
                  label="DEPARTMENT"
                  value={settings.department}
                  onChange={(e) => setSettings({ ...settings, department: e.target.value })}
                  options={DEPARTMENTS}
                />
                <Select
                  label="YEAR OF STUDY"
                  value={settings.year}
                  onChange={(e) => setSettings({ ...settings, year: e.target.value })}
                  options={YEARS}
                />
              </div>
              <div className="pt-4 border-t-2 border-ink flex justify-end">
                <Button type="submit" variant="primary" size="sm" icon={Save}>
                  SAVE PREFERENCES
                </Button>
              </div>
            </form>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <div className="space-y-4">
              <div className="border-b-2 border-ink pb-2">
                <h3 className="font-display font-black text-base text-ink uppercase">NOTIFICATION SIGNALS</h3>
              </div>
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
              <div className="border-b-2 border-ink pb-2">
                <h3 className="font-display font-black text-base text-ink uppercase">PRIVACY & VISIBILITY</h3>
              </div>
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
              <div className="border-b-2 border-ink pb-2">
                <h3 className="font-display font-black text-base text-ink uppercase">SYSTEM DESIGN LANGUAGE</h3>
              </div>
              <div className="p-4 bg-canvas border-2 border-ink flex items-center justify-between">
                <div>
                  <div className="font-display font-black text-sm uppercase text-ink">
                    DIGITAL BRUTALISM × EDITORIAL MOTION
                  </div>
                  <p className="font-mono text-xs text-ink/70 mt-1 uppercase">
                    Raw Structure · Human Connection · Heavy Grotesk
                  </p>
                </div>
                <Check className="w-5 h-5 text-ink stroke-[3]" />
              </div>
            </div>
          )}

          {/* Demo Controls */}
          {activeSection === 'demo' && (
            <div className="space-y-4">
              <div className="border-b-2 border-ink pb-2">
                <h3 className="font-display font-black text-base text-ink uppercase">DEMO CONTROLS</h3>
              </div>
              <p className="text-xs font-sans text-ink/80 leading-relaxed">
                Resetting restores all seed students, requests, teams, and initial state back to the demo storyline.
              </p>
              <div className="p-4 bg-signal-yellow border-2 border-ink flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-display font-black text-xs uppercase text-ink">RESET DEMO TO SEED STATE</h4>
                  <p className="text-[11px] font-mono text-ink/80 mt-0.5">Restores Lukmaan's initial squad and requests.</p>
                </div>
                <Button variant="primary" size="sm" icon={RotateCcw} onClick={handleResetDemo} className="text-xs font-bold">
                  RESET DEMO
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
