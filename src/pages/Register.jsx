import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
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
    if (!formData.name.trim()) errs.name = 'Full name is required.';
    else if (formData.name.trim().length < 2) errs.name = 'Provide a valid full name.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs = {};
    if (!formData.email.trim()) errs.email = 'Campus email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) errs.email = 'Provide a valid email.';
    if (formData.role === 'faculty' && !formData.department.trim()) errs.department = 'Department is required.';
    if (!formData.password) errs.password = 'Password is required.';
    else if (formData.password.length < 8) errs.password = 'Must be at least 8 chars.';
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
        title: 'NETWORK INITIALIZED',
        message: `Welcome, ${formData.name.split(' ')[0]}! Starting onboarding...`,
      });
      navigate('/onboarding');
    } catch (err) {
      setErrors({ form: err.message || 'Network initialization failed.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Header Stamp */}
      <div>
        <div className="text-[11px] font-mono font-bold text-ink/60 uppercase tracking-widest mb-1">
          02 / INITIALIZATION
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-ink uppercase tracking-tight leading-none">
          ENTER<br />THE<br /><span className="text-brutal-red">NETWORK.</span>
        </h1>
        <p className="text-xs text-ink/75 font-sans mt-2">
          Join the campus collaboration grid to assemble complementary project squads.
        </p>
      </div>

      {/* Progress Tracker */}
      <div className="p-3 bg-white border-2 border-ink flex items-center justify-between text-xs font-mono font-bold select-none shadow-brutal-sm">
        <div className={`flex items-center gap-1.5 ${step === 1 ? 'text-brutal-red' : step > 1 ? 'text-campus-green' : 'text-ink/40'}`}>
          <span>{step > 1 ? '✓' : step === 1 ? '●' : '○'}</span>
          <span>01 IDENTITY</span>
        </div>
        <span className="text-ink/30 hidden sm:inline">──────</span>
        <div className={`flex items-center gap-1.5 ${step === 2 ? 'text-brutal-red' : step > 2 ? 'text-campus-green' : 'text-ink/40'}`}>
          <span>{step > 2 ? '✓' : step === 2 ? '●' : '○'}</span>
          <span>02 ROLE</span>
        </div>
        <span className="text-ink/30 hidden sm:inline">──────</span>
        <div className={`flex items-center gap-1.5 ${step === 3 ? 'text-brutal-red' : 'text-ink/40'}`}>
          <span>{step === 3 ? '●' : '○'}</span>
          <span>03 ACCOUNT</span>
        </div>
      </div>

      {errors.form && (
        <div className="p-3 border-2 border-brutal-red bg-brutal-red/10 text-xs font-bold text-brutal-red">
          ERR: {errors.form}
        </div>
      )}

      {/* STEP 1 */}
      {step === 1 && (
        <form onSubmit={(e) => { e.preventDefault(); if (validateStep1()) setStep(2); }} className="space-y-4 animate-fade-in font-sans">
          <div className="p-4 bg-white border-2 border-ink space-y-1 shadow-brutal-sm">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink/60">// 01 IDENTIFICATION</span>
            <h2 className="text-base font-display font-bold text-ink uppercase">WHAT SHOULD WE CALL YOU?</h2>
            <p className="text-xs text-ink/70">Enter your full legal or campus name for directory identification.</p>
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
          <Button type="submit" variant="primary" size="md" className="w-full font-mono" icon={ArrowRight} iconPosition="right">
            [ CONTINUE TO ROLE → ]
          </Button>
        </form>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="space-y-4 animate-fade-in font-sans">
          <div className="p-4 bg-white border-2 border-ink space-y-1 shadow-brutal-sm">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-ink/60">// 02 CAMPUS CLASSIFICATION</span>
            <h2 className="text-base font-display font-bold text-ink uppercase">CHOOSE YOUR PROTOCOL</h2>
            <p className="text-xs text-ink/70">Select your active role inside the university ecosystem.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <RoleSelectCard
              roleKey="student"
              title="Student Builder"
              description="Discover teammates for hackathons, side projects, and campus startups."
              icon={GraduationCap}
              badgeText="PEER NODE"
              isSelected={formData.role === 'student'}
              onSelect={() => setFormData({ ...formData, role: 'student' })}
            />
            <RoleSelectCard
              roleKey="faculty"
              title="Faculty / Mentor"
              description="Post lab research initiatives and guide student collaboration squads."
              icon={Building}
              badgeText="FACULTY NODE"
              isSelected={formData.role === 'faculty'}
              onSelect={() => setFormData({ ...formData, role: 'faculty' })}
            />
          </div>
          <div className="flex items-center gap-3 pt-2 font-mono">
            <Button type="button" variant="outline" size="md" onClick={() => setStep(1)} icon={ArrowLeft} className="flex-1">
              [ ← BACK ]
            </Button>
            <Button type="button" variant="primary" size="md" onClick={() => setStep(3)} icon={ArrowRight} iconPosition="right" className="flex-1">
              [ CONTINUE → ]
            </Button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in font-sans">
          <div className="p-4 bg-white border-2 border-ink space-y-1 shadow-brutal-sm font-mono">
            <span className="text-[10px] font-bold uppercase tracking-widest text-ink/60">// 03 CREDENTIAL SETUP</span>
            <h2 className="text-base font-display font-bold text-ink uppercase">CAMPUS ACCESS PASS</h2>
          </div>
          <Input
            label="College Email (.edu)"
            type="email"
            placeholder="lukmaan@campus.edu"
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
          <div className="flex items-center gap-3 pt-1 font-mono">
            <Button type="button" variant="outline" size="md" onClick={() => setStep(2)} icon={ArrowLeft} className="flex-1">
              [ ← BACK ]
            </Button>
            <Button type="submit" variant="primary" size="md" className="flex-1" icon={ArrowRight} iconPosition="right" isLoading={isSubmitting}>
              [ JOIN NETWORK → ]
            </Button>
          </div>
        </form>
      )}

      {/* Login Redirect */}
      <p className="text-xs font-mono text-ink/70 text-center pt-2">
        Existing operator?{' '}
        <Link to="/login" className="text-brutal-red hover:underline font-bold uppercase tracking-wider ml-1">
          [ SIGN IN ]
        </Link>
      </p>
    </div>
  );
}
