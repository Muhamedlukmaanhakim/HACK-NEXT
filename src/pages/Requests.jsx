import React, { useState } from 'react';
import { Inbox, Send, AlertTriangle } from 'lucide-react';
import Tabs from '../components/ui/Tabs';
import RequestCard from '../components/cards/RequestCard';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';

export default function Requests() {
  const { requests, acceptRequest, declineRequest } = useAppData();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('incoming');
  const [declineModalState, setDeclineModalState] = useState({ isOpen: false, request: null });

  const incomingRequests = (requests || []).filter((r) => r.type === 'incoming');
  const sentRequests = (requests || []).filter((r) => r.type === 'sent');

  const pendingIncomingCount = incomingRequests.filter((r) => r.status === 'Pending').length;
  const pendingSentCount = sentRequests.filter((r) => r.status === 'Pending').length;

  const handleAccept = async (req) => {
    await acceptRequest(req.id);
    addToast({
      type: 'success',
      title: 'COLLABORATION CONFIRMED',
      message: `${req.student?.name} has joined your project roster!`,
    });
  };

  const handleConfirmDecline = async () => {
    if (!declineModalState.request) return;
    await declineRequest(declineModalState.request.id);
    addToast({
      type: 'info',
      title: 'REQUEST ARCHIVED',
      message: `Declined request from ${declineModalState.request.student?.name}.`,
    });
    setDeclineModalState({ isOpen: false, request: null });
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in font-sans">
      {/* 1. Header (Section 24) */}
      <div className="border-b-2 border-ink pb-5 font-mono">
        <div className="text-xs font-bold uppercase tracking-wider text-ink/60 mb-2">
          05 / COLLABORATION REQUESTS
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-black text-ink uppercase tracking-tight leading-none">
          NOTICES & DISPATCHES
        </h1>
        <p className="text-xs sm:text-sm text-ink/70 font-bold uppercase mt-2">
          INBOUND MEMBERSHIP REQUESTS & OUTBOUND RECRUITMENT
        </p>
      </div>

      {/* 2. Tabs */}
      <Tabs
        tabs={[
          { id: 'incoming', label: 'INCOMING REQUESTS', count: pendingIncomingCount },
          { id: 'sent', label: 'OUTGOING DISPATCHES', count: pendingSentCount },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* 3. Requests Grid */}
      <div className="space-y-4">
        {activeTab === 'incoming' ? (
          incomingRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {incomingRequests.map((req) => (
                <RequestCard
                  key={req.id}
                  request={req}
                  type="incoming"
                  onAccept={handleAccept}
                  onDecline={(r) => setDeclineModalState({ isOpen: true, request: r })}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Inbox}
              title="NO INCOMING NOTICES"
              description="When students discover your opportunities and apply, their notices will appear here."
            />
          )
        ) : (
          sentRequests.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sentRequests.map((req) => (
                <RequestCard
                  key={req.id}
                  request={req}
                  type="sent"
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Send}
              title="NO TRANSMITTED NOTICES"
              description="You have not transmitted invitations to any collaborators yet."
            />
          )
        )}
      </div>

      {/* Decline Confirmation Modal */}
      <Modal
        isOpen={declineModalState.isOpen}
        onClose={() => setDeclineModalState({ isOpen: false, request: null })}
        title="DECLINE NOTICE?"
        description="Confirm archive of this collaboration request."
        footer={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDeclineModalState({ isOpen: false, request: null })}
            >
              CANCEL
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmDecline}
            >
              DECLINE
            </Button>
          </>
        }
      >
        <div className="p-3 bg-canvas border-2 border-ink flex items-center gap-2 text-xs text-ink font-mono font-bold">
          <AlertTriangle className="w-4 h-4 text-brutal-red flex-shrink-0 stroke-[2.5]" />
          <span>The applicant will receive notification that the project is currently full.</span>
        </div>
      </Modal>
    </div>
  );
}
