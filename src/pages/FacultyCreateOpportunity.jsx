import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  FileText,
} from 'lucide-react';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import SkillSelector from '../components/skills/SkillSelector';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import * as aiService from '../services/aiService';

export default function FacultyCreateOpportunity() {
  const { createNewOpportunity } = useAppData();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    type: 'Research Lab Initiative',
    department: user?.department || '',
    creditOffering: '4 Academic Credits',
    teamSize: '4',
    description: '',
    requiredSkills: [],
    minEvidenceTier: 'EVIDENCE_SUBMITTED',
    requireTrialSprint: true,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnalyzingAI, setIsAnalyzingAI] = useState(false);

  const handleAnalyzeAI = async () => {
    if (!formData.description.trim()) {
      setErrors((prev) => ({ ...prev, description: 'Enter research description to parse capabilities.' }));
      return;
    }
    setIsAnalyzingAI(true);
    setErrors((prev) => ({ ...prev, description: undefined }));
    try {
      const result = await aiService.analyzeRequirements(formData.description);
      const combined = Array.from(new Set([...formData.requiredSkills, ...(result.skills || [])]));
      setFormData((prev) => ({ ...prev, requiredSkills: combined }));
      addToast({
        type: 'info',
        title: 'LAB CAPABILITIES EXTRACTED',
        message: `Extracted: ${(result.skills || []).join(', ')}`,
      });
    } catch (err) {
      setErrors((prev) => ({ ...prev, description: err.message }));
    } finally {
      setIsAnalyzingAI(false);
    }
  };

  const validate = () => {
    const errs = {};
    if (!formData.title.trim()) errs.title = 'Initiative title is required.';
    if (!formData.description.trim()) errs.description = 'Research scope is required.';
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
      await createNewOpportunity({
        ...formData,
        teamSize: Number(formData.teamSize),
        creator: {
          id: user?.id || 'faculty-operator',
          name: user?.name || 'Faculty Supervisor',
          department: formData.department || user?.department || 'Department',
          role: 'faculty',
        },
        isFacultyInitiative: true,
      });
      addToast({
        type: 'success',
        title: 'FACULTY INITIATIVE POSTED',
        message: 'Research project opened for student application and squad formation.',
      });
      navigate('/faculty/opportunities');
    } catch (err) {
      setErrors({ form: err.message || 'Failed to post lab opportunity.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in font-sans">
      {/* 1. Header Stamp */}
      <div className="border-b-2 border-ink pb-5">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-ink/60 mb-2">
          <Briefcase className="w-4 h-4 text-ink" />
          <span>FACULTY WORKFLOW // LAB INITIATIVE PROVISIONING</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-black text-ink uppercase tracking-tight leading-none">
          POST LAB INITIATIVE.
        </h1>
        <p className="text-xs sm:text-sm text-ink/75 font-mono font-bold uppercase mt-2">
          ESTABLISH CAPSTONE REQUIREMENTS · DEFINE REQUIRED EVIDENCE TIERS · SPRINT GATES
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-8 space-y-6 bg-white border-2 border-ink shadow-brutal p-5 sm:p-6 font-mono">
          <Input
            label="RESEARCH / CAPSTONE TITLE"
            placeholder="e.g. Distributed Telemetry Sensor Grid for Campus Energy Optimization"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            error={errors.title}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="INITIATIVE FORMAT"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={[
                { value: 'Research Lab Initiative', label: 'RESEARCH LAB INITIATIVE' },
                { value: 'Department Capstone', label: 'DEPARTMENT CAPSTONE' },
                { value: 'Sponsored Industry Project', label: 'SPONSORED INDUSTRY PROJECT' },
                { value: 'Independent Honors Thesis', label: 'INDEPENDENT HONORS THESIS' },
              ]}
            />
            <Select
              label="TARGET SQUAD SIZE"
              value={formData.teamSize}
              onChange={(e) => setFormData({ ...formData, teamSize: e.target.value })}
              options={[
                { value: '2', label: '02 RESEARCH FELLOWS' },
                { value: '3', label: '03 RESEARCH FELLOWS' },
                { value: '4', label: '04 RESEARCH FELLOWS' },
                { value: '5', label: '05 RESEARCH FELLOWS' },
              ]}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="DEPARTMENT / LAB"
              placeholder="e.g. Computer Science & Systems"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
            />
            <Select
              label="ACADEMIC OFFERING"
              value={formData.creditOffering}
              onChange={(e) => setFormData({ ...formData, creditOffering: e.target.value })}
              options={[
                { value: '4 Academic Credits', label: '4 ACADEMIC CREDITS' },
                { value: '2 Academic Credits', label: '2 ACADEMIC CREDITS' },
                { value: 'Fellowship Stipend ($500)', label: 'FELLOWSHIP STIPEND ($500)' },
                { value: 'Department Honors Distinction', label: 'DEPARTMENT HONORS DISTINCTION' },
              ]}
            />
          </div>

          {/* Description & AI Extraction */}
          <div className="space-y-2">
            <Textarea
              label="RESEARCH SCOPE & LAB DELIVERABLES"
              rows={4}
              placeholder="Detail the technical requirements, experimental methodology, and expected milestone outputs..."
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
                [ EXTRACT COMPETENCIES → ]
              </Button>
            </div>
          </div>

          {/* Required Skills */}
          <div className="space-y-1.5">
            <div className="text-xs font-bold text-ink uppercase tracking-wider">
              REQUIRED TECHNICAL & DOMAIN CAPABILITIES
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

          {/* Quality & Sprint Gates */}
          <div className="p-4 bg-cream/50 border-2 border-ink space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-ink" />
              <span>SUPERVISORY INTEGRITY GATES</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select
                label="MINIMUM EVIDENCE TIER"
                value={formData.minEvidenceTier}
                onChange={(e) => setFormData({ ...formData, minEvidenceTier: e.target.value })}
                options={[
                  { value: 'SELF_DECLARED', label: 'TIER 1 · SELF DECLARED (OPEN)' },
                  { value: 'EVIDENCE_SUBMITTED', label: 'TIER 2 · EVIDENCE SUBMITTED (RECOMMENDED)' },
                  { value: 'PRACTICALLY_DEMONSTRATED', label: 'TIER 3 · PRACTICALLY DEMONSTRATED' },
                  { value: 'INDEPENDENTLY_REVIEWED', label: 'TIER 4 · FACULTY CERTIFIED ONLY' },
                ]}
              />
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase block text-ink">
                  TRIAL SPRINT PREREQUISITE
                </label>
                <label className="flex items-center gap-2 p-2.5 bg-white border-2 border-ink cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.requireTrialSprint}
                    onChange={(e) => setFormData({ ...formData, requireTrialSprint: e.target.checked })}
                    className="w-4 h-4 accent-ink"
                  />
                  <span className="text-xs font-bold uppercase">MANDATE 48H TRIAL SPRINT</span>
                </label>
              </div>
            </div>
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
              [ INITIALIZE FACULTY INITIATIVE → ]
            </Button>
          </div>
        </form>

        {/* Right Info Dossier */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 bg-brutal-yellow border-2 border-ink shadow-brutal space-y-3 font-mono text-xs">
            <div className="font-bold uppercase tracking-wider flex items-center gap-2 text-ink">
              <FileText className="w-4 h-4" />
              <span>EVIDENCE POLICY NOTICE</span>
            </div>
            <p className="text-ink/80 leading-relaxed">
              Faculty opportunities automatically enforce evidence weighting in matching algorithms. Candidates with verified artifacts (Tier 2–4) are ranked ahead of unsubstantiated claims.
            </p>
          </div>

          <div className="p-4 bg-white border-2 border-ink shadow-brutal space-y-2 font-mono text-xs">
            <div className="font-bold uppercase tracking-wider text-ink">TRIAL SPRINT INTEGRATION</div>
            <p className="text-ink/75 leading-relaxed">
              When mandated, prospective candidates must pass a 48–72 hour micro-deliverable sprint before final squad ratification to prevent team dropouts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
