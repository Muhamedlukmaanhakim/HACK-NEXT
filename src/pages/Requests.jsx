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
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b-3 border-ink pb-6">
        <div className="text-xs font-mono font-bold uppercase tracking-wider text-brutal-red mb-1">
          05 / COLLABORATION REQUESTS
        </div>
        <h1 className="text-3xl sm:text-5xl font-display font-black text-ink uppercase tracking-tight leading-none">
          INBOX & SENT INVITATIONS.
        </h1>
        <p className="text-xs sm:text-sm font-mono text-ink/70 font-semibold uppercase mt-2">
          REVIEW INBOUND APPLICATIONS AND MONITOR OUTGOING INVITATIONS
        </p>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'incoming', label: 'Incoming Dispatches', count: pendingIncomingCount },
          { id: 'sent', label: 'Transmitted Invitations', count: pendingSentCount },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {/* Content */}
      <div className="space-y-4">
        {activeTab === 'incoming' ? (
          incomingRequests.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
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
              title="NO INCOMING COLLABORATION REQUESTS"
              description="When students discover your opportunities and apply, their dispatches will appear here."
            />
          )
        ) : (
          sentRequests.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
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
              title="NO TRANSMITTED INVITATIONS"
              description="You have not transmitted invitations to any collaborators yet. Explore students or inspect matches to connect."
            />
          )
        )}
      </div>

      {/* Decline Confirmation Modal */}
      <Modal
        isOpen={declineModalState.isOpen}
        onClose={() => setDeclineModalState({ isOpen: false, request: null })}
        title="DECLINE COLLABORATION REQUEST?"
        description="Confirm rejection of this student's request to join your project roster."
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
              DECLINE DISPATCH
            </Button>
          </>
        }
      >
        <div className="p-3 bg-canvas border-2 border-ink flex items-center gap-2.5 text-xs text-ink font-mono font-bold">
          <AlertTriangle className="w-4 h-4 text-brutal-red flex-shrink-0 stroke-[2.5]" />
          <span>The applicant will receive notification that the project roster is currently full.</span>
        </div>
      </Modal>
    </div>
  );
}
