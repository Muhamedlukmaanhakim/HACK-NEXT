import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Cpu, Info, ArrowUpDown, Sparkles, UserPlus, UserCheck } from 'lucide-react';
import MatchCard from '../components/cards/MatchCard';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
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
      title: 'INVITATION TRANSMITTED',
      message: `Collaboration request dispatched to ${student.name}.`,
    });
  };

  const oppOptions = (opportunities || []).map((o) => ({
    value: o.id,
    label: `${o.title} (${o.type})`,
  }));

  const topMatch = matches[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b-3 border-ink pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-brutal-red mb-1">
            04 / SMART MATCHING ENGINE
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-ink uppercase tracking-tight leading-none">
            THE MISSING PIECE.
          </h1>
          <p className="text-xs sm:text-sm font-mono text-ink/70 font-semibold uppercase mt-2">
            {matches.length} CANDIDATES MATCH YOUR PROJECT REQUIREMENTS
          </p>
        </div>

        {/* Prototype Honesty Notice */}
        <div className="flex items-center gap-2 px-3 py-2 bg-white border-2 border-ink shadow-brutal-sm text-xs font-mono font-bold text-ink self-start md:self-auto">
          <Info className="w-4 h-4 text-ink stroke-[2.5]" />
          <span>SIMULATED MULTI-FACTOR WEIGHTING</span>
        </div>
      </div>

      {/* Featured Best Match Banner (if top match available) */}
      {!loading && topMatch && (
        <div className="p-6 bg-signal-yellow border-2 border-ink shadow-brutal-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <Avatar name={topMatch.student.name} size="lg" className="border-2 border-ink bg-white" />
            <div>
              <div className="inline-block px-2 py-0.5 bg-ink text-white font-mono text-[10px] font-bold uppercase tracking-wider mb-1">
                BEST MATCH // {Math.round(topMatch.score)}% COMPATIBILITY
              </div>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-ink uppercase tracking-tight">
                {topMatch.student.name}
              </h2>
              <p className="text-xs font-sans text-ink/90 mt-1 max-w-xl font-normal leading-relaxed">
                {topMatch.reason || 'Top compatibility across skill requirements, active availability, and verified experience.'}
              </p>
            </div>
          </div>

          <Button
            variant="primary"
            size="lg"
            icon={sentConnections.includes(topMatch.student.id) ? UserCheck : UserPlus}
            disabled={sentConnections.includes(topMatch.student.id)}
            onClick={() => handleConnect(topMatch.student)}
            className="whitespace-nowrap w-full md:w-auto text-xs"
          >
            {sentConnections.includes(topMatch.student.id) ? 'INVITATION SENT' : `CONNECT WITH ${topMatch.student.name.split(' ')[0].toUpperCase()} →`}
          </Button>
        </div>
      )}

      {/* Controls Bar: Opportunity Selector & Sorting */}
      <div className="p-4 bg-white border-2 border-ink shadow-brutal flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex-1 max-w-md">
          <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-ink/70 mb-1">
            TARGET PROJECT:
          </label>
          <select
            value={selectedOppId}
            onChange={(e) => setSelectedOppId(e.target.value)}
            className="w-full bg-canvas text-ink text-xs font-mono font-bold border-2 border-ink px-3 py-2 outline-none focus:border-brutal-red"
          >
            {oppOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-canvas px-3 py-2 border-2 border-ink text-xs font-mono font-bold">
            <ArrowUpDown className="w-3.5 h-3.5 text-ink stroke-[2.5]" />
            <span className="text-ink/60">RANK:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-ink outline-none cursor-pointer uppercase font-bold"
            >
              <option value="best">OVERALL MATCH</option>
              <option value="skill">SKILL OVERLAP (50%)</option>
              <option value="availability">AVAILABILITY (15%)</option>
              <option value="experience">EXPERIENCE (15%)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Match Cards List */}
      {loading ? (
        <LoadingState message="COMPUTING COMPATIBILITY METRICS..." />
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
          icon={Cpu}
          title="NO CANDIDATES MATCH SPECIFIED CRITERIA"
          description="Adjust your required project competencies to broaden candidate compatibility."
          actionLabel="RETURN TO OPPORTUNITIES"
          onAction={() => navigate('/opportunities')}
        />
      )}
    </div>
  );
}
