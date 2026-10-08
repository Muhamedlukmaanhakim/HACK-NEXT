import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, PlusCircle, Info, Eye } from 'lucide-react';
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

  // Trigger simulated AI requirement extraction
  const handleAnalyzeAI = async () => {
    if (!formData.description.trim()) {
      setErrors((prev) => ({
        ...prev,
        description: 'Please type your project requirements or description first.',
      }));
      return;
    }

    setIsAnalyzingAI(true);
    setErrors((prev) => ({ ...prev, description: undefined }));

    try {
      const result = await aiService.analyzeRequirements(formData.description);
      setAiAnalysis(result);
      addToast({
        type: 'info',
        title: 'Requirements Extracted',
        message: `Simulation identified: ${result.skills.join(', ')}`,
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
      title: 'Skills Applied',
      message: 'Detected skills merged into Required Skills list.',
    });
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) {
      errs.title = 'Project title is required.';
    }
    if (!formData.description.trim()) {
      errs.description = 'Project description is required.';
    }
    if (!formData.requiredSkills || formData.requiredSkills.length === 0) {
      errs.requiredSkills = 'Please specify at least 1 required skill.';
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
        title: formData.title,
        type: formData.type,
        teamSize: Number(formData.teamSize),
        description: formData.description,
        requiredSkills: formData.requiredSkills,
        interests: formData.interests,
        availability: formData.availability,
        creator: {
          id: user?.id || 'student-1',
          name: user?.name || 'Lukmaan Hakim',
          department: user?.department || 'Computer Science (CSE)',
        },
      });

      addToast({
        type: 'success',
        title: 'Opportunity Created',
        message: 'Project posted! Computing top matches now...',
      });

      // Navigate straight to Match Results
      navigate(`/matches?opportunity=${created.id}`);
    } catch (err) {
      setErrors({ form: err.message || 'Failed to post opportunity.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Live card preview object
  const previewOpportunity = {
    id: 'preview',
    title: formData.title || 'Untitled Project Post',
    type: formData.type,
    creator: {
      name: user?.name || 'Lukmaan Hakim',
      department: user?.department || 'CSE',
    },
    description: formData.description || 'Enter project description to preview specification card.',
    requiredSkills: formData.requiredSkills.length > 0 ? formData.requiredSkills : ['UI/UX', 'Presentation'],
    teamSize: Number(formData.teamSize) || 4,
    currentMembers: [{ name: user?.name || 'Lukmaan Hakim' }],
    status: 'Open',
    matchScore: 94,
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in font-mono">
      <div className="border-b border-retro-border pb-4">
        <div className="text-[10px] text-retro-muted uppercase tracking-widest mb-1">
          [ SUBROUTINE // INITIALIZE_PROJECT_SPEC ]
        </div>
        <h1 className="text-xl sm:text-2xl font-display font-bold text-retro-paper tracking-wide uppercase">
          Create Collaboration Opportunity
        </h1>
        <p className="text-xs text-retro-muted font-sans mt-0.5">
          Post project parameters to initiate multi-factor matching across registered campus peers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form (7 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-5">
          <Input
            label="Project Title"
            placeholder="e.g. AI Healthcare Assistant"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={errors.title}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Collaboration Type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={COLLABORATION_TYPES}
            />

            <Select
              label="Crew Capacity"
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
          <div className="space-y-2">
            <Textarea
              label="Project Description & Needs"
              rows={4}
              placeholder="e.g. I need someone who can design the interface and confidently present our project."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              error={errors.description}
              helperText="Describe what you are building and what competencies you require."
              required
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[10px] text-retro-muted flex items-center gap-1 font-mono">
                <Info className="w-3.5 h-3.5 text-retro-amber" />
                Natural language requirement parser available
              </span>

              <Button
                type="button"
                variant="teal"
                size="sm"
                icon={Terminal}
                isLoading={isAnalyzingAI}
                onClick={handleAnalyzeAI}
              >
                Analyze Requirements
              </Button>
            </div>
          </div>

          {/* AI Analysis Result Card */}
          {aiAnalysis && (
            <AIAnalysisCard
              analysis={aiAnalysis}
              onApplySkills={handleApplyAISkills}
            />
          )}

          {/* Required Skills Selection */}
          <div className="space-y-1">
            <SkillSelector
              label="Required Competencies"
              selectedSkills={formData.requiredSkills}
              onChange={(skills) => setFormData({ ...formData, requiredSkills: skills })}
            />
            {errors.requiredSkills && (
              <p className="text-xs text-retro-red font-mono mt-1">
                [ERR: {errors.requiredSkills}]
              </p>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-retro-border">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
              icon={PlusCircle}
              isLoading={isSubmitting}
            >
              Post Opportunity & Match Candidates
            </Button>
          </div>
        </form>

        {/* Right Sticky Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
          <div className="flex items-center justify-between border-b border-retro-border pb-1.5">
            <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-retro-amber">
              <Eye className="w-3.5 h-3.5" />
              <span>[ TELEMETRY PREVIEW ]</span>
            </div>
            <span className="text-[10px] text-retro-muted">Live Project Card</span>
          </div>

          <OpportunityCard opportunity={previewOpportunity} matchScore={94} />

          <div className="p-3.5 rounded-none bg-retro-surface border border-retro-border text-xs text-retro-muted space-y-1.5 shadow-panel">
            <div className="text-[10px] font-bold text-retro-orange uppercase tracking-wider">// DEMO INSTRUCTION:</div>
            <p className="font-sans leading-relaxed text-retro-paper/70">
              Type <span className="text-retro-amber font-mono">&ldquo;I need someone who can design the interface and confidently present our project.&rdquo;</span> and click <strong>Analyze Requirements</strong> to simulate extraction of UI/UX, Presentation, and Public Speaking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
