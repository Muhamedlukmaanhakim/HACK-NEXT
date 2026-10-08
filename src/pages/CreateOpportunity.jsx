import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, PlusCircle, Info, Eye } from 'lucide-react';
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
import { COLLABORATION_TYPES } from '../services/taxonomyService';

export default function CreateOpportunity() {
  const { createNewOpportunity } = useAppData();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    type: 'Hackathon',
    teamSize: '4',
    description: '',
    requiredSkills: [],
    interests: ['AI & Machine Learning'],
    availability: ['Weekends'],
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
      addToast({ type: 'info', title: 'REQUIREMENTS PARSED', message: `Extracted: ${result.skills.join(', ')}` });
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
    addToast({ type: 'success', title: 'SKILLS MERGED', message: 'Detected skills added to project requirements.' });
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Project title is required.';
    if (!formData.description.trim()) errs.description = 'Project description is required.';
    if (!formData.requiredSkills || formData.requiredSkills.length === 0) {
      errs.requiredSkills = 'Specify at least 1 required competency.';
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
          id: user?.id || 'student-1',
          name: user?.name || 'Lukmaan Hakim',
          department: user?.department || 'Computer Science (CSE)',
        },
      });
      addToast({ type: 'success', title: 'PROJECT PUBLISHED', message: 'Project posted! Computing top matches now...' });
      navigate(`/matches?opportunity=${created.id}`);
    } catch (err) {
      setErrors({ form: err.message || 'Failed to post opportunity.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewOpportunity = {
    id: '01',
    title: formData.title || 'Untitled Project Post',
    type: formData.type,
    creator: { name: user?.name || 'Lukmaan Hakim', department: user?.department || 'CSE' },
    description: formData.description || 'Describe what you are building to preview the project card.',
    requiredSkills: formData.requiredSkills.length > 0 ? formData.requiredSkills : ['UI/UX', 'Presentation'],
    teamSize: Number(formData.teamSize) || 4,
    currentMembers: [{ name: user?.name || 'Lukmaan Hakim' }],
    status: 'Open',
    matchScore: 94,
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="border-b-3 border-ink pb-6">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-brutal-red mb-1">03 / POST A PROJECT</div>
        <h1 className="text-3xl sm:text-5xl font-display font-black text-ink uppercase tracking-tight leading-none">START SOMETHING.</h1>
        <p className="text-xs sm:text-sm font-mono text-ink/70 font-semibold uppercase mt-2">DEFINE WHAT YOU'RE BUILDING AND WHO YOU NEED</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form (7 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6 bg-white border-2 border-ink shadow-brutal p-6">
          <Input
            label="PROJECT TITLE"
            placeholder="e.g. AI Healthcare Assistant"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={errors.title}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="COLLABORATION TYPE"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={COLLABORATION_TYPES}
            />
            <Select
              label="TEAM CAPACITY"
              value={formData.teamSize}
              onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
              options={[
                { value: '2', label: '2 Members (Duo)' },
                { value: '3', label: '3 Members' },
                { value: '4', label: '4 Members (Hackathon Squad)' },
                { value: '5', label: '5 Members' },
              ]}
            />
          </div>

          {/* Description & AI Extraction */}
          <div className="space-y-3">
            <Textarea
              label="DESCRIBE YOUR PROJECT IN PLAIN ENGLISH"
              rows={4}
              placeholder="e.g. I need someone who can design the interface and confidently present our project."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              error={errors.description}
              helperText="Describe what you are building, required roles, and technologies."
              required
            />
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pt-1">
              <span className="text-[11px] font-mono text-ink/70 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-ink flex-shrink-0" />
                Plain text requirement parsing engine available
              </span>
              <Button type="button" variant="outline" size="sm" icon={Sparkles} isLoading={isAnalyzingAI} onClick={handleAnalyzeAI} className="text-xs">
                PARSE REQUIREMENTS →
              </Button>
            </div>
          </div>

          {aiAnalysis && <AIAnalysisCard analysis={aiAnalysis} onApplySkills={handleApplyAISkills} />}

          <div className="space-y-1.5">
            <SkillSelector
              label="REQUIRED COMPETENCIES"
              selectedSkills={formData.requiredSkills}
              onChange={(skills) => setFormData({ ...formData, requiredSkills: skills })}
            />
            {errors.requiredSkills && <p className="text-xs font-mono font-bold text-brutal-red mt-1">ERROR: {errors.requiredSkills}</p>}
          </div>

          <div className="pt-4 border-t-2 border-ink">
            <Button type="submit" variant="danger" size="lg" className="w-full text-sm font-bold uppercase tracking-wider py-3.5" icon={PlusCircle} isLoading={isSubmitting}>
              PUBLISH PROJECT & FIND MATCHES →
            </Button>
          </div>
        </form>

        {/* Right Sticky Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
          <div className="flex items-center justify-between border-b-2 border-ink pb-2">
            <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-ink">
              <Eye className="w-4 h-4 stroke-[2.5]" />
              <span>LIVE CARD PREVIEW</span>
            </div>
            <span className="text-[10px] font-mono text-ink/60 uppercase">AUTO-UPDATES</span>
          </div>

          <OpportunityCard opportunity={previewOpportunity} matchScore={94} />

          <div className="p-4 bg-white border-2 border-ink shadow-brutal space-y-2">
            <div className="text-[11px] font-mono font-bold text-brutal-red uppercase tracking-wider">DEMO CHEAT SHEET:</div>
            <p className="font-sans text-xs text-ink/80 leading-relaxed font-normal">
              Type <span className="font-mono font-bold bg-signal-yellow px-1 border border-ink">&ldquo;I need someone who can design the interface and confidently present our project.&rdquo;</span> and click <strong>PARSE REQUIREMENTS →</strong> to extract UI/UX, Presentation, and Public Speaking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
