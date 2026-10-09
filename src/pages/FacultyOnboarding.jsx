import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckSquare, ArrowRight, ArrowLeft, Building, Cpu } from 'lucide-react';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import { DEPARTMENTS, INTEREST_OPTIONS } from '../services/taxonomyService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const FACULTY_DESIGNATIONS = [
  'Professor & Department Head',
  'Professor & Lab Director',
  'Associate Professor',
  'Assistant Professor',
  'Adjunct Professor',
  'Research Scientist & Fellow',
  'Dean / Academic Director',
];

const MENTORING_SPECIALTIES = [
  'Capstone Project Supervision',
  'Research Paper Publishing',
  'Hackathon & Competition Strategy',
  'Industry Grant Applications',
  'Patent & IP Filing',
  'Startup Mentorship & Incubation',
  'Peer Code & Architecture Review',
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

export default function FacultyOnboarding() {
  const [step, setStep] = useState(1);
  const { user, completeOnboarding } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Controlled form state initialized strictly from actual user data, NEVER hardcoded mock defaults
  const [formData, setFormData] = useState({
    name: user?.name || '',
    facultyId: user?.facultyId || '',
    department: user?.department || '',
    designation: user?.designation || '',
    expertise: user?.expertise || '',
    officeLocation: user?.officeLocation || '',
    officeHours: user?.officeHours || '',
    bio: user?.bio || '',
    researchInterests: user?.researchInterests || [],
    mentoringAreas: user?.mentoringAreas || [],
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
      if (!formData.designation) {
        setStepErrors('Please select your institutional designation.');
        return false;
      }
    }
    if (currentStep === 2) {
      if (!formData.expertise.trim()) {
        setStepErrors('Please specify your primary area of research expertise.');
        return false;
      }
      if (!formData.researchInterests || formData.researchInterests.length === 0) {
        setStepErrors('Please select at least one research interest area.');
        return false;
      }
    }
    if (currentStep === 3) {
      if (!formData.mentoringAreas || formData.mentoringAreas.length === 0) {
        setStepErrors('Please select at least one mentoring area.');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) setStep((prev) => Math.min(4, prev + 1));
  };

  const handleBack = () => {
    setStepErrors('');
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleFinish = async () => {
    await completeOnboarding(formData);
    addToast({
      type: 'success',
      title: 'FACULTY DOSSIER ACTIVATED',
      message: 'Your faculty node is now live on CollabMatrix.',
    });
    navigate('/faculty/dashboard');
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
              0{step} / 04 // FACULTY ONBOARDING
            </span>
            <span className="text-ink/60 uppercase">
              {['Institutional Profile', 'Research Vectors', 'Mentorship & Advising', 'Faculty Clearance'][step - 1]}
            </span>
          </div>
          <ProgressBar value={step} max={4} variant="coral" size="sm" />
        </div>

        {stepErrors && (
          <div className="p-3 bg-canvas border-2 border-brutal-red text-xs font-mono font-bold text-brutal-red">
            ERROR: {stepErrors}
          </div>
        )}

        {/* Step 1: Institutional Credentials */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-brutal-red">STAGE 01: INSTITUTIONAL PROFILE</div>
            <h2 className="text-2xl font-display font-black text-ink uppercase">Professional Credentials</h2>
            <p className="text-xs text-ink/70 font-sans">
              Provide your official departmental appointment information.
            </p>

            <Input
              label="FULL FACULTY NAME (WITH TITLE)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <Input
              label="FACULTY EMPLOYEE ID"
              value={formData.facultyId}
              placeholder="e.g. FAC-8021"
              onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
              helperText="Institutional employee identification code"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="DEPARTMENT / SCHOOL"
                value={formData.department}
                placeholder="[ SELECT DEPARTMENT ]"
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                options={DEPARTMENTS}
                required
              />
              <Select
                label="DESIGNATION / TITLE"
                value={formData.designation}
                placeholder="[ SELECT DESIGNATION ]"
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                options={FACULTY_DESIGNATIONS}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="LAB / OFFICE LOCATION"
                value={formData.officeLocation}
                placeholder="e.g. Turing Hall, Room 412"
                onChange={(e) => setFormData({ ...formData, officeLocation: e.target.value })}
              />
              <Input
                label="STUDENT OFFICE HOURS"
                value={formData.officeHours}
                placeholder="e.g. Tuesdays, 3-5 PM"
                onChange={(e) => setFormData({ ...formData, officeHours: e.target.value })}
              />
            </div>
          </div>
        )}

        {/* Step 2: Research Vectors */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-brutal-red">STAGE 02: RESEARCH EXPERTISE</div>
            <h2 className="text-2xl font-display font-black text-ink uppercase">Domain Expertise</h2>
            <p className="text-xs text-ink/70 font-sans">
              Outline your focus areas to match with student research initiatives and lab project requests.
            </p>

            <Input
              label="PRIMARY RESEARCH FOCUS"
              value={formData.expertise}
              placeholder="e.g. Autonomous Robotic Navigation & Edge AI"
              onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
              required
            />

            <Textarea
              label="LAB MANIFESTO & SUPERVISION BIO"
              rows={3}
              maxLength={250}
              placeholder="Describe your lab or research initiatives and the types of student projects you supervise."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />

            <ChipGroup
              label="RESEARCH DOMAIN VECTORS"
              options={INTEREST_OPTIONS}
              selected={formData.researchInterests}
              onToggle={(item) => toggleArrayItem('researchInterests', item)}
            />
          </div>
        )}

        {/* Step 3: Mentorship */}
        {step === 3 && (
          <div className="space-y-4">
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-brutal-red">STAGE 03: MENTORSHIP SPECIALTIES</div>
            <h2 className="text-2xl font-display font-black text-ink uppercase">Student Advising Areas</h2>
            <p className="text-xs text-ink/70 font-sans">
              Select what areas you are available to guide student project squads on.
            </p>
            <ChipGroup
              options={MENTORING_SPECIALTIES}
              selected={formData.mentoringAreas}
              onToggle={(item) => toggleArrayItem('mentoringAreas', item)}
            />
          </div>
        )}

        {/* Step 4: Clearance */}
        {step === 4 && (
          <div className="text-center py-6 space-y-4">
            <div className="w-14 h-14 bg-campus-green border-2 border-ink flex items-center justify-center mx-auto shadow-brutal-sm">
              <CheckSquare className="w-8 h-8 text-ink stroke-[2.5]" />
            </div>
            <h2 className="text-3xl font-display font-black text-ink uppercase">
              FACULTY CLEARANCE CONFIGURED
            </h2>
            <div className="max-w-md mx-auto p-4 border-2 border-ink bg-canvas font-mono text-left text-xs space-y-1.5 shadow-brutal-sm">
              <div><strong>FACULTY:</strong> {formData.name} ({formData.facultyId || 'ID PENDING'})</div>
              <div><strong>TITLE:</strong> {formData.designation}</div>
              <div><strong>DEPARTMENT:</strong> {formData.department}</div>
              <div><strong>EXPERTISE:</strong> {formData.expertise}</div>
            </div>
            <p className="text-xs sm:text-sm font-sans text-ink/80 max-w-md mx-auto leading-relaxed">
              You are ready to initialize campus research opportunities, supervise active squads, review evidence submissions, and oversee Trial Sprints.
            </p>
          </div>
        )}

        <div className="pt-4 border-t-2 border-ink flex items-center justify-between gap-3">
          {step > 1 && step < 4 ? (
            <Button variant="outline" size="md" icon={ArrowLeft} onClick={handleBack} className="text-xs font-bold font-mono">
              [ BACK ]
            </Button>
          ) : <div />}

          {step < 4 ? (
            <Button variant="primary" size="md" icon={ArrowRight} iconPosition="right" onClick={handleNext} className="text-xs font-bold font-mono">
              [ NEXT STAGE → ]
            </Button>
          ) : (
            <Button variant="danger" size="lg" icon={Cpu} iconPosition="right" onClick={handleFinish} className="w-full sm:w-auto text-xs font-bold font-mono">
              [ ENTER FACULTY DASHBOARD → ]
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
