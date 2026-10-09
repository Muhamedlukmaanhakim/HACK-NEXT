import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Sparkles, Send, Check } from 'lucide-react';
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
    return <LoadingState message="ACCESSING PROJECT DOSSIER..." />;
  }

  if (!opportunity) {
    return (
      <ErrorState
        title="PROJECT DOSSIER NOT FOUND"
        message="The requested project does not exist or has closed."
        onRetry={() => navigate('/discover/opportunities')}
      />
    );
  }

  const isOwner = opportunity.creator?.id === user?.id || opportunity.id === 'opp-1';

  const activeMembers = opportunity.id === 'opp-1'
    ? (teams.find((t) => t.id === 'team-1')?.members || opportunity.currentMembers || [])
    : (opportunity.currentMembers || []);

  const memberCount = activeMembers.length || 3;
  const teamSize = opportunity.teamSize || 5;
  const isFull = memberCount >= teamSize;

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
      title: 'CONNECTION ESTABLISHED',
      message: `Direct dispatch transmitted to ${opportunity.creator?.name}.`,
    });
  };

  const numId = opportunity.id ? String(opportunity.id).replace(/\D/g, '') || '014' : '014';
  const paddedId = numId.length < 3 ? `00${numId}`.slice(-3) : numId;

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto animate-fade-in font-sans">
      {/* Return Link */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-ink hover:text-brutal-red uppercase tracking-wider transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
        <span>[ ← RETURN TO DIRECTORY ]</span>
      </button>

      {/* PROJECT DOSSIER (Section 18) */}
      <div className="p-6 sm:p-8 bg-white border-2 border-ink shadow-brutal font-mono space-y-6">
        {/* Top Header: PROJECT / 014 */}
        <div className="flex items-center justify-between border-b-2 border-ink pb-3 text-[10px] font-bold">
          <span className="text-ink/60 uppercase">
            PROJECT / {paddedId}
          </span>
          <div className="flex items-center gap-2">
            <span className="bg-canvas text-ink px-2 py-0.5 border border-ink uppercase">
              STATUS: {isFull ? 'CLOSED' : opportunity.status?.toUpperCase() || 'OPEN'}
            </span>
            <span className="bg-signal-yellow text-ink px-2 py-0.5 border border-ink uppercase">
              TEAM: {memberCount < 10 ? `0${memberCount}` : memberCount} / {teamSize < 10 ? `0${teamSize}` : teamSize}
            </span>
          </div>
        </div>

        {/* Big Title */}
        <div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-ink uppercase tracking-tight leading-none">
            {opportunity.title}
          </h1>
          <p className="text-xs font-bold text-ink/75 uppercase mt-2">
            PROJECT LEAD: {opportunity.creator?.name?.toUpperCase() || 'STUDENT LEAD'} ({opportunity.creator?.department || 'CSE'})
          </p>
        </div>

        <div className="editorial-separator-thick" />

        {/* LOOKING FOR */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-brutal-red uppercase tracking-wider">
            LOOKING FOR:
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-bold">
            {(opportunity.requiredSkills || ['Python', 'UI / UX', 'Public Speaking']).map((sk) => (
              <div
                key={sk}
                className="p-2 border-2 border-ink bg-canvas text-ink text-center uppercase shadow-brutal-sm"
              >
                {sk}
              </div>
            ))}
          </div>
        </div>

        <div className="editorial-separator" />

        {/* PROJECT DESCRIPTION */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-brutal-red uppercase tracking-wider">
            PROJECT DESCRIPTION:
          </div>
          <p className="text-xs sm:text-sm font-sans text-ink/85 leading-relaxed bg-canvas p-4 border-2 border-ink font-normal">
            {opportunity.description}
          </p>
        </div>

        <div className="editorial-separator" />

        {/* TEAM REQUIREMENTS: PYTHON ───────── ● (Section 18) */}
        <div className="space-y-3">
          <div className="text-[11px] font-bold text-brutal-red uppercase tracking-wider">
            TEAM REQUIREMENTS
          </div>
          <div className="space-y-2 max-w-md">
            {(opportunity.requiredSkills || ['PYTHON', 'UI / UX', 'SPEECH']).map((req) => (
              <div
                key={req}
                className="flex items-center justify-between text-xs font-bold uppercase"
              >
                <span className="text-ink">{req}</span>
                <span className="flex-1 mx-3 border-b border-dashed border-ink/40" />
                <span className="text-campus-green text-base leading-none select-none">●</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTAs */}
        <div className="pt-4 border-t-2 border-ink flex items-center justify-between gap-3">
          <Button
            variant="outline"
            size="sm"
            icon={Sparkles}
            onClick={() => navigate(`/matches?opportunity=${opportunity.id}`)}
          >
            [ MATCH CANDIDATES ]
          </Button>

          {!isOwner && (
            <Button
              variant={isRequested ? 'secondary' : 'accent'}
              size="md"
              disabled={isRequested || isFull}
              onClick={handleJoin}
            >
              {isRequested ? 'CONNECTED ✓' : '[ ESTABLISH CONNECTION → ]'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
