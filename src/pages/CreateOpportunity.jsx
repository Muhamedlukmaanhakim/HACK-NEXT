import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, Eye, AlertCircle } from 'lucide-react';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import SkillSelector from '../components/skills/SkillSelector';
import OpportunityCard from '../components/cards/OpportunityCard';
import AIAnalysisCard from '../components/features/AIAnalysisCard';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import * as aiService from '../services/aiService';
import { COLLABORATION_TYPES, AVAILABILITY_OPTIONS, INTEREST_OPTIONS } from '../services/taxonomyService';

export default function CreateOpportunity() {
  const { createNewOpportunity } = useAppData();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  // Controlled form state initialized strictly empty without forced defaults
  const [formData, setFormData] = useState({
    title: '',
    type: 'Project',
    teamSize: '4',
    description: '',
    requiredSkills: [],
    interests: [],
    availability: [],
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState(null);

  const handleAnalyzeAI = async () => {
    if (!formData.description.trim()) {
      setErrors((prev) => ({ ...prev, description: 'Enter a project description to parse.' }));
      return;
    }
    setIsAnalyzingAI(true);
    setErrors((prev) => ({ ...prev, description: undefined }));
    try {
      const result = await aiService.analyzeRequirements(formData.description);
      setAiAnalysis(result);
      addToast({
        type: 'info',
        title: 'REQUIREMENTS PARSED',
        message: `Extracted: ${result.skills.join(', ')}`,
      });
    } catch (err) {
      setErrors((prev) => ({ ...prev, description: err.message }));
    } finally {
      setIsAnalyzingAI(false);
    }
  };

  const handleApplyAISkills = () => {
    if (!aiAnalysis?.skills) return;
    const combined = Array.from(new Set([...formData.requiredSkills, ...aiAnalysis.skills]));
    setFormData((prev) => ({ ...prev, requiredSkills: combined }));
    addToast({
      type: 'success',
      title: 'SKILLS MERGED',
      message: 'Detected skills added to project requirements.',
    });
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Project title is required.';
    if (!formData.description.trim()) errs.description = 'Project description is required.';
    if (!formData.requiredSkills || formData.requiredSkills.length === 0) {
      errs.requiredSkills = 'Specify at least 1 required capability.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const created = await createNewOpportunity({
        ...formData,
        teamSize: Number(formData.teamSize),
        creator: {
          id: user?.id || 'operator-1',
          name: user?.name || 'Project Lead',
          department: user?.department || 'Campus Department',
        },
      });
      addToast({
        type: 'success',
        title: 'PROJECT INITIALIZED',
        message: 'Opportunity posted to campus directory! Calculating match compatibility...',
      });
      navigate(`/matches?opportunity=${created.id}`);
    } catch (err) {
      setErrors({ form: err.message || 'Failed to post opportunity.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewOpportunity = {
    id: 'NEW-01',
    title: formData.title || 'UNTITLED PROJECT INITIATIVE',
    type: formData.type,
    creator: { name: user?.name || 'You', department: user?.department || 'Department' },
    description: formData.description || 'Describe the objective and deliverables to generate preview.',
    requiredSkills: formData.requiredSkills.length > 0 ? formData.requiredSkills : ['Requirements Pending'],
    teamSize: Number(formData.teamSize) || 4,
    currentMembers: [{ name: user?.name || 'You' }],
    status: 'Open',
    matchScore: 90,
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in font-sans">
      {/* 1. Header Stamp */}
      <div className="border-b-2 border-ink pb-5">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-ink/60 mb-2">
          02 / INITIALIZE PROJECT
        </div>
        <div className="text-[11px] font-mono font-bold text-ink/75 uppercase tracking-wide">
          PROJECT REQUISITION SPECIFICATION:
        </div>
        <h1 className="text-4xl sm:text-6xl font-display font-black text-ink uppercase tracking-tight leading-[0.92] mt-1">
          START<br />
          <span className="text-brutal-red">SOMETHING.</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form (7 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6 bg-white border-2 border-ink shadow-brutal p-5 sm:p-6 font-mono">
          <Input
            label="PROJECT NAME"
            placeholder="e.g. Distributed Health Telemetry Gateway"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={errors.title}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="PROJECT FORMAT"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={COLLABORATION_TYPES}
            />
            <Select
              label="TARGET TEAM SIZE"
              value={formData.teamSize}
              onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
              options={[
                { value: '2', label: '02 STUDENTS' },
                { value: '3', label: '03 STUDENTS' },
                { value: '4', label: '04 STUDENTS' },
                { value: '5', label: '05 STUDENTS' },
                { value: '6', label: '06 STUDENTS' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="AVAILABILITY WINDOW"
              value={formData.availability[0] || ''}
              placeholder="[ SELECT AVAILABILITY ]"
              onChange={(e) => setFormData({ ...formData, availability: e.target.value ? [e.target.value] : [] })}
              options={AVAILABILITY_OPTIONS}
            />
            <Select
              label="PRIMARY PROJECT DOMAIN"
              value={formData.interests[0] || ''}
              placeholder="[ SELECT DOMAIN ]"
              onChange={(e) => setFormData({ ...formData, interests: e.target.value ? [e.target.value] : [] })}
              options={INTEREST_OPTIONS}
            />
          </div>

          {/* Description & AI Extraction */}
          <div className="space-y-2">
            <Textarea
              label="PROJECT DESCRIPTION & SCOPE"
              rows={4}
              placeholder="Describe what you are building. Example: I need someone who can design the interface and confidently present our project."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              error={errors.description}
              required
            />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1">
              <span className="text-[10px] text-ink/60 uppercase">
                [ AI REQUIREMENT PARSER ENGINE ]
              </span>
              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={Sparkles}
                isLoading={isAnalyzingAI}
                onClick={handleAnalyzeAI}
                className="text-xs"
              >
                [ RUN ANALYSIS → ]
              </Button>
            </div>
          </div>

          {/* AI Requirement Analysis Result */}
          {aiAnalysis && (
            <AIAnalysisCard
              analysis={aiAnalysis}
              inputQuery={formData.description}
              onApplySkills={handleApplyAISkills}
            />
          )}

          {/* Skills Required */}
          <div className="space-y-1.5">
            <div className="text-xs font-bold text-ink uppercase tracking-wider">
              REQUIRED SQUAD CAPABILITIES
            </div>
            <SkillSelector
              label=""
              selectedSkills={formData.requiredSkills}
              onChange={(skills) => setFormData({ ...formData, requiredSkills: skills })}
            />
            {errors.requiredSkills && (
              <p className="text-xs font-bold text-brutal-red mt-1">
                ERROR: {errors.requiredSkills}
              </p>
            )}
          </div>

          {/* Submit */}
          <div className="pt-4 border-t-2 border-ink">
            <Button
              type="submit"
              variant="danger"
              size="lg"
              className="w-full text-sm font-bold uppercase tracking-wider py-3.5 shadow-brutal hover:shadow-brutal-lg"
              icon={ArrowRight}
              iconPosition="right"
              isLoading={isSubmitting}
            >
              [ INITIALIZE PROJECT → ]
            </Button>
          </div>
        </form>

        {/* Right Sticky Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
          <div className="flex items-center justify-between border-b-2 border-ink pb-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-ink">
              <Eye className="w-4 h-4 stroke-[2.5]" />
              <span>LIVE DOSSIER PREVIEW</span>
            </div>
            <span className="text-[10px] font-mono text-ink/60 uppercase">REAL-TIME</span>
          </div>

          <OpportunityCard opportunity={previewOpportunity} matchScore={90} />
        </div>
      </div>
    </div>
  );
}
