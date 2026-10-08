import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, ArrowRight, ArrowLeft, Cpu } from 'lucide-react';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import SkillSelector from '../components/skills/SkillSelector';
import { DEPARTMENTS, YEARS, INTEREST_OPTIONS, AVAILABILITY_OPTIONS, COLLABORATION_TYPES } from '../services/taxonomyService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function ChipGroup({ label, options, selected, onToggle, activeClass = 'bg-retro-orange text-retro-bg font-bold border-retro-orange' }) {
  return (
    <div className="space-y-1.5 font-mono">
      {label && <label className="text-[10px] font-mono uppercase tracking-wider text-retro-muted">{label}</label>}
      <div className="flex flex-wrap gap-1.5">
        {options.map((opt) => {
          const isSelected = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              className={`px-2.5 py-1 rounded-none text-xs font-mono uppercase tracking-wider border transition-all ${
                isSelected
                  ? activeClass
                  : 'bg-retro-surface-elevated text-retro-paper/70 border-retro-border hover:border-retro-orange/60 hover:text-retro-paper'
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
      title: 'Profile Calibrated',
      message: 'Your campus collaboration dossier is now active!',
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
    <div className="min-h-screen bg-retro-bg text-retro-paper py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center bg-retro-grid font-mono">
      <div className="max-w-2xl w-full bg-retro-surface border border-retro-border-strong rounded-none p-6 sm:p-9 shadow-terminal space-y-6 animate-fade-in relative">
        {/* Step Telemetry */}
        <div className="space-y-2 border-b border-retro-border pb-4">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-retro-orange uppercase tracking-wider font-bold">
              [ SEQUENCE // STEP 0{step} OF 05 ]
            </span>
            <span className="text-retro-muted uppercase">
              {['Basic Credentials', 'Competency Matrix', 'Domain Vectors', 'Schedule & Protocols', 'Calibrated'][step - 1]}
            </span>
          </div>
          <ProgressBar value={step} max={5} variant="orange" size="sm" />
        </div>

        {stepErrors && (
          <div className="p-3 rounded-none bg-retro-red/10 border border-retro-red/40 text-xs text-retro-red font-mono">
            [ERR: {stepErrors}]
          </div>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4 animate-slide-up">
            <div className="text-[10px] text-retro-muted uppercase tracking-widest">// STAGE 01: OPERATOR DETAILS</div>
            <h2 className="text-lg sm:text-xl font-display font-bold text-retro-paper uppercase">Operator Identity</h2>
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
              label="Biographical Summary"
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
            <div className="text-[10px] text-retro-muted uppercase tracking-widest">// STAGE 02: SKILL CALIBRATION</div>
            <h2 className="text-lg sm:text-xl font-display font-bold text-retro-paper uppercase">Registered Competencies</h2>
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
            <div className="text-[10px] text-retro-muted uppercase tracking-widest">// STAGE 03: DOMAIN VECTORS</div>
            <h2 className="text-lg sm:text-xl font-display font-bold text-retro-paper uppercase">Project Interests</h2>
            <ChipGroup
              options={INTEREST_OPTIONS}
              selected={formData.interests}
              onToggle={(item) => toggleArrayItem('interests', item)}
            />
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div className="space-y-4 animate-slide-up">
            <div className="text-[10px] text-retro-muted uppercase tracking-widest">// STAGE 04: SCHEDULE PROTOCOLS</div>
            <h2 className="text-lg sm:text-xl font-display font-bold text-retro-paper uppercase">Availability & Formats</h2>
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
            />
          </div>
        )}

        {/* Step 5 */}
        {step === 5 && (
          <div className="text-center py-6 space-y-4 animate-slide-up">
            <div className="w-12 h-12 rounded-none bg-retro-teal/15 border border-retro-teal text-retro-teal flex items-center justify-center mx-auto">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div className="text-[10px] text-retro-muted uppercase tracking-widest">[ SYSTEM // CALIBRATION_COMPLETE ]</div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-retro-paper uppercase">
              CollabMatrix Dossier Initialized
            </h2>
            <p className="text-xs sm:text-sm text-retro-muted font-sans max-w-md mx-auto leading-relaxed">
              Your compatibility vector has been registered on the campus collaboration grid. You can now discover matching students, post opportunities, and run team gap analyses.
            </p>
          </div>
        )}

        <div className="pt-4 border-t border-retro-border flex items-center justify-between gap-3">
          {step > 1 && step < 5 ? (
            <Button variant="outline" size="md" icon={ArrowLeft} onClick={handleBack}>
              Back
            </Button>
          ) : <div />}

          {step < 5 ? (
            <Button variant="primary" size="md" icon={ArrowRight} iconPosition="right" onClick={handleNext}>
              Next Stage
            </Button>
          ) : (
            <Button variant="primary" size="lg" icon={Cpu} iconPosition="right" onClick={handleFinish} className="w-full sm:w-auto">
              Access Dashboard Console
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
