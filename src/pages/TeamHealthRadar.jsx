import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Plus,
  ShieldAlert,
  ArrowRight,
  UserCheck,
  Check,
  RotateCcw,
  Sliders,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import { evaluateTeamHealth } from '../services/teamHealthService';

export default function TeamHealthRadar() {
  const { user } = useAuth();
  const {
    teams,
    projectTasks,
    healthAlerts,
    createProjectTask,
    updateProjectTask,
    acknowledgeHealthAlert,
    resolveHealthAlert,
  } = useAppData();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [createTaskModalOpen, setCreateTaskModalOpen] = useState(false);
  const [resolveModalOpen, setResolveModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [resolutionNote, setResolutionNote] = useState('');

  // Task creation form
  const [newTaskForm, setNewTaskForm] = useState({
    title: '',
    deliverable: '',
    assignedToId: '',
    isEssential: true,
    requiredSkill: 'Python',
    deadline: '',
    estimatedHours: 10,
  });

  const activeTeam = teams?.[0];
  const teamTasks = (projectTasks || []).filter((t) => t.teamId === (activeTeam?.id || 'team-1'));
  const teamAlerts = (healthAlerts || []).filter((a) => a.teamId === (activeTeam?.id || 'team-1'));

  // Deterministic evaluation from real state
  const healthEvaluation = useMemo(() => {
    return evaluateTeamHealth(activeTeam, teamTasks, teamAlerts);
  }, [activeTeam, teamTasks, teamAlerts]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskForm.title.trim() || !newTaskForm.deliverable.trim()) {
      addToast({ type: 'error', title: 'Missing Information', message: 'Specify task title and deliverable.' });
      return;
    }

    const assignedMember = activeTeam?.members?.find((m) => m.id === newTaskForm.assignedToId);

    await createProjectTask({
      teamId: activeTeam?.id || 'team-1',
      title: newTaskForm.title.trim(),
      deliverable: newTaskForm.deliverable.trim(),
      assignedToId: newTaskForm.assignedToId || null,
      assignedToName: assignedMember ? assignedMember.name : null,
      isEssential: Boolean(newTaskForm.isEssential),
      requiredSkill: newTaskForm.requiredSkill,
      deadline: newTaskForm.deadline || null,
      estimatedHours: Number(newTaskForm.estimatedHours) || 8,
    });

    addToast({
      type: 'success',
      title: 'PROJECT TASK CREATED',
      message: 'Deliverable registered in dependency tracker.',
    });
    setCreateTaskModalOpen(false);
    setNewTaskForm({
      title: '',
      deliverable: '',
      assignedToId: '',
      isEssential: true,
      requiredSkill: 'Python',
      deadline: '',
      estimatedHours: 10,
    });
  };

  const handleAcknowledge = async (alert) => {
    await acknowledgeHealthAlert(alert.id, user?.name || 'Team Lead');
    addToast({
      type: 'info',
      title: 'RISK ACKNOWLEDGED',
      message: `Risk alert #${alert.id} acknowledged by team leadership.`,
    });
  };

  const handleOpenResolve = (alert) => {
    setSelectedAlert(alert);
    setResolutionNote('');
    setResolveModalOpen(true);
  };

  const handleConfirmResolve = async (e) => {
    e.preventDefault();
    if (!resolutionNote.trim()) return;

    await resolveHealthAlert(selectedAlert.id, resolutionNote.trim());
    addToast({
      type: 'success',
      title: 'RISK RESOLVED',
      message: `Action recorded. Risk alert marked as resolved.`,
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
            <span>PRIORITY FEATURE 03 // TEAM HEALTH RADAR</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-ink uppercase tracking-tight leading-none">
            TEAM HEALTH RADAR.
          </h1>
          <p className="text-xs sm:text-sm text-ink/75 font-bold uppercase mt-2">
            PREVENTABLE DELIVERY RISKS · REAL PROJECT DATA · ACTIONABLE MITIGATIONS
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            icon={Sliders}
            onClick={() => navigate('/team/simulator')}
          >
            [ WHAT-IF SIMULATOR ]
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={Plus}
            onClick={() => setCreateTaskModalOpen(true)}
          >
            [ + ADD DELIVERABLE TASK → ]
          </Button>
        </div>
      </div>

      {/* 2. Top Radar Health Diagnosis Banner */}
      <div className="p-6 border-3 border-ink bg-white shadow-brutal font-mono space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b-2 border-ink pb-4">
          <div className="space-y-1">
            <div className="text-[10px] font-bold text-ink/60 uppercase tracking-widest">
              PROJECT TELEMETRY STATUS // {activeTeam?.name?.toUpperCase() || 'AI HEALTHCARE ASSISTANT'}
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-ink uppercase tracking-tight">
              HEALTH STATE: {healthEvaluation?.status?.toUpperCase()}
            </h2>
          </div>

          <div className="text-left sm:text-right">
            <span className={`text-xs font-bold px-3 py-1 border-2 uppercase ${healthEvaluation?.badgeColor}`}>
              ● {healthEvaluation?.status}
            </span>
          </div>
        </div>

        {/* Telemetry Metrics Quad */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs pt-1">
          <div className="p-3 border-2 border-ink bg-canvas space-y-1">
            <span className="text-[10px] text-ink/60 uppercase font-bold">TOTAL DELIVERABLES</span>
            <div className="text-2xl font-display font-black text-ink">{teamTasks.length}</div>
          </div>

          <div className="p-3 border-2 border-ink bg-canvas space-y-1">
            <span className="text-[10px] text-brutal-red uppercase font-bold">UNASSIGNED ESSENTIAL</span>
            <div className="text-2xl font-display font-black text-brutal-red">
              {healthEvaluation?.unassignedCount || 0}
            </div>
          </div>

          <div className="p-3 border-2 border-ink bg-canvas space-y-1">
            <span className="text-[10px] text-ink/60 uppercase font-bold">OVERDUE DELIVERABLES</span>
            <div className="text-2xl font-display font-black text-ink">
              {healthEvaluation?.overdueCount || 0}
            </div>
          </div>

          <div className="p-3 border-2 border-ink bg-canvas space-y-1">
            <span className="text-[10px] text-ink/60 uppercase font-bold">SINGLE-PERSON RISKS</span>
            <div className="text-2xl font-display font-black text-ink">
              {healthEvaluation?.singlePointCount || 0}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Detected Delivery Risk Cards */}
      <div className="space-y-4 font-mono">
        <div className="flex items-center justify-between border-b-2 border-ink pb-2 text-xs font-bold text-ink/70 uppercase">
          <span>DETECTED DELIVERY RISKS & PREVENTATIVE ACTIONS</span>
          <span className="text-brutal-red">{teamAlerts.filter((a) => a.status === 'Active').length} ACTIVE ALERTS</span>
        </div>

        {teamAlerts.map((alert) => {
          const isActive = alert.status === 'Active';

          return (
            <div
              key={alert.id}
              className={`p-5 sm:p-6 border-2 border-ink shadow-brutal space-y-4 ${
                alert.severity === 'High' && isActive
                  ? 'bg-brutal-red/5'
                  : 'bg-white'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-ink pb-3">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-bold border uppercase ${
                      alert.severity === 'High'
                        ? 'bg-brutal-red text-white'
                        : alert.severity === 'Medium'
                        ? 'bg-signal-yellow text-ink'
                        : 'bg-canvas text-ink'
                    }`}
                  >
                    SEVERITY: {alert.severity}
                  </span>
                  <h3 className="font-display font-black text-base text-ink uppercase">
                    {alert.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="bg-canvas border border-ink px-2 py-0.5 text-ink/75 uppercase text-[10px]">
                    CAT: {alert.category}
                  </span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold uppercase border ${alert.status === 'Resolved' ? 'bg-campus-green text-white' : 'bg-white text-ink'}`}>
                    {alert.status}
                  </span>
                </div>
              </div>

              {/* Forensic Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-sans">
                <div className="p-3 border border-ink bg-canvas font-mono space-y-1">
                  <span className="text-[10px] font-bold text-ink/60 uppercase block">WHAT WAS DETECTED:</span>
                  <p className="text-ink font-normal">{alert.whatDetected}</p>
                </div>

                <div className="p-3 border border-ink bg-canvas font-mono space-y-1">
                  <span className="text-[10px] font-bold text-ink/60 uppercase block">SUPPORTING EVIDENCE:</span>
                  <p className="text-ink font-normal">{alert.supportingEvidence}</p>
                </div>

                <div className="p-3 border border-ink bg-canvas font-mono space-y-1">
                  <span className="text-[10px] font-bold text-ink/60 uppercase block">DELIVERABLE AFFECTED:</span>
                  <p className="text-brutal-red font-bold font-mono">{alert.deliverableAffected}</p>
                </div>
              </div>

              {/* Recommended Actions */}
              <div className="space-y-1.5 font-mono text-xs">
                <span className="text-[10px] font-bold text-ink/60 uppercase block">RECOMMENDED CORRECTIVE INTERVENTIONS:</span>
                <div className="space-y-1">
                  {alert.recommendedActions?.map((act, i) => (
                    <div key={i} className="flex items-start gap-2 p-2 border border-ink/40 bg-white">
                      <span className="text-brutal-red font-bold">↳</span>
                      <span className="font-sans text-xs text-ink/90 font-medium">{act}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-ink/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="text-[10px] text-ink/60 uppercase">
                  DETECTED: {new Date(alert.detectedAt).toLocaleDateString()} {alert.acknowledgedBy ? `// ACKNOWLEDGED BY: ${alert.acknowledgedBy}` : ''}
                </div>

                <div className="flex items-center gap-2">
                  {isActive && !alert.acknowledgedBy && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAcknowledge(alert)}
                      className="text-xs"
                    >
                      [ ACKNOWLEDGE ALERT ]
                    </Button>
                  )}

                  {isActive && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleOpenResolve(alert)}
                      className="text-xs"
                    >
                      [ RESOLVE WITH ACTION → ]
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 4. Project Deliverables Task Ledger Table */}
      <div className="space-y-3 font-mono">
        <div className="flex items-center justify-between border-b-2 border-ink pb-2 text-xs font-bold text-ink/70 uppercase">
          <span>PROJECT DELIVERABLE & DEPENDENCY LEDGER</span>
          <span>{teamTasks.length} MILESTONE TASKS</span>
        </div>

        <div className="border-2 border-ink bg-white shadow-brutal overflow-x-auto">
          <table className="w-full text-left text-xs divide-y-2 divide-ink">
            <thead className="bg-canvas uppercase text-[10px] font-bold text-ink/75">
              <tr>
                <th className="p-3 border-r-2 border-ink">DELIVERABLE</th>
                <th className="p-3 border-r-2 border-ink">ASSIGNEE</th>
                <th className="p-3 border-r-2 border-ink">SKILL</th>
                <th className="p-3 border-r-2 border-ink">DEADLINE</th>
                <th className="p-3 border-r-2 border-ink">HOURS</th>
                <th className="p-3">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y border-ink">
              {teamTasks.map((task) => (
                <tr key={task.id} className="hover:bg-canvas transition-colors">
                  <td className="p-3 border-r-2 border-ink font-bold">
                    <div>{task.title}</div>
                    <div className="text-[10px] text-ink/60 font-sans font-normal">{task.deliverable}</div>
                  </td>
                  <td className="p-3 border-r-2 border-ink">
                    {task.assignedToName ? (
                      <span className="font-bold text-ink uppercase">{task.assignedToName}</span>
                    ) : (
                      <span className="text-brutal-red font-bold uppercase bg-brutal-red/10 px-1.5 py-0.5 border border-brutal-red">
                        ⚠ UNASSIGNED
                      </span>
                    )}
                  </td>
                  <td className="p-3 border-r-2 border-ink uppercase">{task.requiredSkill}</td>
                  <td className="p-3 border-r-2 border-ink">
                    {task.deadline || 'No cutoff'}
                  </td>
                  <td className="p-3 border-r-2 border-ink">{task.estimatedHours}h</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 border border-ink uppercase text-[10px] font-bold bg-canvas">
                      {task.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal 1: Create Task */}
      <Modal
        isOpen={createTaskModalOpen}
        onClose={() => setCreateTaskModalOpen(false)}
        title="ADD PROJECT DELIVERABLE TASK"
        description="Attach a deliverable to dependency graph for proactive risk monitoring."
      >
        <form onSubmit={handleCreateTask} className="space-y-4 font-mono">
          <Input
            label="TASK TITLE"
            placeholder="e.g. WebSocket Telemetry Server"
            value={newTaskForm.title}
            onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
            required
          />

          <Input
            label="PARENT DELIVERABLE / MILESTONE"
            placeholder="e.g. Real-Time Ingestion Engine"
            value={newTaskForm.deliverable}
            onChange={(e) => setNewTaskForm({ ...newTaskForm, deliverable: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="ASSIGNED CONTRIBUTOR"
              value={newTaskForm.assignedToId}
              onChange={(e) => setNewTaskForm({ ...newTaskForm, assignedToId: e.target.value })}
              options={[
                { value: '', label: '[ UNASSIGNED - NEEDS CONTRIBUTOR ]' },
                ...(activeTeam?.members || []).map((m) => ({ value: m.id, label: m.name.toUpperCase() })),
              ]}
            />
            <Input
              label="REQUIRED COMPETENCY"
              value={newTaskForm.requiredSkill}
              placeholder="e.g. Python, UI/UX"
              onChange={(e) => setNewTaskForm({ ...newTaskForm, requiredSkill: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="DEADLINE DATE"
              type="date"
              value={newTaskForm.deadline}
              onChange={(e) => setNewTaskForm({ ...newTaskForm, deadline: e.target.value })}
            />
            <Input
              label="ESTIMATED EFFORT (HOURS)"
              type="number"
              value={newTaskForm.estimatedHours}
              onChange={(e) => setNewTaskForm({ ...newTaskForm, estimatedHours: e.target.value })}
            />
          </div>

          <div className="pt-3 border-t-2 border-ink flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setCreateTaskModalOpen(false)}>
              CANCEL
            </Button>
            <Button variant="danger" size="sm" type="submit">
              [ SAVE TASK → ]
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal 2: Resolve Risk Alert */}
      <Modal
        isOpen={resolveModalOpen}
        onClose={() => setResolveModalOpen(false)}
        title="RECORD RISK RESOLUTION"
        description="Explain what corrective action was executed to resolve this warning."
      >
        <form onSubmit={handleConfirmResolve} className="space-y-4 font-mono">
          <p className="text-xs text-ink/80 font-sans">
            Resolving: <strong>{selectedAlert?.title}</strong>
          </p>

          <Input
            label="CORRECTIVE ACTION EXECUTED"
            placeholder="e.g. Reassigned Task-104 to Sarah Rahman following Trial Sprint clearance."
            value={resolutionNote}
            onChange={(e) => setResolutionNote(e.target.value)}
            required
          />

          <div className="pt-3 border-t-2 border-ink flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setResolveModalOpen(false)}>
              CANCEL
            </Button>
            <Button variant="primary" size="sm" type="submit">
              [ MARK RESOLVED ✓ ]
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
