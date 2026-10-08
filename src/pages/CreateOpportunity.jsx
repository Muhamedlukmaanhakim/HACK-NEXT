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
import { COLLABORATION_TYPES, AVAILABILITY_OPTIONS, INTEREST_OPTIONS } from '../services/taxonomyService';

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
        message: `AI identified: ${result.skills.join(', ')}`,
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
        message: 'Your project is posted! Computing top matches now...',
      });

      // Navigate straight to Match Results
      navigate(`/matches?opportunity=${created.id}`);
    } catch (err) {
      setErrors({ form: err.message || 'Failed to post opportunity.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Preview object
  const previewOpportunity = {
    id: 'preview',
    title: formData.title || 'Your Project Title',
    type: formData.type,
    creator: {
      name: user?.name || 'Lukmaan Hakim',
      department: user?.department || 'CSE',
    },
    description: formData.description || 'Provide a compelling description of what your team will build.',
    requiredSkills: formData.requiredSkills.length > 0 ? formData.requiredSkills : ['UI/UX', 'Presentation'],
    teamSize: Number(formData.teamSize) || 4,
    currentMembers: [{ name: user?.name || 'Lukmaan Hakim' }],
    status: 'Open',
    matchScore: 94,
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
          Create a Collaboration Opportunity
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Post your project specifications to recruit compatible teammates with multi-factor matching.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form (7 cols) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
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
              label="Required Team Size"
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
              helperText="Describe what you are building and what roles you want to fill."
              required
            />

            <div className="flex items-center justify-between pt-1">
              <span className="text-[11px] text-text-muted flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-accent-indigo" />
                Natural language requirement parser available
              </span>

              <Button
                type="button"
                variant="teal"
                size="sm"
                icon={Sparkles}
                isLoading={isAnalyzingAI}
                onClick={handleAnalyzeAI}
              >
                Analyze Requirements with AI
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
              label="Required Skills for Applicants"
              selectedSkills={formData.requiredSkills}
              onChange={(skills) => setFormData({ ...formData, requiredSkills: skills })}
            />
            {errors.requiredSkills && (
              <p className="text-xs text-status-danger font-medium mt-1">
                {errors.requiredSkills}
              </p>
            )}
          </div>

          {/* Submit Action */}
          <div className="pt-4 border-t border-surface-border">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto"
              icon={PlusCircle}
              isLoading={isSubmitting}
            >
              Post Opportunity & View Best Matches
            </Button>
          </div>
        </form>

        {/* Right Sticky Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4 lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-text-muted">
              <Eye className="w-4 h-4 text-accent-teal" />
              <span>Live Card Preview</span>
            </div>
            <span className="text-[11px] text-text-muted">How others will see it</span>
          </div>

          <OpportunityCard opportunity={previewOpportunity} matchScore={94} />

          <div className="p-4 rounded-xl bg-surface-elevated/40 border border-surface-border/60 text-xs text-text-muted space-y-2">
            <div className="font-medium text-text-secondary">Demo Tip:</div>
            <p className="leading-relaxed">
              Typing <span className="text-accent-teal font-mono">&ldquo;I need someone who can design the interface and confidently present our project.&rdquo;</span> and clicking <strong>Analyze Requirements with AI</strong> will extract UI/UX, Presentation, and Public Speaking.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
