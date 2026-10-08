import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { GraduationCap, Mail, Calendar, Award, Edit3, UserCheck, UserPlus, ArrowLeft, ExternalLink } from 'lucide-react';
import Avatar from '../components/ui/Avatar';
import SkillBadge from '../components/skills/SkillBadge';
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
    addToast({ type: 'success', title: 'PORTFOLIO UPDATED', message: 'Credentials updated successfully.' });
    setEditModalOpen(false);
  };

  const handleConnect = async () => {
    if (!student) return;
    await connectStudent(student);
    addToast({ type: 'success', title: 'INVITATION TRANSMITTED', message: `Invitation transmitted to ${student.name}.` });
  };

  if (loading) return <LoadingState message="ACCESSING STUDENT DOSSIER..." />;
  if (!student) {
    return (
      <div className="text-center py-12 font-mono">
        <h3 className="text-lg font-bold text-ink uppercase">Student Record Not Found</h3>
        <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="mt-4">
          RETURN TO DIRECTORY
        </Button>
      </div>
    );
  }

  const isRequested = sentConnections.includes(student.id);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto">
      {!isOwnProfile && (
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-ink hover:text-brutal-red uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" /> <span>← RETURN TO DIRECTORY</span>
        </button>
      )}

      {/* Header Banner */}
      <div className="p-6 sm:p-8 bg-white border-2 border-ink shadow-brutal space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b-2 border-ink">
          <div className="flex items-start sm:items-center gap-5">
            <Avatar name={student.name} size="2xl" className="border-3 border-ink" />
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-brutal-red mb-1">
                STUDENT PORTFOLIO // 08
              </div>
              <h1 className="text-3xl sm:text-5xl font-display font-black text-ink uppercase tracking-tight leading-none">
                {student.name}
              </h1>
              <p className="font-mono text-xs sm:text-sm text-ink/70 font-semibold uppercase mt-2">
                {student.department} · {student.year} · BATCH OF '27
              </p>
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-signal-yellow text-ink border border-ink uppercase">
                  LOOKING FOR HACKATHON TEAM
                </span>
                <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-canvas text-ink border border-ink uppercase">
                  WEEKENDS · 15-20 HRS/WEEK
                </span>
              </div>
            </div>
          </div>

          <div className="self-start md:self-auto">
            {isOwnProfile ? (
              <Button variant="outline" size="md" icon={Edit3} onClick={() => setEditModalOpen(true)} className="text-xs font-bold">
                EDIT PORTFOLIO
              </Button>
            ) : (
              <Button
                variant={isRequested ? 'secondary' : 'primary'}
                size="md"
                disabled={isRequested}
                icon={isRequested ? UserCheck : UserPlus}
                onClick={handleConnect}
                className="text-xs font-bold"
              >
                {isRequested ? 'REQUEST SENT' : 'CONNECT →'}
              </Button>
            )}
          </div>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left Column (7 cols): Bio and Skills */}
          <div className="md:col-span-7 space-y-5">
            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink/60">
                ABOUT // BIO:
              </div>
              <p className="font-sans text-sm text-ink/80 leading-relaxed bg-canvas p-4 border-2 border-ink font-normal">
                {student.bio || 'Passionate student eager to collaborate on high-impact projects.'}
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-ink/60">
                VERIFIED COMPETENCIES:
              </div>
              <div className="flex flex-wrap gap-2">
                {(student.skills || []).map((sk) => (
                  <SkillBadge key={sk} skill={sk} size="md" />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column (5 cols): History and Links */}
          <div className="md:col-span-5 space-y-4">
            <div className="p-4 bg-canvas border-2 border-ink space-y-2">
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-brutal-red">
                HACKATHON HISTORY:
              </div>
              <div className="space-y-2 text-xs font-mono">
                <div className="flex items-center justify-between border-b border-ink/20 pb-1.5">
                  <span className="font-bold text-ink">HACKMIT '24</span>
                  <span className="px-1.5 py-0.2 bg-signal-yellow text-ink border border-ink text-[10px] font-bold">
                    1ST PLACE
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-ink/20 pb-1.5">
                  <span className="font-bold text-ink">CAMPUS BUILDATHON</span>
                  <span className="px-1.5 py-0.2 bg-campus-green text-ink border border-ink text-[10px] font-bold">
                    BEST UI
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-ink">ETHINDIA '23</span>
                  <span className="px-1.5 py-0.2 bg-white text-ink border border-ink text-[10px] font-bold">
                    FINALIST
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="EDIT DOSSIER"
        description="Update your public profile and competencies."
      >
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <Input
            label="FULL NAME"
            value={editData.name || ''}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            required
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              label="DEPARTMENT"
              value={editData.department || ''}
              onChange={(e) => setEditData({ ...editData, department: e.target.value })}
              options={DEPARTMENTS}
            />
            <Select
              label="YEAR OF STUDY"
              value={editData.year || ''}
              onChange={(e) => setEditData({ ...editData, year: e.target.value })}
              options={YEARS}
            />
          </div>
          <Textarea
            label="BIO / MANIFESTO"
            rows={3}
            value={editData.bio || ''}
            onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
          />
          <SkillSelector
            label="SKILLS"
            selectedSkills={editData.skills || []}
            onChange={(skills) => setEditData({ ...editData, skills })}
          />
          <div className="pt-3 border-t-2 border-ink flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setEditModalOpen(false)}>
              CANCEL
            </Button>
            <Button variant="primary" size="sm" type="submit">
              SAVE CHANGES
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
