import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  Check,
  GraduationCap,
  Briefcase,
  Building,
} from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import RoleSelectCard from '../components/auth/RoleSelectCard';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    role: 'student',
    department: '',
    designation: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const validateStep1 = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Full name is required for network identification.';
    else if (formData.name.trim().length < 2) errs.name = 'Please provide a valid full name.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs = {};
    if (!formData.email.trim()) errs.email = 'Campus email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid campus email address.';
    }
    if (formData.role === 'faculty' && !formData.department.trim()) {
      errs.department = 'Department name is required.';
    }
    if (!formData.password) errs.password = 'Password is required.';
    else if (formData.password.length < 8) errs.password = 'Password must contain at least 8 characters.';
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep3()) return;
    setIsSubmitting(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        department: formData.department || 'Computer Science & Engineering',
        designation: formData.designation || (formData.role === 'faculty' ? 'Assistant Professor' : 'Student'),
      });
      addToast({
        type: 'success',
        title: 'Network Initialized',
        message: `Welcome, ${formData.name.split(' ')[0]}! Proceeding to calibration...`,
      });
      navigate('/onboarding');
    } catch (err) {
      setErrors({ form: err.message || 'Network initialization failed.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 font-mono">
      {/* Header Stamp */}
      <div>
        <div className="text-[10px] text-retro-muted uppercase tracking-widest mb-1">
          [ AUTH // NETWORK_INITIALIZATION ]
        </div>
        <h1 className="text-xl sm:text-2xl font-display font-bold text-retro-paper uppercase tracking-wide">
          # ENTER THE NETWORK
        </h1>
        <p className="text-xs text-retro-muted font-sans mt-0.5">
          Join the campus collaboration grid to assemble complementary project squads.
        </p>
      </div>

      {/* Progress Tracker */}
      <div className="p-2.5 bg-retro-surface border border-retro-border flex items-center justify-between text-[11px] select-none shadow-panel">
        <div className={`flex items-center gap-1.5 ${step === 1 ? 'text-retro-coral font-bold' : step > 1 ? 'text-retro-mint' : 'text-retro-muted'}`}>
          <span>{step > 1 ? '✓' : step === 1 ? '●' : '○'}</span>
          <span>01 IDENTITY</span>
        </div>
        <span className="text-retro-border font-mono hidden sm:inline">──────</span>
        <div className={`flex items-center gap-1.5 ${step === 2 ? 'text-retro-coral font-bold' : step > 2 ? 'text-retro-mint' : 'text-retro-muted'}`}>
          <span>{step > 2 ? '✓' : step === 2 ? '●' : '○'}</span>
          <span>02 ROLE</span>
        </div>
        <span className="text-retro-border font-mono hidden sm:inline">──────</span>
        <div className={`flex items-center gap-1.5 ${step === 3 ? 'text-retro-coral font-bold' : 'text-retro-muted'}`}>
          <span>{step === 3 ? '●' : '○'}</span>
          <span>03 ACCOUNT</span>
        </div>
      </div>

      {errors.form && (
        <div className="p-2.5 bg-retro-red/10 border border-retro-red/40 text-xs text-retro-red">
          [ERR: {errors.form}]
        </div>
      )}

      {/* STEP 1: IDENTIFICATION */}
      {step === 1 && (
        <form onSubmit={(e) => { e.preventDefault(); if (validateStep1()) setStep(2); }} className="space-y-4 animate-fade-in">
          <div className="p-3 bg-retro-surface border border-retro-border space-y-1">
            <span className="text-[9px] uppercase tracking-widest text-retro-muted">// STEP 01 / IDENTIFICATION</span>
            <h2 className="text-sm sm:text-base font-display font-bold text-retro-paper uppercase">WHAT SHOULD WE CALL YOU?</h2>
            <p className="text-xs text-retro-muted font-sans">Enter your full legal or campus name for network identification and compatibility indexing.</p>
          </div>
          <Input
            label="Full Name"
            placeholder="e.g. Lukmaan Hakim"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
            }}
            icon={User}
            error={errors.name}
            autoFocus
            required
          />
          <Button type="submit" variant="primary" size="md" className="w-full" icon={ArrowRight} iconPosition="right">
            [ CONTINUE TO ROLE → ]
          </Button>
        </form>
      )}

      {/* STEP 2: ACCESS IDENTITY (ROLE SELECTION) */}
      {step === 2 && (
        <div className="space-y-4 animate-fade-in">
          <div className="p-3 bg-retro-surface border border-retro-border space-y-1">
            <span className="text-[9px] uppercase tracking-widest text-retro-muted">// STEP 02 / ACCESS IDENTITY</span>
            <h2 className="text-sm sm:text-base font-display font-bold text-retro-paper uppercase">WHO ARE YOU JOINING AS?</h2>
            <p className="text-xs text-retro-muted font-sans">Select your campus access tier to configure your collaboration workspace.</p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <RoleSelectCard
              roleKey="student"
              selected={formData.role === 'student'}
              title="01 / STUDENT"
              subtitle="Undergraduate & Postgraduate Learners"
              description="Discover hackathon teammates, join student build squads, showcase project portfolios, and fill skill gaps across campus departments."
              icon={GraduationCap}
              onSelect={(r) => setFormData({ ...formData, role: r })}
            />
            <RoleSelectCard
              roleKey="faculty"
              selected={formData.role === 'faculty'}
              title="02 / FACULTY"
              subtitle="Mentors, Professors & Researchers"
              description="Guide student research initiatives, propose capstone projects, evaluate cohort builds, and mentor student hackathon delegations."
              icon={Briefcase}
              onSelect={(r) => setFormData({ ...formData, role: r })}
            />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <Button type="button" variant="outline" size="md" onClick={() => setStep(1)} icon={ArrowLeft} className="flex-1">
              [ ← BACK ]
            </Button>
            <Button type="button" variant="primary" size="md" onClick={() => setStep(3)} icon={ArrowRight} iconPosition="right" className="flex-1">
              [ PROCEED TO CREDENTIALS → ]
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3: ACCOUNT INITIALIZATION */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
          <div className="p-3 bg-retro-surface border border-retro-border space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[9px] uppercase tracking-widest text-retro-muted">// STEP 03 / ACCOUNT INITIALIZATION</span>
              <span className="text-[10px] text-retro-mint flex items-center gap-1 font-bold">
                <Check className="w-3 h-3" /> VERIFIED: {formData.name}
              </span>
            </div>
            <div className="flex items-center gap-2 pt-0.5">
              <span className="text-xs font-bold text-retro-paper uppercase">{formData.name}</span>
              <span className="text-[9px] px-1.5 py-0.2 bg-retro-surface-elevated text-retro-amber border border-retro-border uppercase">
                {formData.role === 'student' ? 'STUDENT ACCESS' : 'FACULTY ACCESS'}
              </span>
            </div>
          </div>

          <Input
            label="College Email"
            type="email"
            placeholder="your.name@campus.edu"
            value={formData.email}
            onChange={(e) => {
              setFormData({ ...formData, email: e.target.value });
              if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
            }}
            icon={Mail}
            error={errors.email}
            required
          />

          {formData.role === 'faculty' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input
                label="Department"
                placeholder="e.g. Computer Science"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                icon={Building}
                error={errors.department}
                required
              />
              <Input
                label="Designation"
                placeholder="e.g. Professor"
                value={formData.designation}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                icon={Briefcase}
              />
            </div>
          )}

          <Input
            label="Password (min 8 chars)"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => {
              setFormData({ ...formData, password: e.target.value });
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            icon={Lock}
            error={errors.password}
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) => {
              setFormData({ ...formData, confirmPassword: e.target.value });
              if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
            }}
            icon={Lock}
            error={errors.confirmPassword}
            required
          />

          <div className="flex items-center gap-3 pt-1">
            <Button type="button" variant="outline" size="md" onClick={() => setStep(2)} icon={ArrowLeft} className="flex-1">
              [ ← BACK ]
            </Button>
            <Button type="submit" variant="primary" size="md" className="flex-1" icon={ArrowRight} iconPosition="right" isLoading={isSubmitting}>
              [ ENTER THE NETWORK → ]
            </Button>
          </div>
        </form>
      )}

      {/* Login Redirect */}
      <p className="text-xs text-retro-muted text-center pt-2">
        Existing operator?{' '}
        <Link to="/login" className="text-retro-coral hover:text-retro-amber font-bold transition-colors uppercase tracking-wider">
          Sign In
        </Link>
      </p>
    </div>
  );
}
