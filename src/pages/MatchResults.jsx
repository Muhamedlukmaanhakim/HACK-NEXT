import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import MatchCard from '../components/cards/MatchCard';
import Button from '../components/ui/Button';
import LoadingState from '../components/ui/LoadingState';
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

  const currentOpportunity = opportunities.find((o) => o.id === selectedOppId) || opportunities[0];

  const handleConnect = async (student) => {
    await connectStudent(student, currentOpportunity?.title || 'AI Healthcare Assistant');
    addToast({
      type: 'success',
      title: 'INVITATION TRANSMITTED',
      message: `Collaboration request dispatched to ${student.name}.`,
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in font-sans">
      {/* 1. Header: 03 / MATCH RESULTS (Section 21) */}
      <div className="border-b-2 border-ink pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4 font-mono">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-ink/60 mb-1">
            03 / MATCH RESULTS
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-ink uppercase tracking-tight leading-none">
            SMART MATCHES.
          </h1>
          <p className="text-xs sm:text-sm text-ink/70 font-bold uppercase mt-2">
            PROJECT: {currentOpportunity?.title?.toUpperCase() || 'AI HEALTHCARE ASSISTANT'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white px-3 py-1.5 border-2 border-ink shadow-brutal-sm text-xs font-bold">
            <span className="text-ink/60 mr-1.5">PROJECT:</span>
            <select
              value={selectedOppId}
              onChange={(e) => setSelectedOppId(e.target.value)}
              className="bg-transparent text-ink outline-none cursor-pointer uppercase font-bold"
            >
              {(opportunities || []).map((o) => (
                <option key={o.id} value={o.id}>
                  {o.title.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Candidate Cards Grid */}
      {loading ? (
        <LoadingState message="COMPUTING MULTI-FACTOR COMPATIBILITY VECTORS..." />
      ) : matches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <div className="p-8 border-2 border-ink bg-white text-center font-mono space-y-3 shadow-brutal">
          <h3 className="font-display font-black text-xl text-ink uppercase">NO DIRECT MATCHES FOUND</h3>
          <p className="text-xs text-ink/70 font-sans">
            Try adjusting required competencies in project settings to broaden the campus search.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/discover/students')}
          >
            [ BROWSE ALL STUDENTS → ]
          </Button>
        </div>
      )}
    </div>
  );
}
