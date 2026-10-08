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
    addToast({ type: 'success', title: 'Dossier Calibrated', message: 'Credentials updated successfully.' });
    setEditModalOpen(false);
  };

  const handleConnect = async () => {
    if (!student) return;
    await connectStudent(student);
    addToast({ type: 'success', title: 'Invitation Transmitted', message: `Invitation transmitted to ${student.name}.` });
  };

  if (loading) return <LoadingState message="Accessing student dossier telemetry..." />;
  if (!student) {
    return (
      <div className="text-center py-12 font-mono">
        <div className="text-[10px] text-retro-muted uppercase">[ FAULT // NO_RECORD ]</div>
        <h3 className="text-lg font-bold text-retro-paper">Student Record Not Located</h3>
        <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="mt-4">
          Return to Directory
        </Button>
      </div>
    );
  }

  const isRequested = sentConnections.includes(student.id);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in max-w-5xl mx-auto font-mono">
      {!isOwnProfile && (
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs text-retro-muted hover:text-retro-paper uppercase tracking-wider"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> <span>[ RETURN TO DIRECTORY ]</span>
        </button>
      )}

      {/* Header Banner */}
      <div className="p-5 sm:p-7 rounded-none bg-retro-surface border border-retro-border shadow-terminal">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-retro-border pb-5">
          <div className="flex items-start sm:items-center gap-4">
            <Avatar name={student.name} size="2xl" />
            <div className="space-y-0.5">
              <div className="text-[10px] text-retro-muted uppercase tracking-widest">[ OPERATOR // DOSSIER ]</div>
              <h1 className="text-xl sm:text-2xl font-display font-bold text-retro-paper uppercase">{student.name}</h1>
              <div className="flex items-center gap-3 text-xs text-retro-muted flex-wrap">
                <span className="flex items-center gap-1 text-retro-paper/80">
                  <GraduationCap className="w-3.5 h-3.5 text-retro-orange" />
                  {student.department} // {student.year}
                </span>
                <span className="flex items-center gap-1 text-retro-muted">
                  <Mail className="w-3.5 h-3.5" />
                  {student.email}
                </span>
              </div>
            </div>
          </div>
          {isOwnProfile ? (
            <Button variant="secondary" size="md" icon={Edit3} onClick={() => setEditModalOpen(true)}>
              Edit Dossier
            </Button>
          ) : (
            <Button
              variant={isRequested ? 'secondary' : 'primary'}
              size="md"
              disabled={isRequested}
              icon={isRequested ? UserCheck : UserPlus}
              onClick={handleConnect}
            >
              {isRequested ? 'Request Sent' : 'Connect'}
            </Button>
          )}
        </div>

        <div className="mt-4 pt-2">
          <div className="text-[10px] uppercase tracking-widest text-retro-muted mb-1.5">// BIOGRAPHICAL SUMMARY:</div>
          <p className="text-xs sm:text-sm text-retro-paper/80 font-sans leading-relaxed bg-retro-surface-elevated p-3.5 border border-retro-border">
            {student.bio || 'Passionate student eager to collaborate on high-impact projects.'}
          </p>
        </div>
      </div>

      {/* Grid: Skills, Availability */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 p-5 rounded-none bg-retro-surface border border-retro-border space-y-3.5 shadow-panel">
          <div className="text-[10px] uppercase tracking-widest text-retro-muted">// REGISTERED COMPETENCIES:</div>
          <div className="flex flex-wrap gap-1.5">
            {(student.skills || []).map((sk) => <SkillBadge key={sk} skill={sk} size="md" />)}
          </div>
          {student.proficiency && (
            <div className="pt-3 border-t border-retro-border space-y-2">
              <span className="text-[10px] text-retro-muted uppercase tracking-wider">// PROFICIENCY RATINGS:</span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {Object.entries(student.proficiency).map(([skill, lvl]) => (
                  <div key={skill} className="p-2 bg-retro-surface-elevated border border-retro-border text-xs">
                    <span className="font-bold text-retro-paper">{skill}</span>
                    <div className="flex gap-1 mt-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <div key={star} className={`w-1.5 h-1.5 rounded-none ${star <= lvl ? 'bg-retro-orange' : 'bg-retro-border'}`} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-5 rounded-none bg-retro-surface border border-retro-border space-y-4 shadow-panel">
          <div className="space-y-1.5">
            <div className="text-[10px] uppercase tracking-widest text-retro-muted">// AVAILABILITY WINDOWS:</div>
            <div className="flex flex-wrap gap-1">
              {(student.availability || []).map((av) => (
                <Badge key={av} variant="teal" size="sm"><Calendar className="w-3 h-3 mr-1" />{av}</Badge>
              ))}
            </div>
          </div>
          <div className="space-y-1.5 pt-3 border-t border-retro-border">
            <div className="text-[10px] uppercase tracking-widest text-retro-muted">// DOMAIN INTERESTS:</div>
            <div className="flex flex-wrap gap-1">
              {(student.interests || []).map((it) => <Badge key={it} variant="primary" size="sm">{it}</Badge>)}
            </div>
          </div>
        </div>
      </div>

      {/* Projects & Accolades */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 rounded-none bg-retro-surface border border-retro-border space-y-2.5 shadow-panel">
          <div className="text-[10px] uppercase tracking-widest text-retro-muted">// FEATURED PROJECTS:</div>
          {(student.projects || [{ name: 'CardioVision AI', desc: 'Real-time arrhythmia classification.' }]).map((p, idx) => (
            <div key={idx} className="p-3 bg-retro-surface-elevated border border-retro-border">
              <h4 className="text-xs font-bold text-retro-paper">{p.name}</h4>
              <p className="text-xs text-retro-muted font-sans mt-0.5">{p.desc}</p>
            </div>
          ))}
        </div>
        <div className="p-5 rounded-none bg-retro-surface border border-retro-border space-y-2.5 shadow-panel">
          <div className="text-[10px] uppercase tracking-widest text-retro-muted">// VERIFIED ACCOLADES:</div>
          {(student.achievements || ['Top Finalist, National Healthcare AI Hackathon 2025']).map((ach, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2.5 bg-retro-surface-elevated border border-retro-border text-xs text-retro-paper/80 font-sans">
              <Award className="w-4 h-4 text-retro-amber flex-shrink-0" />
              <span>{ach}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="Edit Operator Dossier"
        description="Update your credentials and skill index."
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setEditModalOpen(false)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={handleSaveProfile}>Save Changes</Button>
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
