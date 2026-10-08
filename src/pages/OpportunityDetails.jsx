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
import Badge from '../components/ui/Badge';
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
    return <LoadingState message="Retrieving opportunity specifications..." />;
  }

  if (!opportunity) {
    return (
      <ErrorState
        title="Opportunity Record Not Found"
        message="The requested collaboration post does not exist or has expired."
        onRetry={() => navigate('/discover/opportunities')}
      />
    );
  }

  // Check if current user is owner
  const isOwner = opportunity.creator?.id === user?.id || opportunity.id === 'opp-1';

  // Real-time team roster from teams context if opp-1
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
      title: 'Join Request Transmitted',
      message: `Your request was sent to ${opportunity.creator?.name}.`,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in font-mono">
      {/* Back Link */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs text-retro-muted hover:text-retro-paper transition-colors uppercase tracking-wider"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>[ RETURN TO DIRECTORY ]</span>
      </button>

      {/* Main Card Header */}
      <div className="p-5 sm:p-7 rounded-none bg-retro-surface border border-retro-border space-y-6 shadow-terminal relative">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-retro-border pb-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="teal" size="sm">
                {opportunity.type}
              </Badge>
              <Badge variant={isFull ? 'danger' : 'success'} size="sm">
                {isFull ? 'ROSTER FULL' : opportunity.status || 'OPEN'}
              </Badge>
              {opportunity.matchScore && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-none bg-retro-orange/15 text-retro-orange border border-retro-orange/40">
                  {opportunity.matchScore}% COMPATIBILITY
                </span>
              )}
            </div>

            <div className="text-[10px] text-retro-muted uppercase tracking-widest">
              [ SPEC // {opportunity.id?.toUpperCase()} ]
            </div>

            <h1 className="text-xl sm:text-2xl font-display font-bold text-retro-paper tracking-wide uppercase">
              {opportunity.title}
            </h1>

            <div className="flex items-center gap-2 pt-1 text-xs">
              <Avatar name={opportunity.creator?.name || 'Creator'} size="sm" />
              <span className="text-retro-muted">
                LEAD: <strong className="text-retro-paper font-semibold">{opportunity.creator?.name}</strong> ({opportunity.creator?.department || 'CSE'})
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <Button
              variant="secondary"
              size="md"
              icon={Sparkles}
              onClick={() => navigate(`/matches?opportunity=${opportunity.id}`)}
            >
              Inspect Matches
            </Button>

            {!isOwner && (
              <Button
                variant={isRequested ? 'secondary' : 'primary'}
                size="md"
                disabled={isRequested || isFull}
                icon={isRequested ? Check : Send}
                onClick={handleJoin}
              >
                {isRequested ? 'Request Sent' : isFull ? 'Roster Full' : 'Join Team'}
              </Button>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <div className="text-[10px] uppercase tracking-widest text-retro-muted">
            // PROJECT SPECIFICATION & SCOPE:
          </div>
          <p className="text-xs sm:text-sm text-retro-paper/80 font-sans leading-relaxed bg-retro-surface-elevated p-3.5 border border-retro-border">
            {opportunity.description}
          </p>
        </div>

        {/* Team Progress Roster */}
        <div className="space-y-2.5 pt-2">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-widest text-retro-muted">
            <span>// TEAM ROSTER STATUS:</span>
            <span className="text-retro-paper font-bold font-mono">{memberCount} OF {opportunity.teamSize} SPOTS OCCUPIED</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {activeMembers.map((member) => (
              <div
                key={member.id}
                className="p-3 rounded-none bg-retro-surface-elevated border border-retro-border flex items-center gap-2.5 shadow-panel"
              >
                <Avatar name={member.name} size="sm" />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-retro-paper truncate">
                    {member.name}
                  </p>
                  <p className="text-[10px] text-retro-muted truncate">
                    {member.role || 'Member'}
                  </p>
                </div>
              </div>
            ))}

            {Array.from({ length: Math.max(0, opportunity.teamSize - memberCount) }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                className="p-3 rounded-none border border-dashed border-retro-border/80 flex items-center justify-center text-[11px] text-retro-muted text-center bg-retro-surface/30"
              >
                <span>[ OPEN SLOT ]</span>
              </div>
            ))}
          </div>
        </div>

        {/* What We're Looking For (Required Skills) */}
        <div className="space-y-2 pt-2">
          <div className="text-[10px] uppercase tracking-widest text-retro-muted">
            // REQUIRED COMPETENCIES:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(opportunity.requiredSkills || []).map((skill) => (
              <SkillBadge key={skill} skill={skill} size="md" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
