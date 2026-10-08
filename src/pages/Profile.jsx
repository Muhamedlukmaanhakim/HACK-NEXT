import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Calendar, Award, Edit3, UserCheck, UserPlus, ArrowLeft } from 'lucide-react';
import Avatar from '../components/ui/Avatar';
import SkillBadge from '../components/skills/SkillBadge';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Select from '../components/ui/Select';
import SkillSelector from '../components/skills/SkillSelector';
import LoadingState from '../components/ui/LoadingState';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { useToast } from '../context/ToastContext';
import * as studentService from '../services/studentService';
import { DEPARTMENTS, YEARS } from '../services/taxonomyService';

export default function Profile() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const { sentConnections, connectStudent } = useAppData();
  const { addToast } = useToast();

  const queryId = searchParams.get('id');
  const isOwnProfile = !queryId || queryId === user?.id;

  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    async function loadProfile() {
      setLoading(true);
      if (isOwnProfile) {
        setStudent(user);
        setEditData({
          name: user?.name || '',
          department: user?.department || '',
          year: user?.year || '',
          bio: user?.bio || '',
          skills: user?.skills || [],
        });
      } else {
        const found = await studentService.getStudentById(queryId);
        setStudent(found);
      }
      setLoading(false);
    }
    loadProfile();
  }, [queryId, isOwnProfile, user]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    await updateProfile(editData);
    setStudent((prev) => ({ ...prev, ...editData }));
    addToast({ type: 'success', title: 'Profile Saved', message: 'Details updated successfully.' });
    setEditModalOpen(false);
  };

  const handleConnect = async () => {
    if (!student) return;
    await connectStudent(student);
    addToast({ type: 'success', title: 'Request Sent', message: `Invitation sent to ${student.name}.` });
  };

  if (loading) return <LoadingState message="Loading profile..." />;
  if (!student) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-bold text-text-primary">Profile Not Found</h3>
        <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="mt-4">Go Back</Button>
      </div>
    );
  }

  const isRequested = sentConnections.includes(student.id);

  return (
    <div className="space-y-8 animate-fade-in max-w-5xl mx-auto">
      {!isOwnProfile && (
        <button type="button" onClick={() => navigate(-1)} className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-text-primary">
          <ArrowLeft className="w-4 h-4" /> <span>Back to directory</span>
        </button>
      )}

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-surface border border-surface-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-start sm:items-center gap-5">
            <Avatar name={student.name} size="2xl" />
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text-primary">{student.name}</h1>
              <div className="flex items-center gap-3 text-xs text-text-secondary flex-wrap">
                <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4 text-accent-indigo" />{student.department} • {student.year}</span>
                <span className="flex items-center gap-1 text-text-muted"><Mail className="w-3.5 h-3.5" />{student.email}</span>
              </div>
            </div>
          </div>
          {isOwnProfile ? (
            <Button variant="secondary" size="md" icon={Edit3} onClick={() => setEditModalOpen(true)}>Edit Profile</Button>
          ) : (
            <Button variant={isRequested ? 'secondary' : 'primary'} size="md" disabled={isRequested} icon={isRequested ? UserCheck : UserPlus} onClick={handleConnect}>
              {isRequested ? 'Request Sent' : 'Connect'}
            </Button>
          )}
        </div>
        <div className="mt-6 pt-6 border-t border-surface-border">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">About</h3>
          <p className="text-sm text-text-secondary leading-relaxed bg-surface-elevated/40 p-4 rounded-xl border border-surface-border">
            {student.bio || 'Passionate student eager to collaborate on high-impact projects.'}
          </p>
        </div>
      </div>

      {/* Grid: Skills, Availability */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 p-6 rounded-2xl bg-surface border border-surface-border space-y-4">
          <h3 className="text-sm font-semibold text-text-primary">Skills & Competencies</h3>
          <div className="flex flex-wrap gap-2">
            {(student.skills || []).map((sk) => <SkillBadge key={sk} skill={sk} size="md" />)}
          </div>
          {student.proficiency && (
            <div className="pt-4 border-t border-surface-border space-y-2">
              <span className="text-xs font-semibold text-text-muted uppercase">Proficiency</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {Object.entries(student.proficiency).map(([skill, lvl]) => (
                  <div key={skill} className="p-2.5 rounded-xl bg-surface-elevated border border-surface-border">
                    <span className="text-xs font-medium text-text-primary">{skill}</span>
                    <div className="flex gap-1 mt-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} className={`w-2 h-2 rounded-full ${star <= lvl ? 'bg-accent-indigo' : 'bg-surface-hover'}`} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-5">
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-text-primary">Availability</h3>
            <div className="flex flex-wrap gap-1.5">
              {(student.availability || []).map((av) => (
                <Badge key={av} variant="teal" size="sm"><Calendar className="w-3 h-3 mr-1" />{av}</Badge>
              ))}
            </div>
          </div>
          <div className="space-y-2 pt-4 border-t border-surface-border">
            <h3 className="text-sm font-semibold text-text-primary">Interests</h3>
            <div className="flex flex-wrap gap-1.5">
              {(student.interests || []).map((it) => <Badge key={it} variant="primary" size="sm">{it}</Badge>)}
            </div>
          </div>
        </div>
      </div>

      {/* Projects & Accolades */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-3">
          <h3 className="text-sm font-semibold text-text-primary">Featured Projects</h3>
          {(student.projects || [{ name: 'CardioVision AI', desc: 'Real-time arrhythmia classification.' }]).map((p, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-surface-elevated/70 border border-surface-border">
              <h4 className="text-xs font-semibold text-text-primary">{p.name}</h4>
              <p className="text-xs text-text-secondary mt-0.5">{p.desc}</p>
            </div>
          ))}
        </div>
        <div className="p-6 rounded-2xl bg-surface border border-surface-border space-y-3">
          <h3 className="text-sm font-semibold text-text-primary">Accolades</h3>
          {(student.achievements || ['Top Finalist, National Healthcare AI Hackathon 2025']).map((ach, idx) => (
            <div key={idx} className="flex items-center gap-2 p-3 rounded-xl bg-surface-elevated/70 border border-surface-border text-xs text-text-secondary">
              <Award className="w-4 h-4 text-status-warning flex-shrink-0" />
              <span>{ach}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Profile"
        description="Update your credentials and skills."
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleSaveProfile}>Save</Button>
          </>
        }
      >
        <form onSubmit={handleSaveProfile} className="space-y-4 py-2">
          <Input label="Name" value={editData.name || ''} onChange={(e) => setEditData({ ...editData, name: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <Select label="Department" value={editData.department || ''} onChange={(e) => setEditData({ ...editData, department: e.target.value })} options={DEPARTMENTS} />
            <Select label="Year" value={editData.year || ''} onChange={(e) => setEditData({ ...editData, year: e.target.value })} options={YEARS} />
          </div>
          <Textarea label="Bio" rows={3} value={editData.bio || ''} onChange={(e) => setEditData({ ...editData, bio: e.target.value })} />
          <SkillSelector label="Skills" selectedSkills={editData.skills || []} onChange={(sks) => setEditData({ ...editData, skills: sks })} />
        </form>
      </Modal>
    </div>
  );
}
