import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit3, ArrowRight, ShieldCheck, Award } from 'lucide-react';
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
  const { sentConnections, connectStudent, skillEvidences } = useAppData();
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
          rollNo: user?.rollNo || '',
          department: user?.department || '',
          year: user?.year || '',
          semester: user?.semester || '',
          bio: user?.bio || '',
          skills: user?.skills || [],
          interests: user?.interests || [],
          availability: user?.availability || [],
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
    const updated = await updateProfile(editData);
    setStudent(updated);
    addToast({
      type: 'success',
      title: 'DOSSIER UPDATED',
      message: 'Student credentials and competencies saved.',
    });
    setEditModalOpen(false);
  };

  const handleConnect = async () => {
    if (!student) return;
    await connectStudent(student);
    addToast({
      type: 'success',
      title: 'INVITATION TRANSMITTED',
      message: `Direct dispatch transmitted to ${student.name}.`,
    });
  };

  if (loading) return <LoadingState message="ACCESSING IDENTITY DOSSIER..." />;
  if (!student) {
    return (
      <div className="text-center py-12 font-mono">
        <h3 className="text-lg font-bold text-ink uppercase">STUDENT RECORD NOT FOUND</h3>
        <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="mt-4">
          [ RETURN TO DIRECTORY ]
        </Button>
      </div>
    );
  }

  const isRequested = sentConnections.includes(student.id);
  const studentEvs = (skillEvidences || []).filter((e) => e.studentId === student.id);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-3xl mx-auto animate-fade-in font-sans">
      {!isOwnProfile && (
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-ink hover:text-brutal-red uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" /> <span>[ ← RETURN TO DIRECTORY ]</span>
        </button>
      )}

      {/* STUDENT IDENTITY DOSSIER */}
      <div className="p-6 sm:p-8 bg-white border-2 border-ink shadow-brutal font-mono space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b-2 border-ink pb-3 text-[10px] font-bold">
          <span className="text-ink/60 uppercase">
            STUDENT IDENTITY DOSSIER // {student.id?.toUpperCase() || 'STU-NODE'}
          </span>
          <span className={`px-2 py-0.5 border border-ink ${student.isDemo ? 'bg-signal-yellow text-ink' : 'bg-canvas text-ink'}`}>
            {student.isDemo ? 'DEMO OPERATOR' : 'CAMPUS VERIFIED'}
          </span>
        </div>

        {/* Identity & Department */}
        <div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-ink uppercase tracking-tight leading-none">
            {student.name}
          </h1>
          <p className="text-xs sm:text-sm font-bold text-ink/75 uppercase mt-2">
            {student.department || 'Department Unassigned'} {student.year ? `· ${student.year}` : ''} {student.rollNo ? `· ${student.rollNo}` : ''}
          </p>
        </div>

        <div className="editorial-separator-thick" />

        {/* SKILLS */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] font-bold text-brutal-red uppercase tracking-wider">
            <span>REGISTERED COMPETENCIES</span>
            <span>{student.skills?.length || 0} SKILLS</span>
          </div>

          {student.skills && student.skills.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-bold">
              {student.skills.map((sk) => {
                const hasEvidence = studentEvs.some((e) => e.skill?.toLowerCase() === sk.toLowerCase());

                return (
                  <div
                    key={sk}
                    className={`p-2 border-2 border-ink text-center uppercase shadow-brutal-sm ${
                      hasEvidence ? 'bg-campus-green/10 text-ink border-ink' : 'bg-canvas text-ink'
                    }`}
                  >
                    <span>{sk}</span>
                    {hasEvidence && <span className="text-campus-green ml-1">✓</span>}
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-ink/60 font-sans italic p-3 border border-ink/20 bg-canvas">
              No skills registered yet. Click Edit Dossier to specify your competencies.
            </p>
          )}
        </div>

        <div className="editorial-separator" />

        {/* INTERESTS */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-brutal-red uppercase tracking-wider">
            PROJECT DOMAINS & INTERESTS
          </div>

          {student.interests && student.interests.length > 0 ? (
            <div className="flex flex-wrap gap-2 text-xs font-bold">
              {student.interests.map((it) => (
                <div key={it} className="p-2 border border-ink bg-white text-ink uppercase">
                  {it}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-ink/60 font-sans italic p-3 border border-ink/20 bg-canvas">
              No project interests selected yet.
            </p>
          )}
        </div>

        <div className="editorial-separator" />

        {/* AVAILABILITY */}
        <div className="space-y-2">
          <div className="text-[11px] font-bold text-brutal-red uppercase tracking-wider">
            AVAILABILITY SCHEDULE
          </div>
          <div className="p-3 border-2 border-ink bg-canvas text-xs font-bold text-ink uppercase">
            {student.availability && student.availability.length > 0
              ? student.availability.join(' · ')
              : 'STATED AVAILABILITY PENDING'}
          </div>
        </div>

        {/* Bio */}
        {student.bio ? (
          <>
            <div className="editorial-separator" />
            <div className="space-y-1">
              <div className="text-[10px] font-bold text-ink/50 uppercase">MANIFESTO:</div>
              <p className="text-xs font-sans text-ink/80 leading-relaxed font-normal">
                "{student.bio}"
              </p>
            </div>
          </>
        ) : null}

        {/* Actions */}
        <div className="pt-4 border-t-2 border-ink flex items-center justify-between">
          <span className="text-[10px] text-ink/60 uppercase">
            STATUS: ACTIVE COLLABORATOR
          </span>

          {isOwnProfile ? (
            <Button
              variant="outline"
              size="sm"
              icon={Edit3}
              onClick={() => setEditModalOpen(true)}
            >
              [ EDIT DOSSIER ]
            </Button>
          ) : (
            <Button
              variant={isRequested ? 'secondary' : 'accent'}
              size="md"
              disabled={isRequested}
              onClick={handleConnect}
              icon={ArrowRight}
              iconPosition="right"
            >
              {isRequested ? 'CONNECTED ✓' : '[ TRANSMIT INVITATION → ]'}
            </Button>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        title="EDIT DOSSIER"
        description="Update your credentials and skills."
      >
        <form onSubmit={handleSaveProfile} className="space-y-4 font-mono">
          <Input
            label="FULL NAME"
            value={editData.name || ''}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            required
          />

          <Input
            label="ROLL NUMBER"
            value={editData.rollNo || ''}
            onChange={(e) => setEditData({ ...editData, rollNo: e.target.value })}
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
            label="REGISTERED SKILLS"
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
