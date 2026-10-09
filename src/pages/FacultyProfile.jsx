import React, { useState } from 'react';
import {
  User,
  Building,
  Edit3,
  CheckCircle2,
  Mail,
  MapPin,
  Clock,
  Award,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { DEPARTMENTS } from '../services/taxonomyService';

export default function FacultyProfile() {
  const { user, updateProfile } = useAuth();
  const { addToast } = useToast();

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    department: user?.department || '',
    designation: user?.designation || '',
    expertise: user?.expertise || '',
    officeLocation: user?.officeLocation || '',
    officeHours: user?.officeHours || '',
    bio: user?.bio || '',
  });

  const handleSave = async (e) => {
    e.preventDefault();
    await updateProfile(formData);
    addToast({
      type: 'success',
      title: 'PROFILE UPDATED',
      message: 'Faculty credentials and office details updated.',
    });
    setEditModalOpen(false);
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-3xl mx-auto animate-fade-in font-sans">
      {/* Header Stamp */}
      <div className="p-6 sm:p-8 bg-white border-3 border-ink shadow-brutal font-mono space-y-6">
        <div className="flex items-center justify-between border-b-2 border-ink pb-3 text-[10px] font-bold">
          <span className="text-ink/60 uppercase">
            FACULTY IDENTITY DOSSIER // {user?.facultyId || 'FAC-NODE'}
          </span>
          <span className="bg-ink text-white px-2 py-0.5 border border-ink">
            {user?.isDemo ? 'DEMO SUPERVISOR' : 'FACULTY VERIFIED'}
          </span>
        </div>

        {/* Identity & Department */}
        <div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-ink uppercase tracking-tight leading-none">
            {user?.name || 'Dr. Aris Thorne'}
          </h1>
          <p className="text-xs sm:text-sm font-bold text-ink/75 uppercase mt-2">
            {user?.designation || 'Professor'} · {user?.department || 'Computer Science (CSE)'}
          </p>
        </div>

        <div className="editorial-separator-thick" />

        {/* Research Expertise */}
        <div className="space-y-1.5">
          <div className="text-[11px] font-bold text-brutal-red uppercase tracking-wider">
            PRIMARY EXPERTISE
          </div>
          <p className="text-sm font-bold text-ink uppercase">
            {user?.expertise || 'Autonomous Systems & Predictive Healthcare AI'}
          </p>
        </div>

        <div className="editorial-separator" />

        {/* Research Interests */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-brutal-red uppercase tracking-wider">
            RESEARCH DOMAINS
          </div>
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            {(user?.researchInterests?.length ? user.researchInterests : ['Healthcare & MedTech', 'AI & Machine Learning', 'Robotics']).map((item) => (
              <span key={item} className="p-2 border border-ink bg-canvas text-ink uppercase">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="editorial-separator" />

        {/* Office & Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3 border-2 border-ink bg-canvas space-y-1">
            <span className="text-[10px] text-ink/60 uppercase font-bold block">LAB / OFFICE LOCATION:</span>
            <strong className="text-ink">{user?.officeLocation || 'Turing Hall, Room 412'}</strong>
          </div>
          <div className="p-3 border-2 border-ink bg-canvas space-y-1">
            <span className="text-[10px] text-ink/60 uppercase font-bold block">OFFICE HOURS:</span>
            <strong className="text-ink">{user?.officeHours || 'Tuesdays & Thursdays, 3:00 PM – 5:00 PM'}</strong>
          </div>
        </div>

        {/* Bio */}
        {user?.bio && (
          <>
            <div className="editorial-separator" />
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-ink/50 uppercase">LAB MANIFESTO:</span>
              <p className="text-xs font-sans text-ink/80 leading-relaxed font-normal">
                "{user.bio}"
              </p>
            </div>
          </>
        )}

        <div className="pt-4 border-t-2 border-ink flex justify-end">
          <Button
            variant="outline"
            size="sm"
            icon={Edit3}
            onClick={() => setEditModalOpen(true)}
          >
            [ EDIT FACULTY DOSSIER ]
          </Button>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="EDIT FACULTY DOSSIER"
        description="Update departmental details and research specialization."
      >
        <form onSubmit={handleSave} className="space-y-4 font-mono">
          <Input
            label="FULL NAME"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="DEPARTMENT"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              options={DEPARTMENTS}
            />
            <Input
              label="DESIGNATION"
              value={formData.designation}
              onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
            />
          </div>

          <Input
            label="PRIMARY RESEARCH FOCUS"
            value={formData.expertise}
            onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="OFFICE LOCATION"
              value={formData.officeLocation}
              onChange={(e) => setFormData({ ...formData, officeLocation: e.target.value })}
            />
            <Input
              label="OFFICE HOURS"
              value={formData.officeHours}
              onChange={(e) => setFormData({ ...formData, officeHours: e.target.value })}
            />
          </div>

          <Textarea
            label="LAB MANIFESTO / BIO"
            rows={3}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />

          <div className="pt-3 border-t-2 border-ink flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditModalOpen(false)}>
              CANCEL
            </Button>
            <Button variant="danger" size="sm" type="submit">
              [ SAVE CHANGES ]
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
