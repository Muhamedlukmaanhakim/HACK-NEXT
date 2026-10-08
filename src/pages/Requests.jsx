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
      title: 'Collaboration Confirmed',
      message: `${req.student?.name} has been enrolled into your project roster!`,
    });
  };

  const handleConfirmDecline = async () => {
    if (!declineModalState.request) return;
    await declineRequest(declineModalState.request.id);
    addToast({
      type: 'info',
      title: 'Request Archived',
      message: `Declined request from ${declineModalState.request.student?.name}.`,
    });
    setDeclineModalState({ isOpen: false, request: null });
  };

  return (
    <div className="space-y-6 animate-fade-in font-mono">
      {/* Header */}
      <div className="border-b border-retro-border pb-4">
        <div className="text-[10px] text-retro-muted uppercase tracking-widest mb-1">
          [ SECTION 09 // ESTABLISH CONNECTION ]
        </div>
        <h1 className="text-xl sm:text-2xl font-display font-bold text-retro-paper tracking-wide uppercase">
          ESTABLISH CONNECTION <span className="text-retro-orange">//</span> REQUESTS
        </h1>
        <p className="text-xs text-retro-muted font-sans mt-0.5">
          Review inbound applications to join your projects and monitor outgoing team invitations.
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
      <div className="space-y-3.5">
        {activeTab === 'incoming' ? (
          incomingRequests.length > 0 ? (
            <div className="grid grid-cols-1 gap-3.5">
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
              title="No incoming collaboration dispatches"
              description="When students discover your opportunities and apply, their dispatches will register here."
            />
          )
        ) : (
          sentRequests.length > 0 ? (
            <div className="grid grid-cols-1 gap-3.5">
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
              title="No transmitted invitations"
              description="You have not transmitted invitations to any collaborators yet. Explore students or inspect matches to connect."
            />
          )
        )}
      </div>

      {/* Decline Confirmation Modal */}
      <Modal
        isOpen={declineModalState.isOpen}
        onClose={() => setDeclineModalState({ isOpen: false, request: null })}
        title="Decline Collaboration Request?"
        description="Confirm rejection of this student's request to join your project roster."
        footer={
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeclineModalState({ isOpen: false, request: null })}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleConfirmDecline}
            >
              Decline Dispatch
            </Button>
          </>
        }
      >
        <div className="p-3 rounded-none bg-retro-red/10 border border-retro-red/30 flex items-center gap-2.5 text-xs text-retro-red font-mono">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>The applicant will receive telemetry notification that your roster is currently occupied.</span>
        </div>
      </Modal>
    </div>
  );
}
