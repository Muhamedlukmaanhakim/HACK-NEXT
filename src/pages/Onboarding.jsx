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

const SEMESTERS = [
  'Semester 1', 'Semester 2', 'Semester 3', 'Semester 4',
  'Semester 5', 'Semester 6', 'Semester 7', 'Semester 8',
];

function ChipGroup({ label, options, selected = [], onToggle }) {
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
              [ {isSelected ? '✓ ' : ''}{opt} ]
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

  // Controlled form state initialized strictly from actual user data, NEVER hardcoded mock defaults
  const [formData, setFormData] = useState({
    name: user?.name || '',
    rollNo: user?.rollNo || '',
    department: user?.department || '',
    year: user?.year || '',
    semester: user?.semester || '',
    domain: user?.domain || '',
    bio: user?.bio || '',
    skills: user?.skills || [],
    interests: user?.interests || [],
    availability: user?.availability || [],
    preferences: user?.preferences || [],
  });

  const [stepErrors, setStepErrors] = useState('');

  const validateStep = (currentStep) => {
    setStepErrors('');
    if (currentStep === 1) {
      if (!formData.name.trim()) {
        setStepErrors('Full name is required.');
        return false;
      }
      if (!formData.department) {
        setStepErrors('Please select your academic department.');
        return false;
      }
      if (!formData.year) {
        setStepErrors('Please select your year of study.');
        return false;
      }
      if (!formData.semester) {
        setStepErrors('Please select your current semester.');
        return false;
      }
    }
    if (currentStep === 2) {
      if (!formData.skills || formData.skills.length === 0) {
        setStepErrors('Please explicitly register at least one skill or capability.');
        return false;
      }
    }
    if (currentStep === 3) {
      if (!formData.interests || formData.interests.length === 0) {
        setStepErrors('Please choose at least one project interest area.');
        return false;
      }
    }
    if (currentStep === 4) {
      if (!formData.availability || formData.availability.length === 0) {
        setStepErrors('Please declare your available sprint schedule.');
        return false;
      }
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
      message: 'Your campus student profile has been calibrated and saved.',
    });
    navigate('/dashboard');
  };

  const toggleArrayItem = (field, item) => {
    const list = formData[field] || [];
    setFormData({
      ...formData,
      [field]: list.includes(item) ? list.filter((x) => x !== item) : [...list, item],
    });
    setStepErrors('');
  };

  return (
    <div className="min-h-screen bg-canvas text-ink py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-2xl w-full bg-white border-3 border-ink p-6 sm:p-9 shadow-brutal-xl space-y-6">
        {/* Step Telemetry */}
        <div className="space-y-3 border-b-2 border-ink pb-4">
          <div className="flex items-center justify-between text-xs font-mono font-bold">
            <span className="text-brutal-red uppercase tracking-wider">
              0{step} / 05 // STUDENT ONBOARDING
            </span>
            <span className="text-ink/60 uppercase">
              {['Academic Profile', 'Registered Skills', 'Interest Vectors', 'Availability Schedule', 'Dossier Ready'][step - 1]}
            </span>
          </div>
          <ProgressBar value={step} max={5} variant="coral" size="sm" />
        </div>

        {stepErrors && (
          <div className="p-3 bg-canvas border-2 border-brutal-red text-xs font-mono font-bold text-brutal-red">
            ERROR: {stepErrors}
          </div>
        )}

        {/* Step 1: Academic Credentials */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-brutal-red">STAGE 01: ACADEMIC CREDENTIALS</div>
            <h2 className="text-2xl font-display font-black text-ink uppercase">Academic Profile</h2>
            <p className="text-xs text-ink/70 font-sans">
              Provide your campus credentials. No department or year is preselected.
            </p>

            <Input
              label="FULL NAME"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <Input
              label="COLLEGE ROLL NUMBER"
              value={formData.rollNo}
              placeholder="e.g. 24CSE-1029"
              onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
              helperText="Campus registry student identifier"
            />

            <Select
              label="DEPARTMENT"
              value={formData.department}
              placeholder="[ SELECT YOUR DEPARTMENT ]"
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              options={DEPARTMENTS}
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="YEAR OF STUDY"
                value={formData.year}
                placeholder="[ SELECT YEAR ]"
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                options={YEARS}
                required
              />
              <Select
                label="SEMESTER"
                value={formData.semester}
                placeholder="[ SELECT SEMESTER ]"
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                options={SEMESTERS}
                required
              />
            </div>

            <Textarea
              label="BIOGRAPHICAL SUMMARY / INTEREST STATEMENT"
              rows={3}
              maxLength={250}
              placeholder="What problems do you care about solving? What kinds of projects do you want to build?"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
          </div>
        )}

        {/* Step 2: Skills */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-brutal-red">STAGE 02: SKILLS</div>
            <h2 className="text-2xl font-display font-black text-ink uppercase">Registered Competencies</h2>
            <p className="text-xs text-ink/70 font-sans">
              Explicitly choose skills you can demonstrate. You can later attach project links, code, or certificates to earn verified status.
            </p>
            <SkillSelector
              selectedSkills={formData.skills}
              onChange={(newSkills) => setFormData({ ...formData, skills: newSkills })}
              placeholder="Search or select skills..."
            />
          </div>
        )}

        {/* Step 3: Domain Interests */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-brutal-red">STAGE 03: DOMAIN INTERESTS</div>
            <h2 className="text-2xl font-display font-black text-ink uppercase">Project Interests</h2>
            <p className="text-xs text-ink/70 font-sans">
              Select the problem spaces and domains that interest you.
            </p>
            <ChipGroup
              options={INTEREST_OPTIONS}
              selected={formData.interests}
              onToggle={(item) => toggleArrayItem('interests', item)}
            />
          </div>
        )}

        {/* Step 4: Availability */}
        {step === 4 && (
          <div className="space-y-4">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-brutal-red">STAGE 04: AVAILABILITY & PROTOCOLS</div>
            <h2 className="text-2xl font-display font-black text-ink uppercase">Availability & Collaboration Formats</h2>
            <ChipGroup
              label="COLLABORATION PREFERENCES"
              options={COLLABORATION_TYPES}
              selected={formData.preferences}
              onToggle={(item) => toggleArrayItem('preferences', item)}
            />
            <ChipGroup
              label="STATED AVAILABILITY WINDOWS"
              options={AVAILABILITY_OPTIONS}
              selected={formData.availability}
              onToggle={(item) => toggleArrayItem('availability', item)}
            />
          </div>
        )}

        {/* Step 5: Complete */}
        {step === 5 && (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-campus-green border-2 border-ink flex items-center justify-center mx-auto shadow-brutal-sm">
              <CheckSquare className="w-8 h-8 text-ink stroke-[2.5]" />
            </div>
            <h2 className="text-3xl font-display font-black text-ink uppercase">
              STUDENT DOSSIER READY
            </h2>
            <div className="max-w-md mx-auto p-4 border-2 border-ink bg-canvas font-mono text-left text-xs space-y-1.5 shadow-brutal-sm">
              <div><strong>OPERATOR:</strong> {formData.name} ({formData.rollNo || 'ID PENDING'})</div>
              <div><strong>DEPARTMENT:</strong> {formData.department} // {formData.year}</div>
              <div><strong>SKILLS:</strong> {formData.skills.join(', ')}</div>
              <div><strong>AVAILABILITY:</strong> {formData.availability.join(', ')}</div>
            </div>
            <p className="text-xs sm:text-sm font-sans text-ink/80 max-w-md mx-auto leading-relaxed">
              Your profile is registered without fabricated scores. You can now discover teammates, initiate Trial Sprints, and log verified contributions.
            </p>
          </div>
        )}

        <div className="pt-4 border-t-2 border-ink flex items-center justify-between gap-3">
          {step > 1 && step < 5 ? (
            <Button variant="outline" size="md" icon={ArrowLeft} onClick={handleBack} className="text-xs font-bold font-mono">
              [ BACK ]
            </Button>
          ) : <div />}

          {step < 5 ? (
            <Button variant="primary" size="md" icon={ArrowRight} iconPosition="right" onClick={handleNext} className="text-xs font-bold font-mono">
              [ NEXT STAGE → ]
            </Button>
          ) : (
            <Button variant="danger" size="lg" icon={Cpu} iconPosition="right" onClick={handleFinish} className="w-full sm:w-auto text-xs font-bold font-mono">
              [ ENTER STUDENT DASHBOARD → ]
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
