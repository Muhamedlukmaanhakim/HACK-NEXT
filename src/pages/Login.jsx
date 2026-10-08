import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, KeyRound, ArrowRight } from 'lucide-react';
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
        title: 'Session Authenticated',
        message: 'Welcome back to CollabMatrix.',
      });
      navigate(destination, { replace: true });
    } catch (err) {
      setErrors({ form: err.message || 'Authentication rejected.' });
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
        title: 'Google Sign-In Active',
        message: 'Authenticated with Google account.',
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
        message: 'Please enter a valid campus email address.',
      });
      return;
    }
    setForgotModalOpen(false);
    addToast({
      type: 'info',
      title: 'Reset Token Dispatched',
      message: `Simulated recovery token dispatched to ${forgotEmail}.`,
    });
    setForgotEmail('');
  };

  return (
    <div className="space-y-6 font-mono">
      <div>
        <div className="text-[11px] font-mono font-bold text-ink/60 uppercase tracking-widest mb-1">
          01 / AUTHENTICATION
        </div>
        <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-ink uppercase tracking-tight">
          WELCOME BACK.
        </h1>
        <p className="text-xs text-ink/70 font-sans mt-0.5">
          Sign in to access your collaboration dashboard and active build squads.
        </p>
      </div>

      {/* Demo Login Quick Shortcut Banner */}
      <div className="p-4 border-2 border-ink bg-signal-yellow shadow-brutal-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <p className="text-xs font-display font-extrabold text-ink uppercase tracking-wider">HACKATHON DEMO MODE</p>
          <p className="text-[11px] font-mono text-ink/80">1-click instant login as Lukmaan Hakim (CSE, YR-02)</p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={handleDemoLogin}
          isLoading={isSubmitting}
          className="w-full sm:w-auto"
        >
          [ DEMO LOGIN → ]
        </Button>
      </div>

      {errors.form && (
        <div className="p-3 border-2 border-brutal-red bg-brutal-red/10 text-xs font-bold text-brutal-red">
          ERR: {errors.form}
        </div>
      )}

      {/* Standard Email/Password Form */}
      <form onSubmit={handleSubmit} className="space-y-4 font-sans">
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
          <div className="flex justify-end mt-1 font-mono">
            <button
              type="button"
              onClick={() => setForgotModalOpen(true)}
              className="text-xs text-ink/70 hover:text-brutal-red font-bold transition-colors uppercase tracking-wider"
            >
              [ Forgot password? ]
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
          [ SIGN IN → ]
        </Button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="border-t-2 border-ink w-full" />
        <span className="bg-canvas px-3 text-[10px] font-mono font-bold text-ink/60 uppercase tracking-widest relative">
          // OR //
        </span>
      </div>

      {/* Google Button */}
      <Button
        variant="secondary"
        size="md"
        className="w-full font-mono text-xs"
        onClick={handleGoogleLogin}
      >
        CONTINUE WITH YOUR GOOGLE ACCOUNT
      </Button>

      {/* Register redirect */}
      <p className="text-xs font-mono text-ink/70 text-center pt-2">
        New operator?{' '}
        <Link to="/register" className="text-brutal-red hover:underline font-bold uppercase tracking-wider ml-1">
          [ CREATE ACCOUNT ]
        </Link>
      </p>

      {/* Forgot Password Modal */}
      <Modal
        isOpen={forgotModalOpen}
        onClose={() => setForgotModalOpen(false)}
        title="Reset Access Token"
        description="We will simulate dispatching a recovery token to your registered college email."
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setForgotModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" icon={KeyRound} onClick={handleResetPassword}>
              [ Send Token ]
            </Button>
          </>
        }
      >
        <div className="space-y-4 py-2 font-sans">
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
