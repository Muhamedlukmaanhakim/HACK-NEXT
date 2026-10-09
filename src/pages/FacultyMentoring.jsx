import React, { useState } from 'react';
import {
  HelpCircle,
  Clock,
  CheckCircle2,
  Calendar,
  MessageSquare,
  ArrowRight,
  Building,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Textarea from '../components/ui/Textarea';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const INITIAL_MENTOR_REQUESTS = [
  {
    id: 'req-m-1',
    teamName: 'AI Healthcare Assistant',
    studentName: 'Lukmaan Hakim',
    topic: '1D-CNN Model Architecture & MIT-BIH Arrhythmia Baseline Review',
    preferredSlot: 'Thursday, Oct 15, 3:30 PM',
    status: 'Scheduled',
    notes: 'Scheduled for Turing Hall Room 412. Requested review of signal filtering latency before Trial Sprint submission.',
  },
  {
    id: 'req-m-2',
    teamName: 'Campus Event Platform',
    studentName: 'Neha Gupta',
    topic: 'Scalable QR Scanning Microservices & High-Volume Concurrency',
    preferredSlot: 'Friday, Oct 16, 11:00 AM',
    status: 'Pending',
    notes: 'Student squad seeks guidance on handling burst traffic during college fest registrations.',
  },
];

export default function FacultyMentoring() {
  const { user } = useAuth();
  const { addToast } = useToast();

  const [requests, setRequests] = useState(INITIAL_MENTOR_REQUESTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReq, setSelectedReq] = useState(null);
  const [guidanceNote, setGuidanceNote] = useState('');

  const handleOpenApprove = (req) => {
    setSelectedReq(req);
    setGuidanceNote('Confirmed for Turing Hall 412. Please bring benchmark logs and prototype device.');
    setModalOpen(true);
  };

  const handleConfirmApprove = (e) => {
    e.preventDefault();
    if (!selectedReq) return;

    setRequests((prev) =>
      prev.map((r) =>
        r.id === selectedReq.id
          ? { ...r, status: 'Scheduled', notes: guidanceNote }
          : r
      )
    );

    addToast({
      type: 'success',
      title: 'ADVISORY SESSION CONFIRMED',
      message: `Office hours session confirmed for ${selectedReq.teamName}.`,
    });
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in font-sans">
      {/* 1. Header Stamp */}
      <div className="border-b-2 border-ink pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4 font-mono">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink/60 mb-1">
            <HelpCircle className="w-4 h-4 text-ink" />
            <span>FACULTY WORKFLOW // MENTORING & OFFICE HOURS ADVISORY</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-ink uppercase tracking-tight leading-none">
            MENTORING.
          </h1>
          <p className="text-xs sm:text-sm text-ink/75 font-bold uppercase mt-2">
            GUIDE STUDENT TEAMS · SQUAD CLINICAL SESSIONS · RECORD TECHNICAL FEEDBACK
          </p>
        </div>

        <div className="text-xs font-mono font-bold bg-canvas border-2 border-ink p-3 shadow-brutal-sm space-y-0.5">
          <div className="uppercase text-ink font-bold">OFFICE HOURS:</div>
          <div className="text-[11px] text-ink/80">{user?.officeHours || 'Tuesdays & Thursdays, 3:00 PM – 5:00 PM'}</div>
          <div className="text-[10px] text-ink/60">{user?.officeLocation || 'Turing Hall, Room 412'}</div>
        </div>
      </div>

      {/* 2. Advisory Requests List */}
      <div className="space-y-4 font-mono">
        <div className="flex items-center justify-between border-b-2 border-ink pb-2 text-xs font-bold text-ink/70 uppercase">
          <span>STUDENT SQUAD ADVISORY REQUESTS</span>
          <span>{requests.length} INCOMING INQUIRIES</span>
        </div>

        {requests.map((req) => (
          <div key={req.id} className="p-6 border-2 border-ink bg-white shadow-brutal space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-ink pb-3 text-xs">
              <div>
                <span className="font-display font-black text-lg text-ink uppercase">
                  {req.teamName}
                </span>
                <span className="text-[10px] text-ink/60 uppercase block">
                  LEAD: {req.studentName} · PREFERRED TIME: {req.preferredSlot}
                </span>
              </div>

              <span
                className={`px-2.5 py-0.5 text-xs font-bold uppercase border ${
                  req.status === 'Scheduled'
                    ? 'bg-campus-green text-white border-ink'
                    : 'bg-signal-yellow text-ink border-ink'
                }`}
              >
                ● {req.status}
              </span>
            </div>

            <div className="text-xs font-sans space-y-2">
              <div className="p-3 border border-ink bg-canvas font-mono space-y-1">
                <span className="text-[10px] font-bold text-ink/60 uppercase block">INQUIRY TOPIC:</span>
                <p className="text-ink font-normal">{req.topic}</p>
              </div>

              {req.notes && (
                <div className="p-3 border border-ink bg-white font-mono text-[11px] space-y-0.5">
                  <span className="text-[10px] font-bold text-ink/60 uppercase block">ADVISORY DIRECTIVE:</span>
                  <p className="text-ink font-normal">{req.notes}</p>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-ink/20 flex justify-end">
              {req.status !== 'Scheduled' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleOpenApprove(req)}
                  className="text-xs font-bold"
                >
                  [ CONFIRM OFFICE HOURS ADVISORY → ]
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="CONFIRM MENTORING SESSION"
        description="Provide meeting instructions and office hours logistics for the team."
      >
        <form onSubmit={handleConfirmApprove} className="space-y-4 font-mono">
          <p className="text-xs text-ink/80 font-sans">
            Session for: <strong>{selectedReq?.teamName}</strong> ({selectedReq?.preferredSlot}).
          </p>

          <Textarea
            label="FACULTY ADVISORY DIRECTIVE & LOGISTICS"
            rows={3}
            value={guidanceNote}
            onChange={(e) => setGuidanceNote(e.target.value)}
            required
          />

          <div className="pt-3 border-t-2 border-ink flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              CANCEL
            </Button>
            <Button variant="danger" size="sm" type="submit">
              [ CONFIRM SESSION ✓ ]
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
