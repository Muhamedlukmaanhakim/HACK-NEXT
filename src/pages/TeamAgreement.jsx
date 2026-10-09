import React, { useState } from 'react';
import {
  FileCheck2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  Edit3,
  Users,
  Award,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Textarea from '../components/ui/Textarea';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';

export default function TeamAgreement() {
  const { user } = useAuth();
  const { teamAgreements, teams, acknowledgeAgreement } = useAppData();
  const { addToast } = useToast();

  const agreement = teamAgreements?.[0];
  const activeTeam = teams?.[0];

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editedTerms, setEditedTerms] = useState(agreement?.terms || {});

  const hasUserSigned = (agreement?.signOffs || []).some((s) => s.studentId === user?.id);

  const handleAcknowledge = () => {
    if (!agreement || !user) return;
    acknowledgeAgreement(agreement.id, { id: user.id, name: user.name });
    addToast({
      type: 'success',
      title: 'AGREEMENT SIGNED',
      message: 'You have acknowledged and signed the team collaboration charter.',
    });
  };

  const handleSaveTerms = (e) => {
    e.preventDefault();
    if (agreement) {
      agreement.terms = { ...editedTerms };
      agreement.lastUpdated = new Date().toISOString();
    }
    addToast({
      type: 'info',
      title: 'CHARTER UPDATED',
      message: 'Collaboration terms updated and logged to audit trail.',
    });
    setEditModalOpen(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in font-sans">
      {/* 1. Header Stamp */}
      <div className="border-b-2 border-ink pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4 font-mono">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink/60 mb-1">
            <FileCheck2 className="w-4 h-4 text-ink" />
            <span>COLLABORATION GOVERNANCE // SECTION 12</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-ink uppercase tracking-tight leading-none">
            TEAM AGREEMENT.
          </h1>
          <p className="text-xs sm:text-sm text-ink/75 font-bold uppercase mt-2">
            PRE-PROJECT COMMITMENTS · AVAILABILITY · AI ATTRIBUTION RULES · BLOCKER ESCALATION
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" icon={Edit3} onClick={() => setEditModalOpen(true)}>
            [ AMEND CHARTER ]
          </Button>
          {!hasUserSigned && (
            <Button variant="danger" size="md" icon={CheckCircle2} onClick={handleAcknowledge}>
              [ SIGN AGREEMENT ✓ ]
            </Button>
          )}
        </div>
      </div>

      {/* 2. Charter Document Container */}
      <div className="p-6 sm:p-8 bg-white border-3 border-ink shadow-brutal font-mono space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-ink pb-3">
          <div>
            <div className="text-[10px] font-bold text-ink/60 uppercase tracking-widest">
              PROJECT CHARTER // {activeTeam?.name?.toUpperCase() || 'AI HEALTHCARE ASSISTANT'}
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-black text-ink uppercase">
              COLLABORATION WORKING AGREEMENT
            </h2>
          </div>
          <div className="text-left sm:text-right text-xs">
            <span className="bg-canvas border border-ink px-2 py-0.5 text-ink/75 uppercase text-[10px]">
              VERSION 1.4 // RATIFIED
            </span>
          </div>
        </div>

        {/* Clauses Grid */}
        <div className="space-y-4 text-xs font-sans">
          {/* Clause 1 */}
          <div className="p-4 border-2 border-ink bg-canvas space-y-1">
            <div className="text-[10px] font-mono font-bold text-ink/60 uppercase">
              CLAUSE 01 // ROLES & RESPONSIBILITIES
            </div>
            <p className="text-ink leading-relaxed font-normal">{agreement?.terms?.responsibilities}</p>
          </div>

          {/* Clause 2 */}
          <div className="p-4 border-2 border-ink bg-white space-y-1">
            <div className="text-[10px] font-mono font-bold text-ink/60 uppercase">
              CLAUSE 02 // STATED AVAILABILITY & SPRINT HOURS
            </div>
            <p className="text-ink leading-relaxed font-normal">{agreement?.terms?.weeklyAvailability}</p>
          </div>

          {/* Clause 3 */}
          <div className="p-4 border-2 border-ink bg-canvas space-y-1">
            <div className="text-[10px] font-mono font-bold text-ink/60 uppercase">
              CLAUSE 03 // COMMUNICATION CHANNELS & SYNC CADENCE
            </div>
            <p className="text-ink leading-relaxed font-normal">{agreement?.terms?.communicationChannels}</p>
          </div>

          {/* Clause 4 */}
          <div className="p-4 border-2 border-ink bg-white space-y-1">
            <div className="text-[10px] font-mono font-bold text-ink/60 uppercase">
              CLAUSE 04 // DECISION-MAKING & DEADLOCK PROTOCOL
            </div>
            <p className="text-ink leading-relaxed font-normal">{agreement?.terms?.decisionProtocol}</p>
          </div>

          {/* Clause 5 */}
          <div className="p-4 border-2 border-ink bg-signal-yellow/15 space-y-1">
            <div className="text-[10px] font-mono font-bold text-ink uppercase flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-brutal-red" />
              CLAUSE 05 // AI-USE & ATTRIBUTION POLICY
            </div>
            <p className="text-ink leading-relaxed font-normal">{agreement?.terms?.aiUsePolicy}</p>
          </div>

          {/* Clause 6 */}
          <div className="p-4 border-2 border-ink bg-white space-y-1">
            <div className="text-[10px] font-mono font-bold text-ink/60 uppercase">
              CLAUSE 06 // BLOCKER REPORTING & UNAVAILABILITY REDISTRIBUTION
            </div>
            <p className="text-ink leading-relaxed font-normal">{agreement?.terms?.blockerHandling}</p>
          </div>

          {/* Clause 7 */}
          <div className="p-4 border-2 border-ink bg-canvas space-y-1">
            <div className="text-[10px] font-mono font-bold text-ink/60 uppercase">
              CLAUSE 07 // REVIEW TURNAROUND SLA
            </div>
            <p className="text-ink leading-relaxed font-normal">{agreement?.terms?.reviewTurnaround}</p>
          </div>
        </div>

        {/* Member Sign-Off Roster */}
        <div className="pt-4 border-t-2 border-ink space-y-3 font-mono">
          <div className="flex items-center justify-between text-xs font-bold uppercase text-ink/70">
            <span>MEMBER RATIFICATION LEDGER</span>
            <span>{agreement?.signOffs?.length || 0} SIGNED</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {agreement?.signOffs?.map((sign) => (
              <div key={sign.studentId} className="p-3 border-2 border-ink bg-canvas flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-ink uppercase">{sign.name}</div>
                  <div className="text-[10px] text-ink/60">{new Date(sign.signedAt).toLocaleDateString()}</div>
                </div>
                <span className="text-[10px] font-bold bg-campus-green text-white px-2 py-0.5 border border-ink uppercase">
                  SIGNED ✓
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal: Amend Charter */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="AMEND TEAM CHARTER"
        description="Update collaboration terms with team consensus."
      >
        <form onSubmit={handleSaveTerms} className="space-y-4 font-mono">
          <Textarea
            label="RESPONSIBILITIES & TASK OWNERSHIP"
            rows={2}
            value={editedTerms.responsibilities || ''}
            onChange={(e) => setEditedTerms({ ...editedTerms, responsibilities: e.target.value })}
          />

          <Textarea
            label="WEEKLY AVAILABILITY COMMITMENT"
            rows={2}
            value={editedTerms.weeklyAvailability || ''}
            onChange={(e) => setEditedTerms({ ...editedTerms, weeklyAvailability: e.target.value })}
          />

          <Textarea
            label="AI-USE & ATTRIBUTION POLICY"
            rows={2}
            value={editedTerms.aiUsePolicy || ''}
            onChange={(e) => setEditedTerms({ ...editedTerms, aiUsePolicy: e.target.value })}
          />

          <Textarea
            label="BLOCKER ESCALATION & REDISTRIBUTION"
            rows={2}
            value={editedTerms.blockerHandling || ''}
            onChange={(e) => setEditedTerms({ ...editedTerms, blockerHandling: e.target.value })}
          />

          <div className="pt-3 border-t-2 border-ink flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditModalOpen(false)}>
              CANCEL
            </Button>
            <Button variant="danger" size="sm" type="submit">
              [ SAVE CHARTER AMENDMENTS → ]
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
