import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, LogIn, KeyRound } from 'lucide-react';
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

  const { login, loginWithGoogle } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const validate = () => {
    const errs = {};
    if (!email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errs.email = 'Please enter a valid campus email address.';
    }
    if (!password) {
      errs.password = 'Password is required.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSuccessfulAuth = (authenticatedUser) => {
    const intendedFrom = location.state?.from?.pathname;
    let target = '/dashboard';

    if (authenticatedUser.role === 'faculty') {
      target = intendedFrom && intendedFrom.startsWith('/faculty') ? intendedFrom : '/faculty/dashboard';
    } else {
      target = intendedFrom && !intendedFrom.startsWith('/faculty') ? intendedFrom : '/dashboard';
    }

    if (!authenticatedUser.hasCompletedOnboarding) {
      target = authenticatedUser.role === 'faculty' ? '/onboarding/faculty' : '/onboarding';
    }

    navigate(target, { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const authenticatedUser = await login(email, password);
      addToast({
        type: 'success',
        title: 'SESSION AUTHENTICATED',
        message: `Welcome back, ${authenticatedUser.name || 'Operator'} (${authenticatedUser.role.toUpperCase()}).`,
      });
      handleSuccessfulAuth(authenticatedUser);
    } catch (err) {
      setErrors({ form: err.message || 'Authentication rejected.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    try {
      const gUser = await loginWithGoogle();
      addToast({
        type: 'success',
        title: 'GOOGLE AUTHENTICATED',
        message: 'Signed in via verified Google campus identity.',
      });
      handleSuccessfulAuth(gUser);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (!forgotEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      addToast({
        type: 'error',
        title: 'INVALID EMAIL',
        message: 'Please enter a valid campus email address.',
      });
      return;
    }
    setForgotModalOpen(false);
    addToast({
      type: 'info',
      title: 'TOKEN DISPATCHED',
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
          Sign in to access your collaboration dashboard and active project squads.
        </p>
      </div>


      {errors.form && (
        <div className="p-3 border-2 border-brutal-red bg-brutal-red/10 text-xs font-bold text-brutal-red">
          ERR: {errors.form}
        </div>
      )}

      {/* Standard Email/Password Form */}
      <form onSubmit={handleSubmit} className="space-y-4 font-sans">
        <Input
          label="CAMPUS COLLEGE EMAIL"
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
            label="PASSWORD"
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
          className="w-full font-mono font-bold"
          icon={LogIn}
          isLoading={isSubmitting}
        >
          [ SIGN IN TO NODE → ]
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
        CONTINUE WITH GOOGLE CAMPUS SSO
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
        title="RESET ACCESS TOKEN"
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
