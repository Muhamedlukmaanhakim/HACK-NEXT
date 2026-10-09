import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UserCheck,
  PieChart,
  ShieldCheck,
  Activity,
  ArrowRight,
  ExternalLink,
  Users,
} from 'lucide-react';
import Button from '../components/ui/Button';
import CollaborationMatrix from '../components/features/CollaborationMatrix';
import { useAppData } from '../context/AppDataContext';
import { analyzeTeamGaps } from '../utils/gapAnalysis';
import { evaluateTeamHealth } from '../services/teamHealthService';

export default function FacultySupervision() {
  const { teams, students, projectTasks, healthAlerts, skillEvidences } = useAppData();
  const navigate = useNavigate();

  const [selectedTeamId, setSelectedTeamId] = useState(teams?.[0]?.id || 'team-1');
  const activeTeam = teams?.find((t) => t.id === selectedTeamId) || teams?.[0];

  const teamTasks = (projectTasks || []).filter((t) => t.teamId === activeTeam?.id);
  const teamAlerts = (healthAlerts || []).filter((a) => a.teamId === activeTeam?.id);

  const gapAnalysis = analyzeTeamGaps(
    activeTeam?.requiredSkills || ['Python', 'AI/ML', 'Backend', 'UI/UX'],
    activeTeam?.members || [],
    students || [],
    skillEvidences || []
  );

  const healthEvaluation = evaluateTeamHealth(activeTeam, teamTasks, teamAlerts);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in font-sans">
      {/* 1. Header Stamp */}
      <div className="border-b-2 border-ink pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4 font-mono">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink/60 mb-1">
            <UserCheck className="w-4 h-4 text-ink" />
            <span>FACULTY WORKFLOW // PROJECT SUPERVISION</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-ink uppercase tracking-tight leading-none">
            PROJECT SUPERVISION.
          </h1>
          <p className="text-xs sm:text-sm text-ink/75 font-bold uppercase mt-2">
            TEAM READINESS REVIEWS · CAPABILITY COVERAGE AUDITS · SUPERVISED MILESTONES
          </p>
        </div>

        <div className="flex items-center gap-2">
          {teams.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedTeamId(t.id)}
              className={`px-3 py-1.5 text-xs font-mono font-bold uppercase border-2 border-ink transition-all ${
                selectedTeamId === t.id
                  ? 'bg-ink text-white shadow-brutal-sm'
                  : 'bg-white text-ink hover:bg-canvas'
              }`}
            >
              [ {t.name.split(' ')[0]} ]
            </button>
          ))}
        </div>
      </div>

      {/* 2. Team Diagnostic Dossier */}
      {activeTeam && (
        <div className="p-6 bg-white border-3 border-ink shadow-brutal font-mono space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-ink pb-3">
            <div>
              <div className="text-[10px] font-bold text-ink/60 uppercase tracking-widest">
                SUPERVISED SQUAD DOSSIER // {activeTeam.id.toUpperCase()}
              </div>
              <h2 className="text-2xl font-display font-black text-ink uppercase">
                {activeTeam.name}
              </h2>
              <p className="text-xs text-ink/75 font-sans mt-0.5">{activeTeam.description}</p>
            </div>

            <div className="text-left sm:text-right">
              <span className={`px-2.5 py-1 text-xs font-bold uppercase border-2 ${healthEvaluation?.badgeColor}`}>
                ● HEALTH: {healthEvaluation?.status}
              </span>
            </div>
          </div>

          {/* Readiness Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3.5 border-2 border-ink bg-canvas space-y-1">
              <span className="text-[10px] text-ink/60 uppercase font-bold">READINESS INDEX</span>
              <div className="text-3xl font-display font-black text-ink">{gapAnalysis.readinessIndex}%</div>
              <p className="text-[10px] text-ink/70 font-sans">{gapAnalysis.readinessState}</p>
            </div>

            <div className="p-3.5 border-2 border-ink bg-canvas space-y-1">
              <span className="text-[10px] text-ink/60 uppercase font-bold">CAPABILITY COVERAGE</span>
              <div className="text-3xl font-display font-black text-ink">{gapAnalysis.coveragePercentage}%</div>
              <p className="text-[10px] text-ink/70 font-sans">{gapAnalysis.coveredCount} of {gapAnalysis.totalCount} skills</p>
            </div>

            <div className="p-3.5 border-2 border-ink bg-canvas space-y-1">
              <span className="text-[10px] text-ink/60 uppercase font-bold">SINGLE-POINT RISKS</span>
              <div className="text-3xl font-display font-black text-brutal-red">{gapAnalysis.singlePointSkills.length}</div>
              <p className="text-[10px] text-ink/70 font-sans">Bus factor = 1 competencies</p>
            </div>

            <div className="p-3.5 border-2 border-ink bg-canvas space-y-1">
              <span className="text-[10px] text-ink/60 uppercase font-bold">ACTIVE ROSTER</span>
              <div className="text-3xl font-display font-black text-ink">{activeTeam.members?.length || 0}</div>
              <p className="text-[10px] text-ink/70 font-sans">Capacity: {activeTeam.maxSize} max</p>
            </div>
          </div>

          {/* Punch-card dot matrix */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold uppercase text-ink/70 border-b border-ink/20 pb-1">
              <span>COMPETENCY PUNCH-CARD MATRIX</span>
              <span>VERIFIED ROSTER AUDIT</span>
            </div>
            <CollaborationMatrix
              requirements={activeTeam.requiredSkills || []}
              members={activeTeam.members || []}
            />
          </div>

          {/* Member Roster with Evidence Badges */}
          <div className="space-y-3">
            <div className="text-xs font-bold uppercase text-ink/70 border-b border-ink/20 pb-1">
              STUDENT MEMBER AUDIT & EVIDENCE STATUS
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {activeTeam.members?.map((m) => {
                const memberEvs = (skillEvidences || []).filter((e) => e.studentId === m.id);

                return (
                  <div key={m.id} className="p-4 border-2 border-ink bg-canvas space-y-2 text-xs">
                    <div className="flex items-center justify-between font-bold">
                      <span className="font-display font-black text-sm uppercase text-ink">{m.name}</span>
                      <span className="text-[10px] text-ink/60 uppercase">{m.role || 'Contributor'}</span>
                    </div>
                    <p className="text-[11px] text-ink/75 font-sans">
                      {m.department} · {m.year}
                    </p>
                    <div className="editorial-separator" />
                    <div className="text-[10px] space-y-1">
                      <span className="font-bold text-ink uppercase block">REGISTERED SKILLS:</span>
                      <div className="flex flex-wrap gap-1">
                        {(m.skills || []).map((sk) => {
                          const hasEv = memberEvs.some((e) => e.skill?.toLowerCase() === sk.toLowerCase());
                          return (
                            <span
                              key={sk}
                              className={`px-1.5 py-0.2 border text-[9px] uppercase font-bold ${
                                hasEv ? 'bg-campus-green text-white border-ink' : 'bg-white text-ink border-ink/40'
                              }`}
                            >
                              {sk} {hasEv ? '✓' : ''}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
