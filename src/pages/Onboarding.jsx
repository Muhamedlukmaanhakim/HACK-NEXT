import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import SkillSelector from '../components/skills/SkillSelector';
import { DEPARTMENTS, YEARS, INTEREST_OPTIONS, AVAILABILITY_OPTIONS, COLLABORATION_TYPES } from '../services/taxonomyService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function ChipGroup({ label, options, selected, onToggle, activeClass = 'bg-accent-indigo text-white border-accent-indigo' }) {
  return (
    <div className="space-y-2">
      {label && <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">{label}</label>}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                isSelected
                  ? activeClass
                  : 'bg-surface-elevated text-text-secondary border-surface-border hover:border-surface-border-hover'
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const { user, completeOnboarding } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || 'Lukmaan Hakim',
    department: user?.department || 'Computer Science (CSE)',
    year: user?.year || '2nd Year',
    bio: user?.bio || 'AI researcher and systems developer passionate about building predictive diagnostics and intelligent healthcare pipelines.',
    skills: user?.skills?.length ? user.skills : ['Python', 'AI/ML'],
    interests: user?.interests?.length ? user.interests : ['Healthcare & MedTech', 'AI & Machine Learning'],
    availability: user?.availability?.length ? user.availability : ['Weekends'],
    preferences: user?.preferences?.length ? user.preferences : ['Hackathon', 'Project'],
  });

  const [stepErrors, setStepErrors] = useState('');

  const validateStep = (currentStep) => {
    setStepErrors('');
    if (currentStep === 1 && (!formData.name.trim() || !formData.department || !formData.year)) {
      setStepErrors('Please complete all basic information fields.');
      return false;
    }
    if (currentStep === 2 && (!formData.skills || formData.skills.length === 0)) {
      setStepErrors('Please select at least one skill to continue.');
      return false;
    }
    if (currentStep === 3 && (!formData.interests || formData.interests.length === 0)) {
      setStepErrors('Please select at least one domain interest.');
      return false;
    }
    if (currentStep === 4 && (!formData.availability || formData.availability.length === 0)) {
      setStepErrors('Please choose your availability schedule.');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep((prev) => Math.min(5, prev + 1));
  };

  const handleBack = () => {
    setStepErrors('');
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleFinish = async () => {
    await completeOnboarding(formData);
    addToast({
      type: 'success',
      title: 'Profile Ready',
      message: 'Your campus collaboration profile is now active!',
    });
    navigate('/dashboard');
  };

  const toggleArrayItem = (field, item) => {
    const list = formData[field] || [];
    setFormData({
      ...formData,
      [field]: list.includes(item) ? list.filter((x) => x !== item) : [...list, item],
    });
  };

  return (
    <div className="min-h-screen bg-background text-text-primary py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-surface border border-surface-border rounded-3xl p-6 sm:p-10 shadow-elevated space-y-7 animate-fade-in">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-accent-teal">
              Step {step} of 5
            </span>
            <span className="text-xs text-text-muted">
              {['Basic Information', 'Skill Matrix', 'Domain Interests', 'Preferences & Availability', 'Complete'][step - 1]}
            </span>
          </div>
          <ProgressBar value={step} max={5} variant="teal" size="sm" />
        </div>

        {stepErrors && (
          <div className="p-3 rounded-xl bg-status-danger/10 border border-status-danger/30 text-xs text-status-danger">
            {stepErrors}
          </div>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4 animate-slide-up">
            <h2 className="text-xl font-bold text-text-primary">Tell us about yourself</h2>
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="Department"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                options={DEPARTMENTS}
                required
              />
              <Select
                label="Year of Study"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                options={YEARS}
                required
              />
            </div>
            <Textarea
              label="Short Bio"
              rows={3}
              maxLength={200}
              placeholder="What problems excite you? What projects do you want to build?"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-4 animate-slide-up">
            <h2 className="text-xl font-bold text-text-primary">What are your core skills?</h2>
            <SkillSelector
              selectedSkills={formData.skills}
              onChange={(newSkills) => setFormData({ ...formData, skills: newSkills })}
              placeholder="Search or select skills..."
            />
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-4 animate-slide-up">
            <h2 className="text-xl font-bold text-text-primary">What domains interest you most?</h2>
            <ChipGroup
              options={INTEREST_OPTIONS}
              selected={formData.interests}
              onToggle={(item) => toggleArrayItem('interests', item)}
              activeClass="bg-accent-teal/20 text-accent-teal border-accent-teal shadow-glow-teal"
            />
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div className="space-y-5 animate-slide-up">
            <h2 className="text-xl font-bold text-text-primary">Preferences & Availability</h2>
            <ChipGroup
              label="Collaboration Formats"
              options={COLLABORATION_TYPES}
              selected={formData.preferences}
              onToggle={(item) => toggleArrayItem('preferences', item)}
            />
            <ChipGroup
              label="Availability Windows"
              options={AVAILABILITY_OPTIONS}
              selected={formData.availability}
              onToggle={(item) => toggleArrayItem('availability', item)}
              activeClass="bg-accent-teal/20 text-accent-teal border-accent-teal"
            />
          </div>
        )}

        {/* Step 5 */}
        {step === 5 && (
          <div className="text-center py-6 space-y-4 animate-slide-up">
            <div className="w-14 h-14 rounded-2xl bg-status-success/15 border border-status-success/30 flex items-center justify-center text-status-success mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary">Your CollabMatrix profile is ready!</h2>
            <p className="text-xs sm:text-sm text-text-secondary max-w-md mx-auto leading-relaxed">
              We&apos;ve initialized your matching vector. You can now discover matching students, post opportunities, and run team gap analyses.
            </p>
          </div>
        )}

        <div className="pt-5 border-t border-surface-border flex items-center justify-between gap-3">
          {step > 1 && step < 5 ? (
            <Button variant="outline" size="md" icon={ArrowLeft} onClick={handleBack}>
              Back
            </Button>
          ) : <div />}

          {step < 5 ? (
            <Button variant="primary" size="md" icon={ArrowRight} iconPosition="right" onClick={handleNext}>
              Next Step
            </Button>
          ) : (
            <Button variant="primary" size="lg" icon={Sparkles} iconPosition="right" onClick={handleFinish} className="w-full sm:w-auto">
              Go to Dashboard
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
