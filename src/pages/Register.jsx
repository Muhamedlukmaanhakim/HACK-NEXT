import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Full name is required.';
    }
    if (!formData.email.trim()) {
      errs.email = 'College email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errs.email = 'Please provide a valid college email format.';
    }
    if (!formData.password) {
      errs.password = 'Password is required.';
    } else if (formData.password.length < 8) {
      errs.password = 'Password must be at least 8 characters.';
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      addToast({
        type: 'success',
        title: 'Account Registered',
        message: 'Welcome! Initializing onboarding sequence...',
      });
      navigate('/onboarding');
    } catch (err) {
      setErrors({ form: err.message || 'Failed to register account.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 font-mono">
      <div>
        <div className="text-[10px] text-retro-muted uppercase tracking-widest mb-1">
          [ AUTH // OPERATOR_REGISTRATION ]
        </div>
        <h1 className="text-xl sm:text-2xl font-display font-bold text-retro-paper uppercase tracking-wide">
          Register Student Account
        </h1>
        <p className="text-xs text-retro-muted font-sans mt-0.5">
          Enroll on CollabMatrix to find project partners across campus departments.
        </p>
      </div>

      {errors.form && (
        <div className="p-2.5 rounded-none bg-retro-red/10 border border-retro-red/40 text-xs text-retro-red">
          [ERR: {errors.form}]
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          placeholder="Lukmaan Hakim"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          icon={User}
          error={errors.name}
          required
        />

        <Input
          label="College Email"
          type="email"
          placeholder="your.name@campus.edu"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          icon={Mail}
          error={errors.email}
          required
        />

        <Input
          label="Password (min 8 chars)"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          icon={Lock}
          error={errors.password}
          required
        />

        <Input
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          value={formData.confirmPassword}
          onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          icon={Lock}
          error={errors.confirmPassword}
          required
        />

        <Button
          type="submit"
          variant="primary"
          size="md"
          className="w-full"
          icon={ArrowRight}
          iconPosition="right"
          isLoading={isSubmitting}
        >
          Register & Continue
        </Button>
      </form>

      <p className="text-xs text-retro-muted text-center pt-2">
        Existing operator?{' '}
        <Link to="/login" className="text-retro-orange hover:text-retro-amber font-bold transition-colors uppercase tracking-wider">
          Sign In
        </Link>
      </p>
    </div>
  );
}
