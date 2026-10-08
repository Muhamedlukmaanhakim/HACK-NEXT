import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowLeft,
  Send,
  Check,
} from 'lucide-react';
import Avatar from '../components/ui/Avatar';
import SkillBadge from '../components/skills/SkillBadge';
import Button from '../components/ui/Button';
import LoadingState from '../components/ui/LoadingState';
import ErrorState from '../components/ui/ErrorState';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import * as opportunityService from '../services/opportunityService';
import * as requestService from '../services/requestService';

export default function OpportunityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { opportunities, teams } = useAppData();
  const { addToast } = useToast();

  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRequested, setIsRequested] = useState(false);

  useEffect(() => {
    async function fetchOpp() {
      setLoading(true);
      try {
        const data = await opportunityService.getOpportunityById(id);
        setOpportunity(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    fetchOpp();
  }, [id, opportunities]);

  if (loading) {
    return <LoadingState message="ACCESSING PROJECT SPECIFICATION..." />;
  }

  if (!opportunity) {
    return (
      <ErrorState
        title="PROJECT POSTING NOT FOUND"
        message="The requested collaboration post does not exist or has expired."
        onRetry={() => navigate('/opportunities')}
      />
    );
  }

  const isOwner = opportunity.creator?.id === user?.id || opportunity.id === 'opp-1';

  const activeMembers = opportunity.id === 'opp-1'
    ? (teams.find((t) => t.id === 'team-1')?.members || opportunity.currentMembers || [])
    : (opportunity.currentMembers || []);

  const memberCount = activeMembers.length;
  const isFull = memberCount >= opportunity.teamSize;

  const handleJoin = async () => {
    setIsRequested(true);
    await requestService.sendRequest({
      studentId: user?.id || 'student-1',
      student: user,
      opportunityId: opportunity.id,
      opportunityTitle: opportunity.title,
      message: 'I would like to contribute my skills to this project!',
    });
    addToast({
      type: 'success',
      title: 'JOIN REQUEST DISPATCHED',
      message: `Your request was transmitted to ${opportunity.creator?.name}.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-ink hover:text-brutal-red transition-colors uppercase tracking-wider"
      >
        <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>← RETURN TO DIRECTORY</span>
      </button>

      {/* Main Card Header */}
      <div className="p-6 sm:p-8 bg-white border-2 border-ink shadow-brutal space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b-2 border-ink">
          <div className="space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-signal-yellow text-ink border border-ink uppercase">
                {opportunity.type}
              </span>
              <span className={`font-mono text-[10px] font-bold px-2 py-0.5 border border-ink uppercase ${
                isFull ? 'bg-ink text-white' : 'bg-campus-green text-ink'
              }`}>
                {isFull ? 'ROSTER FULL' : opportunity.status?.toUpperCase() || 'OPEN'}
              </span>
              {opportunity.matchScore && (
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-brutal-red text-white border border-ink uppercase">
                  {opportunity.matchScore}% MATCH
                </span>
              )}
            </div>

            <div className="text-[10px] font-mono font-bold text-ink/60 uppercase tracking-wider">
              PROJECT SPECIFICATION // {opportunity.id?.toUpperCase()}
            </div>

            <h1 className="text-3xl sm:text-4xl font-display font-black text-ink uppercase tracking-tight leading-none">
              {opportunity.title}
            </h1>

            <div className="flex items-center gap-2 pt-1">
              <Avatar name={opportunity.creator?.name || 'Creator'} size="xs" className="border border-ink" />
              <span className="font-mono text-xs text-ink/70 uppercase">
                LEAD: <strong className="text-ink">{opportunity.creator?.name}</strong> ({opportunity.creator?.department || 'CSE'})
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 flex-wrap self-start sm:self-auto">
            <Button
              variant="outline"
              size="md"
              icon={Sparkles}
              onClick={() => navigate(`/matches?opportunity=${opportunity.id}`)}
              className="text-xs font-bold"
            >
              FIND MATCHES →
            </Button>

            {!isOwner && (
              <Button
                variant={isRequested ? 'secondary' : 'danger'}
                size="md"
                disabled={isRequested || isFull}
                icon={isRequested ? Check : Send}
                onClick={handleJoin}
                className="text-xs font-bold"
              >
                {isRequested ? 'REQUEST SENT' : isFull ? 'ROSTER FULL' : 'JOIN TEAM →'}
              </Button>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink/60">
            PROJECT SPECIFICATION & SCOPE:
          </div>
          <p className="font-sans text-sm text-ink/80 leading-relaxed bg-canvas p-4 border-2 border-ink font-normal">
            {opportunity.description}
          </p>
        </div>

        {/* Team Progress Roster */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs font-mono font-bold uppercase text-ink/70">
            <span>TEAM ROSTER:</span>
            <span>{memberCount} OF {opportunity.teamSize} SPOTS FILLED</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {activeMembers.map((member) => (
              <div
                key={member.id}
                className="p-3 bg-canvas border-2 border-ink flex items-center gap-2.5"
              >
                <Avatar name={member.name} size="sm" className="border border-ink" />
                <div className="min-w-0">
                  <p className="font-display font-bold text-xs uppercase text-ink truncate">
                    {member.name}
                  </p>
                  <p className="font-mono text-[10px] text-ink/70 truncate uppercase">
                    {member.role || 'Member'}
                  </p>
                </div>
              </div>
            ))}

            {Array.from({ length: Math.max(0, opportunity.teamSize - memberCount) }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                className="p-3 border-2 border-dashed border-ink flex items-center justify-center text-xs font-mono font-bold text-ink/40 uppercase bg-canvas/40"
              >
                <span>[ OPEN ROLE ]</span>
              </div>
            ))}
          </div>
        </div>

        {/* Required Skills */}
        <div className="space-y-2 pt-2">
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink/60">
            REQUIRED ROSTER COMPETENCIES:
          </div>
          <div className="flex flex-wrap gap-2">
            {(opportunity.requiredSkills || []).map((skill) => (
              <SkillBadge key={skill} skill={skill} size="md" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
