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

function ChipGroup({ label, options, selected, onToggle }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink/70">{label}</label>}
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const isSelected = selected.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onToggle(opt)}
              className={`px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider border-2 border-ink transition-all ${
                isSelected
                  ? 'bg-ink text-canvas shadow-brutal-sm'
                  : 'bg-white text-ink hover:bg-canvas'
              }`}
            >
              [ {opt} ]
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
      title: 'PROFILE ACTIVATED',
      message: 'Your campus collaboration dossier is now live!',
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
    <div className="min-h-screen bg-canvas text-ink py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white border-3 border-ink p-6 sm:p-9 shadow-brutal-xl space-y-6">
        {/* Step Telemetry */}
        <div className="space-y-3 border-b-2 border-ink pb-4">
          <div className="flex items-center justify-between text-xs font-mono font-bold">
            <span className="text-brutal-red uppercase tracking-wider">
              0{step} / 05 // INITIAL ONBOARDING
            </span>
            <span className="text-ink/60 uppercase">
              {['Basic Credentials', 'Competency Matrix', 'Domain Vectors', 'Schedule & Protocols', 'Calibrated'][step - 1]}
            </span>
          </div>
          <ProgressBar value={step} max={5} variant="coral" size="sm" />
        </div>

        {stepErrors && (
          <div className="p-3 bg-canvas border-2 border-brutal-red text-xs font-mono font-bold text-brutal-red">
            ERROR: {stepErrors}
          </div>
        )}

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-brutal-red">STAGE 01: IDENTITY</div>
            <h2 className="text-2xl font-display font-black text-ink uppercase">Operator Identity</h2>
            <Input
              label="FULL NAME"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="DEPARTMENT"
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                options={DEPARTMENTS}
                required
              />
              <Select
                label="YEAR OF STUDY"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                options={YEARS}
                required
              />
            </div>
            <Textarea
              label="BIOGRAPHICAL SUMMARY"
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
          <div className="space-y-4">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-brutal-red">STAGE 02: SKILLS</div>
            <h2 className="text-2xl font-display font-black text-ink uppercase">Registered Competencies</h2>
            <SkillSelector
              selectedSkills={formData.skills}
              onChange={(newSkills) => setFormData({ ...formData, skills: newSkills })}
              placeholder="Search or select skills..."
            />
          </div>
        )}

        {/* Step 3 */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-brutal-red">STAGE 03: DOMAINS</div>
            <h2 className="text-2xl font-display font-black text-ink uppercase">Project Interests</h2>
            <ChipGroup
              options={INTEREST_OPTIONS}
              selected={formData.interests}
              onToggle={(item) => toggleArrayItem('interests', item)}
            />
          </div>
        )}

        {/* Step 4 */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-brutal-red">STAGE 04: SCHEDULE</div>
            <h2 className="text-2xl font-display font-black text-ink uppercase">Availability & Formats</h2>
            <ChipGroup
              label="COLLABORATION FORMATS"
              options={COLLABORATION_TYPES}
              selected={formData.preferences}
              onToggle={(item) => toggleArrayItem('preferences', item)}
            />
            <ChipGroup
              label="AVAILABILITY WINDOWS"
              options={AVAILABILITY_OPTIONS}
              selected={formData.availability}
              onToggle={(item) => toggleArrayItem('availability', item)}
            />
          </div>
        )}

        {/* Step 5 */}
        {step === 5 && (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-campus-green border-2 border-ink flex items-center justify-center mx-auto shadow-brutal-sm">
              <CheckSquare className="w-8 h-8 text-ink stroke-[2.5]" />
            </div>
            <h2 className="text-3xl font-display font-black text-ink uppercase">
              DOSSIER INITIALIZED
            </h2>
            <p className="text-xs sm:text-sm font-sans text-ink/80 max-w-md mx-auto leading-relaxed">
              Your profile is now registered on the campus collaboration network. You can discover teammates, post projects, and analyze team gaps.
            </p>
          </div>
        )}

        <div className="pt-4 border-t-2 border-ink flex items-center justify-between gap-3">
          {step > 1 && step < 5 ? (
            <Button variant="outline" size="md" icon={ArrowLeft} onClick={handleBack} className="text-xs font-bold">
              BACK
            </Button>
          ) : <div />}

          {step < 5 ? (
            <Button variant="primary" size="md" icon={ArrowRight} iconPosition="right" onClick={handleNext} className="text-xs font-bold">
              NEXT STAGE →
            </Button>
          ) : (
            <Button variant="danger" size="lg" icon={Cpu} iconPosition="right" onClick={handleFinish} className="w-full sm:w-auto text-xs font-bold">
              ENTER DASHBOARD →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
