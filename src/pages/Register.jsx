import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Building,
  BadgeAlert,
  FileText,
} from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import RoleSelectCard from '../components/auth/RoleSelectCard';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('student'); // 'student' | 'faculty'

  // Student form state - begins strictly empty without default CSE or sample values
  const [studentForm, setStudentForm] = useState({
    name: '',
    rollNo: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Faculty form state - begins strictly empty without defaults
  const [facultyForm, setFacultyForm] = useState({
    name: '',
    facultyId: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Validate Step 1: Role Selection
  const validateStep1 = () => {
    return role === 'student' || role === 'faculty';
  };

  // Validate Step 2: Identification & Credentials
  const validateStep2 = () => {
    const errs = {};
    if (role === 'student') {
      if (!studentForm.name.trim()) errs.name = 'Full campus name is required.';
      else if (studentForm.name.trim().length < 2) errs.name = 'Provide a valid full name.';

      if (!studentForm.rollNo.trim()) errs.rollNo = 'College roll / student registration number is required.';

      if (!studentForm.email.trim()) errs.email = 'Campus college email is required.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(studentForm.email)) errs.email = 'Provide a valid email address.';

      if (!studentForm.password) errs.password = 'Password is required.';
      else if (studentForm.password.length < 8) errs.password = 'Password must be at least 8 characters.';

      if (studentForm.password !== studentForm.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    } else {
      if (!facultyForm.name.trim()) errs.name = 'Full faculty name is required.';
      else if (facultyForm.name.trim().length < 2) errs.name = 'Provide a valid full name.';

      if (!facultyForm.facultyId.trim()) errs.facultyId = 'Faculty employee identifier is required.';

      if (!facultyForm.email.trim()) errs.email = 'College institutional email is required.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(facultyForm.email)) errs.email = 'Provide a valid email address.';

      if (!facultyForm.password) errs.password = 'Password is required.';
      else if (facultyForm.password.length < 8) errs.password = 'Password must be at least 8 characters.';

      if (facultyForm.password !== facultyForm.confirmPassword) errs.confirmPassword = 'Passwords do not match.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setIsSubmitting(true);
    try {
      if (role === 'student') {
        await register({
          role: 'student',
          name: studentForm.name.trim(),
          rollNo: studentForm.rollNo.trim(),
          email: studentForm.email.trim(),
          password: studentForm.password,
          department: '',
          year: '',
          semester: '',
          skills: [],
          interests: [],
          domain: '',
          availability: [],
          bio: '',
        });
        addToast({
          type: 'success',
          title: 'STUDENT NODE REGISTERED',
          message: `Welcome, ${studentForm.name.split(' ')[0]}! Complete your collaboration onboarding.`,
        });
        navigate('/onboarding');
      } else {
        await register({
          role: 'faculty',
          name: facultyForm.name.trim(),
          facultyId: facultyForm.facultyId.trim(),
          email: facultyForm.email.trim(),
          password: facultyForm.password,
          department: '',
          designation: '',
          expertise: '',
          researchInterests: [],
          mentoringAreas: [],
          bio: '',
        });
        addToast({
          type: 'success',
          title: 'FACULTY NODE REGISTERED',
          message: `Welcome, ${facultyForm.name}! Complete your departmental onboarding.`,
        });
        navigate('/onboarding/faculty');
      }
    } catch (err) {
      setErrors({ form: err.message || 'Registration failed. Check connection or try another email.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Header Stamp */}
      <div>
        <div className="text-[11px] font-mono font-bold text-ink/60 uppercase tracking-widest mb-1">
          REGISTRATION // 02
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-black text-ink uppercase tracking-tight leading-[0.92]">
          ENTER<br />THE<br /><span className="text-brutal-red">NETWORK.</span>
        </h1>
        <p className="text-xs text-ink/75 font-sans mt-2">
          Join the campus collaboration grid as a student builder or faculty supervisor.
        </p>
      </div>

      {/* Progress Tracker */}
      <div className="p-3 bg-white border-2 border-ink flex items-center justify-between text-xs font-mono font-bold select-none shadow-brutal-sm">
        <div className={`flex items-center gap-1.5 ${step === 1 ? 'text-brutal-red font-black' : 'text-campus-green'}`}>
          <span>{step > 1 ? '✓' : '●'}</span>
          <span>01 ROLE SELECTION</span>
        </div>
        <span className="text-ink/30 hidden sm:inline">──────</span>
        <div className={`flex items-center gap-1.5 ${step === 2 ? 'text-brutal-red font-black' : 'text-ink/40'}`}>
          <span>{step === 2 ? '●' : '○'}</span>
          <span>02 ACCOUNT CREDENTIALS</span>
        </div>
      </div>

      {errors.form && (
        <div className="p-3 border-2 border-brutal-red bg-brutal-red/10 text-xs font-bold text-brutal-red flex items-center gap-2">
          <BadgeAlert className="w-4 h-4 flex-shrink-0" />
          <span>ERR: {errors.form}</span>
        </div>
      )}

      {/* STEP 1: ROLE SELECTION */}
      {step === 1 && (
        <div className="space-y-4 animate-fade-in font-sans">
          <div className="p-4 bg-white border-2 border-ink space-y-1 shadow-brutal-sm font-mono">
            <span className="text-[10px] font-bold uppercase tracking-widest text-ink/60">// 01 SELECT ACCESS ROLE</span>
            <h2 className="text-base font-display font-black text-ink uppercase">WHO ARE YOU JOINING AS?</h2>
            <p className="text-xs text-ink/70 font-sans">CollabMatrix maintains completely distinct workflows for students and faculty.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <RoleSelectCard
              roleKey="student"
              title="STUDENT"
              description="Assemble complementary project teams, test collaboration via Trial Sprints, and track verified contribution evidence."
              icon={GraduationCap}
              badgeText="STUDENT NODE"
              isSelected={role === 'student'}
              onSelect={() => {
                setRole('student');
                setErrors({});
              }}
            />
            <RoleSelectCard
              roleKey="faculty"
              title="FACULTY"
              description="Create lab research initiatives, supervise capstone teams, monitor Team Health Radars, and review student skill evidence."
              icon={Building}
              badgeText="FACULTY NODE"
              isSelected={role === 'faculty'}
              onSelect={() => {
                setRole('faculty');
                setErrors({});
              }}
            />
          </div>

          <div className="pt-2">
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => {
                if (validateStep1()) setStep(2);
              }}
              icon={ArrowRight}
              iconPosition="right"
              className="w-full font-mono"
            >
              [ CONTINUE TO CREDENTIALS → ]
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: CREDENTIALS */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in font-sans">
          <div className="p-4 bg-white border-2 border-ink space-y-1 shadow-brutal-sm font-mono">
            <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
              <span className="text-ink/60">// 02 CREDENTIALS</span>
              <span className="px-2 py-0.5 border border-ink bg-signal-yellow text-ink">
                {role === 'student' ? 'STUDENT REGISTRATION' : 'FACULTY REGISTRATION'}
              </span>
            </div>
            <h2 className="text-base font-display font-black text-ink uppercase">
              {role === 'student' ? 'CREATE STUDENT ACCOUNT' : 'CREATE FACULTY ACCOUNT'}
            </h2>
            <p className="text-xs text-ink/70 font-sans">
              All profile fields start completely unassigned. You will define your department and capabilities during onboarding.
            </p>
          </div>

          {role === 'student' ? (
            <>
              <Input
                label="FULL NAME"
                placeholder="e.g. John Doe"
                value={studentForm.name}
                onChange={(e) => {
                  setStudentForm({ ...studentForm, name: e.target.value });
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                icon={User}
                error={errors.name}
                autoFocus
                required
              />

              <Input
                label="COLLEGE ROLL / REGISTRATION NUMBER"
                placeholder="e.g. 24CSE-1029"
                value={studentForm.rollNo}
                onChange={(e) => {
                  setStudentForm({ ...studentForm, rollNo: e.target.value });
                  if (errors.rollNo) setErrors((prev) => ({ ...prev, rollNo: undefined }));
                }}
                icon={FileText}
                error={errors.rollNo}
                required
              />

              <Input
                label="CAMPUS EMAIL (.edu)"
                type="email"
                placeholder="your.name@campus.edu"
                value={studentForm.email}
                onChange={(e) => {
                  setStudentForm({ ...studentForm, email: e.target.value });
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                icon={Mail}
                error={errors.email}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="PASSWORD (8+ CHARS)"
                  type="password"
                  placeholder="••••••••"
                  value={studentForm.password}
                  onChange={(e) => {
                    setStudentForm({ ...studentForm, password: e.target.value });
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  icon={Lock}
                  error={errors.password}
                  required
                />
                <Input
                  label="CONFIRM PASSWORD"
                  type="password"
                  placeholder="••••••••"
                  value={studentForm.confirmPassword}
                  onChange={(e) => {
                    setStudentForm({ ...studentForm, confirmPassword: e.target.value });
                    if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                  }}
                  icon={Lock}
                  error={errors.confirmPassword}
                  required
                />
              </div>
            </>
          ) : (
            <>
              <Input
                label="FULL FACULTY NAME (WITH TITLE)"
                placeholder="e.g. Dr. Jane Smith"
                value={facultyForm.name}
                onChange={(e) => {
                  setFacultyForm({ ...facultyForm, name: e.target.value });
                  if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                icon={User}
                error={errors.name}
                autoFocus
                required
              />

              <Input
                label="FACULTY / EMPLOYEE IDENTIFIER"
                placeholder="e.g. FAC-9201"
                value={facultyForm.facultyId}
                onChange={(e) => {
                  setFacultyForm({ ...facultyForm, facultyId: e.target.value });
                  if (errors.facultyId) setErrors((prev) => ({ ...prev, facultyId: undefined }));
                }}
                icon={FileText}
                error={errors.facultyId}
                required
              />

              <Input
                label="CAMPUS INSTITUTIONAL EMAIL (.edu)"
                type="email"
                placeholder="faculty.name@campus.edu"
                value={facultyForm.email}
                onChange={(e) => {
                  setFacultyForm({ ...facultyForm, email: e.target.value });
                  if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                }}
                icon={Mail}
                error={errors.email}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="PASSWORD (8+ CHARS)"
                  type="password"
                  placeholder="••••••••"
                  value={facultyForm.password}
                  onChange={(e) => {
                    setFacultyForm({ ...facultyForm, password: e.target.value });
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  icon={Lock}
                  error={errors.password}
                  required
                />
                <Input
                  label="CONFIRM PASSWORD"
                  type="password"
                  placeholder="••••••••"
                  value={facultyForm.confirmPassword}
                  onChange={(e) => {
                    setFacultyForm({ ...facultyForm, confirmPassword: e.target.value });
                    if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                  }}
                  icon={Lock}
                  error={errors.confirmPassword}
                  required
                />
              </div>
            </>
          )}

          <div className="flex items-center gap-3 pt-2 font-mono">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setStep(1)}
              icon={ArrowLeft}
              className="flex-1"
            >
              [ ← CHANGE ROLE ]
            </Button>
            <Button
              type="submit"
              variant="danger"
              size="md"
              isLoading={isSubmitting}
              icon={ArrowRight}
              iconPosition="right"
              className="flex-1"
            >
              [ INITIALIZE ACCOUNT → ]
            </Button>
          </div>
        </form>
      )}

      {/* Login redirect */}
      <p className="text-xs font-mono text-ink/70 text-center pt-2">
        Already registered?{' '}
        <Link to="/login" className="text-brutal-red hover:underline font-bold uppercase tracking-wider ml-1">
          [ SIGN IN HERE ]
        </Link>
      </p>
    </div>
  );
}
