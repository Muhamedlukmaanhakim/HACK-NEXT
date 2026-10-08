import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Sparkles, Info, Filter, ArrowUpDown } from 'lucide-react';
import MatchCard from '../components/cards/MatchCard';
import Select from '../components/ui/Select';
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
      title: 'Collaboration Request Dispatched',
      message: `Request sent to ${student.name} with project context.`,
    });
  };

  const oppOptions = (opportunities || []).map((o) => ({
    value: o.id,
    label: `${o.title} (${o.type})`,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
              AI-Powered Match Results
            </h1>
            <span className="p-1 rounded-lg bg-accent-indigo/20 text-accent-indigo">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Students who best match the requirements of your project.
          </p>
        </div>

        {/* Prototype Honesty Notice */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-elevated border border-surface-border text-xs text-text-muted">
          <Info className="w-3.5 h-3.5 text-accent-teal" />
          <span>Prototype: results are simulated from mock data.</span>
        </div>
      </div>

      {/* Controls Bar: Opportunity Selector & Sorting */}
      <div className="p-4 rounded-2xl bg-surface border border-surface-border flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <label className="block text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1">
            Selected Opportunity
          </label>
          <select
            value={selectedOppId}
            onChange={(e) => setSelectedOppId(e.target.value)}
            className="w-full bg-surface-elevated text-text-primary text-xs rounded-xl border border-surface-border px-3 py-2 outline-none focus:border-accent-indigo"
          >
            {oppOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-surface-elevated px-3 py-2 rounded-xl border border-surface-border text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-text-muted" />
            <span className="text-text-muted">Rank By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-text-primary outline-none cursor-pointer font-medium"
            >
              <option value="best" className="bg-surface-elevated">Best Overall Match</option>
              <option value="skill" className="bg-surface-elevated">Skill Overlap (50%)</option>
              <option value="availability" className="bg-surface-elevated">Availability (15%)</option>
              <option value="experience" className="bg-surface-elevated">Experience Level (15%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Match Cards List */}
      {loading ? (
        <LoadingState message="Computing multi-factor student compatibility vectors..." />
      ) : matches.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
          icon={Sparkles}
          title="No candidates found"
          description="Try broadening the required skills for this project post to discover candidates."
        />
      )}
    </div>
  );
}
