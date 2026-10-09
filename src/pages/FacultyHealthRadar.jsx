import React, { useState } from 'react';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
  Users,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import { evaluateTeamHealth } from '../services/teamHealthService';

export default function FacultyHealthRadar() {
  const { user } = useAuth();
  const { teams, projectTasks, healthAlerts, acknowledgeHealthAlert, resolveHealthAlert } = useAppData();
  const { addToast } = useToast();

  const [selectedTeamId, setSelectedTeamId] = useState(teams?.[0]?.id || 'team-1');
  const activeTeam = teams?.find((t) => t.id === selectedTeamId) || teams?.[0];

  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [facultyIntervention, setFacultyIntervention] = useState('');

  const teamTasks = (projectTasks || []).filter((t) => t.teamId === activeTeam?.id);
  const teamAlerts = (healthAlerts || []).filter((a) => a.teamId === activeTeam?.id);

  const healthEvaluation = evaluateTeamHealth(activeTeam, teamTasks, teamAlerts);

  const handleAcknowledge = async (alert) => {
    await acknowledgeHealthAlert(alert.id, user?.name || 'Faculty Supervisor');
    addToast({
      type: 'info',
      title: 'SUPERVISORY ACKNOWLEDGEMENT',
      message: `Risk #${alert.id} acknowledged by faculty.`,
    });
  };

  const handleOpenResolve = (alert) => {
    setSelectedAlert(alert);
    setFacultyIntervention('Faculty intervention executed: Authorized scope adjustment and allocated backup candidate.');
    setResolveModalOpen(true);
  };

  const handleConfirmResolve = async (e) => {
    e.preventDefault();
    if (!selectedAlert || !facultyIntervention.trim()) return;

    await resolveHealthAlert(selectedAlert.id, facultyIntervention.trim());
    addToast({
      type: 'success',
      title: 'SUPERVISORY RESOLUTION RECORDED',
      message: `Intervention logged. Alert marked Resolved.`,
    });
    setResolveModalOpen(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in font-sans">
      {/* 1. Header Stamp */}
      <div className="border-b-2 border-ink pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4 font-mono">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-brutal-red mb-1">
            <Activity className="w-4 h-4" />
            <span>FACULTY WORKFLOW // TEAM HEALTH RADAR MONITOR</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-ink uppercase tracking-tight leading-none">
            HEALTH RADAR.
          </h1>
          <p className="text-xs sm:text-sm text-ink/75 font-bold uppercase mt-2">
            PREVENTABLE DELIVERY RISKS · REAL SQUAD DATA · SUPERVISORY MITIGATION ACTIONS
          </p>
        </div>

        <div className="flex items-center gap-2">
          {teams?.map((t) => (
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

      {/* 2. Supervised Team Radar Status */}
      <div className="p-6 border-3 border-ink bg-white shadow-brutal font-mono space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-ink pb-3 text-xs">
          <div>
            <div className="text-[10px] font-bold text-ink/60 uppercase tracking-widest">
              MONITORED SQUAD // {activeTeam?.name?.toUpperCase()}
            </div>
            <h2 className="text-2xl font-display font-black text-ink uppercase">
              STATUS: {healthEvaluation?.status?.toUpperCase()}
            </h2>
          </div>

          <span className={`px-3 py-1 text-xs font-bold uppercase border-2 ${healthEvaluation?.badgeColor}`}>
            ● {healthEvaluation?.status}
          </span>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="p-3 border-2 border-ink bg-canvas space-y-1">
            <span className="text-[10px] text-ink/60 uppercase font-bold">TOTAL MILESTONES</span>
            <div className="text-2xl font-display font-black text-ink">{teamTasks.length}</div>
          </div>
          <div className="p-3 border-2 border-ink bg-canvas space-y-1">
            <span className="text-[10px] text-brutal-red uppercase font-bold">UNASSIGNED ESSENTIAL</span>
            <div className="text-2xl font-display font-black text-brutal-red">{healthEvaluation?.unassignedCount}</div>
          </div>
          <div className="p-3 border-2 border-ink bg-canvas space-y-1">
            <span className="text-[10px] text-ink/60 uppercase font-bold">OVERDUE TASKS</span>
            <div className="text-2xl font-display font-black text-ink">{healthEvaluation?.overdueCount}</div>
          </div>
          <div className="p-3 border-2 border-ink bg-canvas space-y-1">
            <span className="text-[10px] text-ink/60 uppercase font-bold">BUS FACTOR 1 RISKS</span>
            <div className="text-2xl font-display font-black text-ink">{healthEvaluation?.singlePointCount}</div>
          </div>
        </div>
      </div>

      {/* 3. Alerts List */}
      <div className="space-y-4 font-mono">
        <div className="flex items-center justify-between border-b-2 border-ink pb-2 text-xs font-bold text-ink/70 uppercase">
          <span>SUPERVISORY RISK INTERVENTIONS</span>
          <span className="text-brutal-red">{teamAlerts.filter((a) => a.status === 'Active').length} ACTIONABLE WARNINGS</span>
        </div>

        {teamAlerts.map((alert) => {
          const isActive = alert.status === 'Active';

          return (
            <div key={alert.id} className="p-6 border-2 border-ink bg-white shadow-brutal space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-ink pb-3 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 text-[10px] uppercase border ${alert.severity === 'High' ? 'bg-brutal-red text-white' : 'bg-signal-yellow text-ink'}`}>
                    {alert.severity}
                  </span>
                  <span className="font-display font-black text-base text-ink uppercase">
                    {alert.title}
                  </span>
                </div>

                <span className={`px-2 py-0.5 border text-[10px] uppercase ${alert.status === 'Resolved' ? 'bg-campus-green text-white' : 'bg-white text-ink'}`}>
                  {alert.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-sans">
                <div className="p-3 border border-ink bg-canvas font-mono space-y-1">
                  <span className="text-[10px] font-bold text-ink/60 uppercase block">DETECTED:</span>
                  <p className="text-ink">{alert.whatDetected}</p>
                </div>
                <div className="p-3 border border-ink bg-canvas font-mono space-y-1">
                  <span className="text-[10px] font-bold text-ink/60 uppercase block">EVIDENCE:</span>
                  <p className="text-ink">{alert.supportingEvidence}</p>
                </div>
                <div className="p-3 border border-ink bg-canvas font-mono space-y-1">
                  <span className="text-[10px] font-bold text-ink/60 uppercase block">AFFECTED DELIVERABLE:</span>
                  <p className="text-brutal-red font-bold font-mono">{alert.deliverableAffected}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-ink/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="text-[10px] text-ink/60 uppercase">
                  DETECTED: {new Date(alert.detectedAt).toLocaleDateString()} {alert.acknowledgedBy ? `// ACKNOWLEDGED: ${alert.acknowledgedBy}` : ''}
                </div>

                <div className="flex items-center gap-2">
                  {isActive && !alert.acknowledgedBy && (
                    <Button variant="outline" size="sm" onClick={() => handleAcknowledge(alert)} className="text-xs">
                      [ ACKNOWLEDGE AS SUPERVISOR ]
                    </Button>
                  )}
                  {isActive && (
                    <Button variant="danger" size="sm" onClick={() => handleOpenResolve(alert)} className="text-xs">
                      [ EXECUTE INTERVENTION → ]
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resolve Modal */}
      <Modal
        isOpen={resolveModalOpen}
        onClose={() => setResolveModalOpen(false)}
        title="EXECUTE SUPERVISORY INTERVENTION"
        description="Record formal faculty guidance, deadline adjustment, or scope pruning."
      >
        <form onSubmit={handleConfirmResolve} className="space-y-4 font-mono">
          <p className="text-xs text-ink/80 font-sans">
            Resolving Risk: <strong>{selectedAlert?.title}</strong>
          </p>

          <Input
            label="FACULTY INTERVENTION DIRECTIVE"
            value={facultyIntervention}
            onChange={(e) => setFacultyIntervention(e.target.value)}
            required
          />

          <div className="pt-3 border-t-2 border-ink flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setResolveModalOpen(false)}>
              CANCEL
            </Button>
            <Button variant="primary" size="sm" type="submit">
              [ COMMIT INTERVENTION ✓ ]
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
