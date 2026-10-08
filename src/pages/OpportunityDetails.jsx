import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Users,
  Calendar,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Clock,
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
    return <LoadingState message="Loading opportunity specifications..." />;
  }

  if (!opportunity) {
    return (
      <ErrorState
        title="Opportunity Not Found"
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
      title: 'Join Request Sent',
      message: `Your request was sent to ${opportunity.creator?.name}.`,
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Back Link */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to listings</span>
      </button>

      {/* Main Card Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-surface-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="teal" size="sm">
                {opportunity.type}
              </Badge>
              <Badge variant={isFull ? 'danger' : 'success'} size="sm">
                {isFull ? 'Team Full' : opportunity.status || 'Open'}
              </Badge>
              {opportunity.matchScore && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-accent-indigo/15 text-indigo-300 border border-accent-indigo/30">
                  {opportunity.matchScore}% Compatibility
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary tracking-tight">
              {opportunity.title}
            </h1>

            <div className="flex items-center gap-2.5 pt-1">
              <Avatar name={opportunity.creator?.name || 'Creator'} size="sm" />
              <span className="text-xs text-text-secondary">
                Posted by <strong className="text-text-primary">{opportunity.creator?.name}</strong> ({opportunity.creator?.department || 'CSE'})
              </span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 flex-wrap">
            <Button
              variant="secondary"
              size="md"
              icon={Sparkles}
              onClick={() => navigate(`/matches?opportunity=${opportunity.id}`)}
            >
              View Best Matches
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
        <div className="space-y-2 pt-4 border-t border-surface-border">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            Project Overview
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed bg-surface-elevated/40 p-4 rounded-xl border border-surface-border">
            {opportunity.description}
          </p>
        </div>

        {/* Team Progress Roster */}
        <div className="space-y-3 pt-4 border-t border-surface-border">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
              Team Roster ({memberCount} of {opportunity.teamSize} spots filled)
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {activeMembers.map((member) => (
              <div
                key={member.id}
                className="p-3 rounded-xl bg-surface-elevated border border-surface-border flex items-center gap-3"
              >
                <Avatar name={member.name} size="sm" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-text-primary truncate">
                    {member.name}
                  </p>
                  <p className="text-[11px] text-text-muted truncate">
                    {member.role || 'Member'}
                  </p>
                </div>
              </div>
            ))}

            {Array.from({ length: Math.max(0, opportunity.teamSize - memberCount) }).map((_, idx) => (
              <div
                key={`empty-${idx}`}
                className="p-3 rounded-xl border border-dashed border-surface-border flex items-center justify-center text-xs text-text-muted text-center"
              >
                <span>+ Open Slot</span>
              </div>
            ))}
          </div>
        </div>

        {/* What We're Looking For (Required Skills) */}
        <div className="space-y-3 pt-4 border-t border-surface-border">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted">
            What We&apos;re Looking For
          </h3>
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
