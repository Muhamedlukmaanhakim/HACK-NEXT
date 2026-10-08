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
      message: `${req.student?.name} has been added to your team roster!`,
    });
  };

  const handleConfirmDecline = async () => {
    if (!declineModalState.request) return;
    await declineRequest(declineModalState.request.id);
    addToast({
      type: 'info',
      title: 'Request Declined',
      message: `Declined request from ${declineModalState.request.student?.name}.`,
    });
    setDeclineModalState({ isOpen: false, request: null });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
          Collaboration Requests
        </h1>
        <p className="text-xs sm:text-sm text-text-secondary mt-1">
          Review incoming applications to join your projects and track your outgoing team invitations.
        </p>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={[
          { id: 'incoming', label: 'Incoming Requests', count: pendingIncomingCount },
          { id: 'sent', label: 'Sent Invitations', count: pendingSentCount },
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
              title="No incoming requests yet"
              description="When students discover your opportunities and apply, their requests will appear here."
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
              title="No sent invitations"
              description="You haven’t invited any collaborators yet. Explore students or view project matches to connect."
            />
          )
        )}
      </div>

      {/* Decline Confirmation Modal */}
      <Modal
        isOpen={declineModalState.isOpen}
        onClose={() => setDeclineModalState({ isOpen: false, request: null })}
        title="Decline Collaboration Request?"
        description="Are you sure you want to decline this student's request to join your project?"
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
              Decline Request
            </Button>
          </>
        }
      >
        <div className="p-3 rounded-xl bg-status-danger/10 border border-status-danger/20 flex items-center gap-3 text-xs text-status-danger">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>The student will be notified that your roster is currently full.</span>
        </div>
      </Modal>
    </div>
  );
}
