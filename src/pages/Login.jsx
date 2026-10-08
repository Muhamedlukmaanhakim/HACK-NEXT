import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Sparkles, LogIn, KeyRound } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');

  const { login, loginAsDemo, loginWithGoogle } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const destination = location.state?.from?.pathname || '/dashboard';

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!password) {
      errs.password = 'Password is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await login(email, password);
      addToast({
        type: 'success',
        title: 'Welcome back!',
        message: 'Successfully authenticated session.',
      });
      navigate(destination, { replace: true });
    } catch (err) {
      setErrors({ form: err.message || 'Failed to authenticate.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = async () => {
    setIsSubmitting(true);
    try {
      await loginAsDemo();
      addToast({
        type: 'success',
        title: 'Demo Session Active',
        message: 'Signed in as Lukmaan Hakim (CSE, 2nd Year).',
      });
      navigate('/dashboard', { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
      addToast({
        type: 'success',
        title: 'Google Sign-In',
        message: 'Successfully authenticated with campus Google workspace.',
      });
      navigate('/dashboard', { replace: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!forgotEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      addToast({
        type: 'error',
        title: 'Invalid Email',
        message: 'Please enter a valid campus email to receive the password reset token.',
      });
      return;
    }
    setForgotModalOpen(false);
    addToast({
      type: 'info',
      title: 'Reset Link Dispatched',
      message: `A simulated password reset email has been sent to ${forgotEmail}.`,
    });
    setForgotEmail('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary tracking-tight">
          Welcome to CollabMatrix
        </h1>
        <p className="text-xs text-text-secondary mt-1">
          Sign in to access your campus teams and project matches.
        </p>
      </div>

      {/* Demo Login Quick Shortcut Banner */}
      <div className="p-4 rounded-xl bg-accent-indigo/15 border border-accent-indigo/30 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-accent-indigo text-white">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold text-text-primary">Hackathon Demo Mode</p>
            <p className="text-[11px] text-text-secondary">Instant 1-click login as Lukmaan Hakim</p>
          </div>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={handleDemoLogin}
          isLoading={isSubmitting}
        >
          Demo Login
        </Button>
      </div>

      {errors.form && (
        <div className="p-3 rounded-xl bg-status-danger/10 border border-status-danger/30 text-xs text-status-danger">
          {errors.form}
        </div>
      )}

      {/* Standard Email/Password Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="College Email"
          type="email"
          placeholder="your.name@campus.edu"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
          }}
          icon={Mail}
          error={errors.email}
          required
        />

        <div>
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
            }}
            icon={Lock}
            error={errors.password}
            required
          />
          <div className="flex justify-end mt-1.5">
            <button
              type="button"
              onClick={() => setForgotModalOpen(true)}
              className="text-xs text-text-muted hover:text-accent-indigo transition-colors"
            >
              Forgot password?
            </button>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full"
          icon={LogIn}
          isLoading={isSubmitting}
        >
          Sign In
        </Button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="border-t border-surface-border w-full" />
        <span className="bg-background px-3 text-[11px] text-text-muted uppercase tracking-wider relative">
          or
        </span>
      </div>

      {/* Google Simulated OAuth */}
      <Button
        variant="secondary"
        size="md"
        className="w-full"
        onClick={handleGoogleLogin}
      >
        <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        Continue with Google
      </Button>

      {/* Register redirect */}
      <p className="text-xs text-text-muted text-center pt-2">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="text-accent-indigo hover:text-accent-violet font-semibold transition-colors">
          Create account
        </Link>
      </p>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Reset Password"
        description="We'll simulate dispatching a recovery token to your registered college email."
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setForgotModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" icon={KeyRound} onClick={handleResetPassword}>
              Send Reset Link
            </Button>
          </>
        }
      >
        <div className="space-y-4 py-2">
          <Input
            label="College Email"
            type="email"
            placeholder="your.email@campus.edu"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            icon={Mail}
          />
        </div>
      </Modal>
    </div>
  );
}
