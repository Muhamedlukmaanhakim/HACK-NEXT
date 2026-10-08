import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, KeyRound, Cpu } from 'lucide-react';
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
        message: 'Welcome back to CollabMatrix console.',
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
        message: 'Authenticated with campus Google workspace.',
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
      message: `A simulated recovery token was sent to ${forgotEmail}.`,
    });
    setForgotEmail('');
  };

  return (
    <div className="space-y-5 font-mono">
      <div>
        <div className="text-[10px] text-retro-muted uppercase tracking-widest mb-1">
          [ AUTH // CONSOLE_SIGN_IN ]
        </div>
        <h1 className="text-xl sm:text-2xl font-display font-bold text-retro-paper uppercase tracking-wide">
          Operator Authentication
        </h1>
        <p className="text-xs text-retro-muted font-sans mt-0.5">
          Sign in to access your collaboration console and team telemetry.
        </p>
      </div>

      {/* Demo Login Quick Shortcut Banner */}
      <div className="p-3.5 rounded-none bg-retro-surface-elevated border border-retro-orange/60 flex items-center justify-between gap-3 shadow-panel">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-none bg-retro-surface border border-retro-orange text-retro-orange">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-bold text-retro-paper">HACKATHON DEMO MODE</p>
            <p className="text-[10px] text-retro-muted">Instant 1-click access as Lukmaan Hakim</p>
          </div>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={handleDemoLogin}
          isLoading={isSubmitting}
        >
          [ DEMO LOGIN ]
        </Button>
      </div>

      {errors.form && (
        <div className="p-2.5 rounded-none bg-retro-red/10 border border-retro-red/40 text-xs text-retro-red">
          [ERR: {errors.form}]
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
          <div className="flex justify-end mt-1">
            <button
              type="button"
              onClick={() => setForgotModalOpen(true)}
              className="text-[11px] text-retro-muted hover:text-retro-amber transition-colors uppercase tracking-wider"
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
          Sign In
        </Button>
      </form>

      {/* Divider */}
      <div className="relative flex items-center justify-center">
        <div className="border-t border-retro-border w-full" />
        <span className="bg-retro-bg px-3 text-[10px] text-retro-muted uppercase tracking-widest relative">
          // OR //
        </span>
      </div>

      {/* Google Simulated OAuth */}
      <Button
        variant="secondary"
        size="md"
        className="w-full font-mono text-xs"
        onClick={handleGoogleLogin}
      >
        Continue with Campus Google
      </Button>

      {/* Register redirect */}
      <p className="text-xs text-retro-muted text-center pt-2">
        New operator?{' '}
        <Link to="/register" className="text-retro-orange hover:text-retro-amber font-bold transition-colors uppercase tracking-wider">
          Create Account
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
              Send Recovery Token
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
