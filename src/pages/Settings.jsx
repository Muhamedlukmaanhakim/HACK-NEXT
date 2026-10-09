import React, { useState, useEffect } from 'react';
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
  Building,
  GraduationCap,
  Database,
  Server,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Activity,
} from 'lucide-react';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Toggle from '../components/ui/Toggle';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import { DEPARTMENTS, YEARS } from '../services/taxonomyService';
import { isSupabaseConfigured, getSupabaseConfigStatus, testSupabaseConnection } from '../lib/supabase';

export default function Settings() {
  const { user, updateProfile, logout } = useAuth();
  const { resetToSeedData } = useAppData();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const isFaculty = user?.role === 'faculty';
  const configStatus = getSupabaseConfigStatus();

  const [activeSection, setActiveSection] = useState('account');
  const [settings, setSettings] = useState({
    name: user?.name || '',
    email: user?.email || '',
    department: user?.department || '',
    year: user?.year || '',
    designation: user?.designation || '',
    facultyId: user?.facultyId || '',
    expertise: user?.expertise || '',
    officeHours: user?.officeHours || '',
    emailNotifications: true,
    requestAlerts: true,
    weeklyMatches: true,
    publicProfile: true,
    showAvailability: true,
  });

  // Keep state synchronized with authentic user object upon load or account change
  useEffect(() => {
    if (user) {
      setSettings((prev) => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
        department: user.department || '',
        year: user.year || '',
        designation: user.designation || '',
        facultyId: user.facultyId || '',
        expertise: user.expertise || '',
      }));
    }
  }, [user]);

  // Live Database Connection Diagnostics state
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionResult, setConnectionResult] = useState(null);

  const handleTestConnection = async () => {
    setTestingConnection(true);
    try {
      const res = await testSupabaseConnection();
      setConnectionResult(res);
      if (res.connected) {
        addToast('Live Supabase PostgreSQL connection verified successfully!', 'success');
      } else if (res.reason === 'UNCONFIGURED') {
        addToast('Operating in Standby Mode: credentials not set in .env.local', 'info');
      } else {
        addToast(`Supabase Connection Check: ${res.message}`, 'error');
      }
    } catch (e) {
      setConnectionResult({ connected: false, message: e.message, reason: 'ERROR' });
      addToast(e.message, 'error');
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (isFaculty) {
      await updateProfile({
        name: settings.name,
        department: settings.department,
        designation: settings.designation,
        expertise: settings.expertise,
        officeHours: settings.officeHours,
      });
    } else {
      await updateProfile({
        name: settings.name,
        department: settings.department,
        year: settings.year,
      });
    }
    addToast({
      type: 'success',
      title: 'PREFERENCES SAVED',
      message: 'Your system settings and identity node have been updated.',
    });
  };

  const handleResetDemo = () => {
    resetToSeedData();
    addToast({
      type: 'info',
      title: 'DEMO STATE RESTORED',
      message: 'All application records restored to initial demo baseline.',
    });
  };

  const handleLogout = async () => {
    await logout();
    addToast({
      type: 'info',
      title: 'SESSION TERMINATED',
      message: 'You have been safely signed out.',
    });
    navigate('/login');
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto font-sans animate-fade-in">
      {/* Header */}
      <div className="border-b-3 border-ink pb-6">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-brutal-red mb-1">
          {isFaculty ? <Building className="w-4 h-4 text-ink" /> : <GraduationCap className="w-4 h-4 text-ink" />}
          <span>CONFIG // {isFaculty ? 'FACULTY NODE CONFIGURATION' : 'STUDENT NODE CONFIGURATION'}</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-black text-ink uppercase tracking-tight leading-none">
          SYSTEM SETTINGS.
        </h1>
        <p className="text-xs sm:text-sm font-mono text-ink/75 font-semibold uppercase mt-2">
          {isFaculty
            ? 'MANAGE PROFESSIONAL CREDENTIALS, SUPERVISION SIGNALS, VISIBILITY, AND LAB CONTROLS'
            : 'MANAGE ACADEMIC CREDENTIALS, NOTIFICATIONS, VISIBILITY, AND SQUAD CONTROLS'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Navigation Sidebar (4 cols) */}
        <div className="md:col-span-4 p-2 bg-white border-2 border-ink shadow-brutal space-y-1 font-mono">
          {[
            { id: 'account', label: '01. Account Dossier', icon: User },
            { id: 'notifications', label: '02. Notifications', icon: Bell },
            { id: 'privacy', label: '03. Visibility Grid', icon: Shield },
            { id: 'appearance', label: '04. Theme Aesthetic', icon: Palette },
            { id: 'data', label: '05. Data & Storage', icon: RotateCcw },
            { id: 'database', label: '06. Database Engine', icon: Database },
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
            <form onSubmit={handleSave} className="space-y-4 font-mono">
              <div className="border-b-2 border-ink pb-2 flex items-center justify-between">
                <h3 className="font-display font-black text-base text-ink uppercase">
                  {isFaculty ? 'FACULTY OPERATOR CREDENTIALS' : 'STUDENT OPERATOR CREDENTIALS'}
                </h3>
                <span className={`px-2 py-0.5 border border-ink text-[10px] font-bold ${isFaculty ? 'bg-ink text-white' : 'bg-signal-yellow text-ink'}`}>
                  {isFaculty ? 'FACULTY NODE' : 'STUDENT NODE'}
                </span>
              </div>

              {isFaculty ? (
                <>
                  <Input
                    label="FULL FACULTY NAME (WITH TITLE)"
                    value={settings.name}
                    placeholder="e.g. Dr. Aris Thorne"
                    onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  />

                  <Input
                    label="INSTITUTIONAL EMAIL (.edu)"
                    value={settings.email}
                    disabled
                    helperText="Institutional email is bound to verified faculty campus identity."
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="DEPARTMENT / LAB"
                      value={settings.department}
                      placeholder="e.g. Computer Science (CSE)"
                      onChange={(e) => setSettings({ ...settings, department: e.target.value })}
                    />
                    <Input
                      label="DESIGNATION / TITLE"
                      value={settings.designation}
                      placeholder="e.g. Professor & Lab Director"
                      onChange={(e) => setSettings({ ...settings, designation: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="FACULTY / EMPLOYEE IDENTIFIER"
                      value={settings.facultyId || user?.facultyId || 'FAC-8021'}
                      disabled
                      helperText="Bound to campus HR and faculty register."
                    />
                    <Input
                      label="PRIMARY AREA OF EXPERTISE"
                      value={settings.expertise}
                      placeholder="e.g. Autonomous Systems & AI"
                      onChange={(e) => setSettings({ ...settings, expertise: e.target.value })}
                    />
                  </div>

                  <Input
                    label="ADVISING & OFFICE HOURS"
                    value={settings.officeHours}
                    placeholder="e.g. Tuesdays & Thursdays, 3:00 PM – 5:00 PM"
                    onChange={(e) => setSettings({ ...settings, officeHours: e.target.value })}
                    helperText="Visible to students requesting capstone or research mentoring."
                  />
                </>
              ) : (
                <>
                  <Input
                    label="FULL NAME"
                    value={settings.name}
                    placeholder="e.g. Sarah Chen"
                    onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  />

                  <Input
                    label="COLLEGE EMAIL (.edu)"
                    value={settings.email}
                    disabled
                    helperText="Email is bound to verified student identity node."
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                  <Input
                    label="COLLEGE ROLL NUMBER"
                    value={user?.rollNo || '23CSE-084'}
                    disabled
                    helperText="Student roll number is bound to campus registrar records."
                  />
                </>
              )}

              <div className="pt-4 border-t-2 border-ink flex justify-end">
                <Button type="submit" variant="primary" size="sm" icon={Save}>
                  SAVE PREFERENCES
                </Button>
              </div>
            </form>
          )}

          {/* Notifications */}
          {activeSection === 'notifications' && (
            <div className="space-y-4 font-mono">
              <div className="border-b-2 border-ink pb-2">
                <h3 className="font-display font-black text-base text-ink uppercase">NOTIFICATION SIGNALS</h3>
              </div>
              <div className="space-y-3 pt-1">
                {isFaculty ? (
                  <>
                    <Toggle
                      label="Student Evidence Submission Alerts"
                      description="Receive instant alerts when a student submits skill evidence for authorized review."
                      checked={settings.requestAlerts}
                      onChange={(v) => setSettings({ ...settings, requestAlerts: v })}
                    />
                    <Toggle
                      label="Trial Sprint Completion Notifications"
                      description="Get notified when candidates complete deliverables for active trial sprints."
                      checked={settings.weeklyMatches}
                      onChange={(v) => setSettings({ ...settings, weeklyMatches: v })}
                    />
                    <Toggle
                      label="Team Health Radar Critical Risk Alerts"
                      description="Immediate signal when a supervised squad triggers an overdue deliverable or bus factor 1 risk."
                      checked={settings.showAvailability}
                      onChange={(v) => setSettings({ ...settings, showAvailability: v })}
                    />
                    <Toggle
                      label="Institutional Email Forwarding"
                      description="Forward critical supervisory alerts to your official faculty institutional inbox."
                      checked={settings.emailNotifications}
                      onChange={(v) => setSettings({ ...settings, emailNotifications: v })}
                    />
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          )}

          {/* Privacy */}
          {activeSection === 'privacy' && (
            <div className="space-y-4 font-mono">
              <div className="border-b-2 border-ink pb-2">
                <h3 className="font-display font-black text-base text-ink uppercase">PRIVACY & VISIBILITY</h3>
              </div>
              <div className="space-y-3 pt-1">
                {isFaculty ? (
                  <>
                    <Toggle
                      label="Public Faculty Directory Listing"
                      description="Allow students and other lab directors to view your supervision portfolio in the directory."
                      checked={settings.publicProfile}
                      onChange={(v) => setSettings({ ...settings, publicProfile: v })}
                    />
                    <Toggle
                      label="Display Lab Mentoring Availability"
                      description="Show active availability for supervising new student research initiatives and capstone projects."
                      checked={settings.showAvailability}
                      onChange={(v) => setSettings({ ...settings, showAvailability: v })}
                    />
                  </>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>
          )}

          {/* Appearance */}
          {activeSection === 'appearance' && (
            <div className="space-y-4 font-mono">
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

          {/* Data Controls */}
          {activeSection === 'data' && (
            <div className="space-y-4 font-mono">
              <div className="border-b-2 border-ink pb-2">
                <h3 className="font-display font-black text-base text-ink uppercase">DATA & STORAGE CONTROLS</h3>
              </div>
              <p className="text-xs font-sans text-ink/80 leading-relaxed">
                Resetting restores application mock data, opportunity catalogs, and local state caches back to default state.
              </p>
              <div className="p-4 bg-canvas border-2 border-ink flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-display font-black text-xs uppercase text-ink">
                    RESET LOCAL APP CACHE & DATA
                  </h4>
                  <p className="text-[11px] font-mono text-ink/80 mt-0.5">
                    Clears local storage caches and re-initializes data stores.
                  </p>
                </div>
                <Button variant="primary" size="sm" icon={RotateCcw} onClick={handleResetDemo} className="text-xs font-bold">
                  RESET LOCAL DATA
                </Button>
              </div>
            </div>
          )}

          {/* Database Engine */}
          {activeSection === 'database' && (
            <div className="space-y-5 font-mono">
              <div className="border-b-2 border-ink pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <h3 className="font-display font-black text-base text-ink uppercase">DATABASE ENGINE & CLOUD ARCHITECTURE</h3>
                <span className={`px-2 py-0.5 border border-ink text-[10px] font-bold self-start sm:self-auto ${configStatus.configured ? 'bg-campus-green text-white' : 'bg-signal-yellow text-ink'}`}>
                  {configStatus.mode}
                </span>
              </div>

              {/* Status Dossier Card */}
              <div className={`p-4 border-2 border-ink space-y-3 shadow-brutal-sm ${configStatus.configured ? 'bg-white' : 'bg-cream/60'}`}>
                <div className="flex items-center gap-2">
                  {configStatus.configured ? (
                    <CheckCircle2 className="w-5 h-5 text-campus-green stroke-[2.5]" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-brutal-red stroke-[2.5]" />
                  )}
                  <h4 className="font-display font-black text-sm uppercase text-ink">
                    {configStatus.configured ? 'SUPABASE POSTGRESQL INSTANCE CONFIGURED' : 'STANDBY // LOCAL BROWSER STATE ACTIVE'}
                  </h4>
                </div>

                <p className="text-xs text-ink/80 leading-relaxed font-sans font-normal">
                  {configStatus.message}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-ink/20 text-[11px]">
                  <div>
                    <span className="text-ink/60 uppercase block text-[9px] font-bold">DATABASE BACKEND</span>
                    <span className="font-bold">Supabase PostgreSQL 15+</span>
                  </div>
                  <div>
                    <span className="text-ink/60 uppercase block text-[9px] font-bold">ROW LEVEL SECURITY (RLS)</span>
                    <span className="font-bold text-campus-green">19 Least-Privilege Policies Ready</span>
                  </div>
                  <div>
                    <span className="text-ink/60 uppercase block text-[9px] font-bold">AUTH PROVIDER</span>
                    <span className="font-bold">Supabase Auth (JWT Bearer)</span>
                  </div>
                  <div>
                    <span className="text-ink/60 uppercase block text-[9px] font-bold">ENDPOINT CONFIGURATION</span>
                    <span className="font-bold truncate block">{configStatus.url || 'Awaiting .env.local'}</span>
                  </div>
                </div>

                {/* Live Connection Test Button & Diagnostics */}
                <div className="pt-3 border-t border-ink/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-ink/70 uppercase block text-[10px] font-bold">LIVE CONNECTION VERIFIER</span>
                    <span className="text-[11px] text-ink/80 font-sans">
                      Verify active TCP socket and query response against PostgreSQL
                    </span>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Activity}
                    onClick={handleTestConnection}
                    disabled={testingConnection}
                    className="text-xs font-bold"
                  >
                    {testingConnection ? 'TESTING CONNECTION...' : 'TEST DATABASE CONNECTION'}
                  </Button>
                </div>

                {connectionResult && (
                  <div className={`p-3 border-2 border-ink text-xs ${connectionResult.connected ? 'bg-campus-green/10 border-campus-green text-ink' : 'bg-signal-yellow/30 border-ink text-ink'}`}>
                    <div className="flex items-center gap-2 font-bold uppercase text-[11px]">
                      {connectionResult.connected ? (
                        <CheckCircle2 className="w-4 h-4 text-campus-green stroke-[3]" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-brutal-red stroke-[2.5]" />
                      )}
                      <span>{connectionResult.connected ? 'CONNECTION VERIFIED' : `DIAGNOSTIC STATUS: ${connectionResult.reason}`}</span>
                      {connectionResult.latencyMs !== null && (
                        <span className="ml-auto font-mono text-[10px] bg-ink text-canvas px-1.5 py-0.5">
                          {connectionResult.latencyMs}ms LATENCY
                        </span>
                      )}
                    </div>
                    <p className="mt-1 font-sans text-[11px] text-ink/90">
                      {connectionResult.message}
                    </p>
                    {connectionResult.timestamp && (
                      <span className="block mt-1 font-mono text-[9px] text-ink/60">
                        VERIFIED AT: {connectionResult.timestamp}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Architecture Modes Overview */}
              <div className="p-4 bg-white border-2 border-ink shadow-brutal-sm space-y-3 text-xs">
                <div className="border-b border-ink/20 pb-2">
                  <h4 className="font-display font-black uppercase text-xs text-ink">SYSTEM OPERATIONAL MODES</h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
                  <div className="p-2.5 bg-canvas border border-ink space-y-1">
                    <span className="font-bold text-xs uppercase block text-ink">01. USER SESSION & AUTH</span>
                    <p className="text-ink/80 text-[10px] leading-relaxed font-sans">
                      Role-based authentication (Student vs Faculty). Register a new account or sign in with campus email.
                    </p>
                  </div>
                  <div className="p-2.5 bg-canvas border border-ink space-y-1">
                    <span className="font-bold text-xs uppercase block text-ink">02. STANDBY LOCAL</span>
                    <p className="text-ink/80 text-[10px] leading-relaxed font-sans">
                      Active when .env.local credentials are absent. Operates with zero assumptions in browser-safe local state.
                    </p>
                  </div>
                  <div className="p-2.5 bg-canvas border border-ink space-y-1">
                    <span className="font-bold text-xs uppercase block text-ink">03. LIVE POSTGRESQL</span>
                    <p className="text-ink/80 text-[10px] leading-relaxed font-sans">
                      Live Supabase database. All authentic reads and writes route directly to PostgreSQL with 19 RLS policies enforced.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Setup Guide */}
              {!configStatus.configured && (
                <div className="p-4 bg-white border-2 border-ink shadow-brutal space-y-3 text-xs">
                  <div className="flex items-center gap-2 font-display font-black uppercase text-sm border-b border-ink/20 pb-2">
                    <Server className="w-4 h-4 text-ink" />
                    <span>STEPS TO ACTIVATE LIVE SUPABASE CONNECTION</span>
                  </div>

                  <ol className="space-y-2.5 list-decimal list-inside text-ink/85 leading-relaxed font-sans">
                    <li>
                      <strong>Create or Access Supabase Project:</strong> Sign in at <code className="bg-canvas px-1 border border-ink text-xs">supabase.com</code> and navigate to your project dashboard.
                    </li>
                    <li>
                      <strong>Apply Database Migrations:</strong> In the dashboard, open <strong>SQL Editor</strong> &gt; <em>New query</em>, then paste and run the contents of:
                      <ul className="list-disc list-inside pl-4 font-mono text-[11px] mt-1 space-y-1 text-ink">
                        <li><code>supabase/migrations/20261009000001_initial_schema.sql</code> (19 tables + schema trigger)</li>
                        <li><code>supabase/migrations/20261009000002_row_level_security.sql</code> (Zero-trust RLS policies)</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Locate Your API Keys:</strong> Go to <strong>Project Settings &gt; API</strong>:
                      <ul className="list-disc list-inside pl-4 font-sans text-[11px] mt-1 space-y-0.5 text-ink">
                        <li>Copy the <strong>Project URL</strong> (e.g., <code>https://xyzcompany.supabase.co</code>)</li>
                        <li>Copy the <strong>Project API Keys &gt; anon (public)</strong> key</li>
                      </ul>
                    </li>
                    <li>
                      <strong>Enter Publishable Anon Key in <code className="bg-canvas px-1 border border-ink text-xs">.env.local</code>:</strong>
                      <pre className="bg-ink text-canvas p-2.5 mt-1 font-mono text-[11px] overflow-x-auto border border-ink">
{`VITE_SUPABASE_URL=${configStatus.url || 'https://uvikmcnhhfgxpjokqsjy.supabase.co'}
VITE_SUPABASE_ANON_KEY=paste_your_anon_public_key_here`}
                      </pre>
                    </li>
                  </ol>

                  <div className="p-2.5 bg-signal-yellow/30 border border-ink text-[11px] font-mono text-ink/90 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-ink flex-shrink-0" />
                    <span>CollabMatrix will instantly detect .env.local on restart and switch to live PostgreSQL mode.</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
