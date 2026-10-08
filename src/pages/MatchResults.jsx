import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Cpu, Info, ArrowUpDown } from 'lucide-react';
import MatchCard from '../components/cards/MatchCard';
import LoadingState from '../components/ui/LoadingState';
import EmptyState from '../components/ui/EmptyState';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import * as matchService from '../services/matchService';

export default function MatchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { opportunities, sentConnections, connectStudent } = useAppData();
  const { addToast } = useToast();

  const oppIdParam = searchParams.get('opportunity') || 'opp-1';
  const [selectedOppId, setSelectedOppId] = useState(oppIdParam);
  const [sortBy, setSortBy] = useState('best');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sync state if query param changes
  useEffect(() => {
    if (oppIdParam) {
      setSelectedOppId(oppIdParam);
    }
  }, [oppIdParam]);

  useEffect(() => {
    async function loadMatches() {
      setLoading(true);
      try {
        const results = await matchService.getMatches(selectedOppId, sortBy);
        setMatches(results);
      } catch (err) {
        console.error('Failed to load matches:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMatches();
  }, [selectedOppId, sortBy]);

  const handleConnect = async (student) => {
    const opp = opportunities.find((o) => o.id === selectedOppId);
    await connectStudent(student, opp?.title || 'AI Healthcare Assistant');
    addToast({
      type: 'success',
      title: 'Collaboration Invitation Dispatched',
      message: `Invitation transmitted to ${student.name} with project context.`,
    });
  };

  const oppOptions = (opportunities || []).map((o) => ({
    value: o.id,
    label: `${o.title} (${o.type})`,
  }));

  return (
    <div className="space-y-6 animate-fade-in font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-retro-border pb-4">
        <div>
          <div className="text-[10px] text-retro-muted uppercase tracking-widest mb-1">
            [ SECTION 08 // MATCH SIGNALS ]
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-display font-bold text-retro-paper tracking-wide uppercase">
              MATCH SIGNALS <span className="text-retro-orange">//</span> SMART COMPATIBILITY
            </h1>
            <span className="p-1 rounded-none bg-retro-surface-elevated text-retro-orange border border-retro-orange/40">
              <Cpu className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xs text-retro-muted font-sans mt-0.5">
            Candidates ranked by 50% skill competency, 20% interest, 15% availability, and 15% experience.
          </p>
        </div>

        {/* Prototype Honesty Notice */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-none bg-retro-surface border border-retro-border text-xs text-retro-muted">
          <Info className="w-3.5 h-3.5 text-retro-amber" />
          <span>PROTOTYPE: results are simulated from mock data.</span>
        </div>
      </div>

      {/* Controls Bar: Opportunity Selector & Sorting */}
      <div className="p-4 rounded-none bg-retro-surface border border-retro-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-panel">
        <div className="flex-1 max-w-md">
          <label className="block text-[10px] font-mono uppercase tracking-wider text-retro-muted mb-1">
            [ PARAMETER // TARGET_OPPORTUNITY ]
          </label>
          <select
            value={selectedOppId}
            onChange={(e) => setSelectedOppId(e.target.value)}
            className="w-full bg-retro-surface-elevated text-retro-paper text-xs rounded-none border border-retro-border px-3 py-2 outline-none focus:border-retro-orange"
          >
            {oppOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-retro-surface-elevated px-3 py-2 rounded-none border border-retro-border text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-retro-muted" />
            <span className="text-retro-muted">RANK BY:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-retro-paper outline-none cursor-pointer font-bold font-mono"
            >
              <option value="best" className="bg-retro-surface">Best Overall Match</option>
              <option value="skill" className="bg-retro-surface">Skill Overlap (50%)</option>
              <option value="availability" className="bg-retro-surface">Availability (15%)</option>
              <option value="experience" className="bg-retro-surface">Experience (15%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Match Cards List */}
      {loading ? (
        <LoadingState message="Computing multi-factor student compatibility vectors..." />
      ) : matches.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {matches.map((match) => (
            <MatchCard
              key={match.student.id}
              match={match}
              isRequested={sentConnections.includes(match.student.id)}
              onConnect={handleConnect}
              onViewProfile={(st) => navigate(`/profile?id=${st.id}`)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No candidates located"
          description="Try broadening the required skills for this project post to discover candidates."
        />
      )}
    </div>
  );
}
