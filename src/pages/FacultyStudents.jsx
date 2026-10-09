import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  ShieldCheck,
  Award,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { useAppData } from '../context/AppDataContext';
import { DEPARTMENTS } from '../services/taxonomyService';

export default function FacultyStudents() {
  const { students, skillEvidences } = useAppData();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('ALL');

  const filteredStudents = useMemo(() => {
    return (students || []).filter((s) => {
      if (departmentFilter !== 'ALL' && s.department !== departmentFilter) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const matchName = s.name?.toLowerCase().includes(q);
        const matchDept = s.department?.toLowerCase().includes(q);
        const matchSkill = (s.skills || []).some((sk) => sk.toLowerCase().includes(q));
        if (!matchName && !matchDept && !matchSkill) return false;
      }
      return true;
    });
  }, [students, departmentFilter, search]);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in font-sans">
      {/* 1. Header Stamp */}
      <div className="border-b-2 border-ink pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4 font-mono">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink/60 mb-1">
            <Users className="w-4 h-4 text-ink" />
            <span>FACULTY WORKFLOW // AUTHORIZED STUDENT ROSTER</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-ink uppercase tracking-tight leading-none">
            STUDENT TALENT.
          </h1>
          <p className="text-xs sm:text-sm text-ink/75 font-bold uppercase mt-2">
            CAMPUS-WIDE VERIFIED COMPETENCIES · EVIDENCE STATUSES · RECRUITABLE LAB OPERATORS
          </p>
        </div>

        <div className="text-xs font-mono font-bold bg-canvas border-2 border-ink px-3 py-1.5 shadow-brutal-sm">
          <span>DIRECTORY: {students?.length || 0} TOTAL NODES</span>
        </div>
      </div>

      {/* 2. Filters */}
      <div className="p-4 border-2 border-ink bg-white shadow-brutal-sm flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
        <div className="flex-1 w-full">
          <Input
            placeholder="Search by student name, skill, or domain..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={Search}
          />
        </div>

        <div className="w-full sm:w-auto">
          <Select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            options={[
              { value: 'ALL', label: 'DEPARTMENT: ALL' },
              ...DEPARTMENTS.map((d) => ({ value: d, label: d })),
            ]}
          />
        </div>
      </div>

      {/* 3. Student Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono">
        {filteredStudents.map((st) => {
          const studentEvs = (skillEvidences || []).filter((e) => e.studentId === st.id);

          return (
            <div key={st.id} className="p-5 border-2 border-ink bg-white shadow-brutal flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-bold border-b border-ink/20 pb-1.5">
                  <span className="text-brutal-red uppercase">{st.id}</span>
                  <span className="bg-canvas border border-ink px-1.5 py-0.2 uppercase text-ink">
                    {st.year || 'STUDENT'}
                  </span>
                </div>

                <h3 className="font-display font-black text-lg text-ink uppercase">
                  {st.name}
                </h3>
                <p className="text-xs text-ink/70 font-sans font-medium">
                  {st.department}
                </p>

                <div className="editorial-separator" />

                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-ink/60 uppercase block">SKILLS & EVIDENCE:</span>
                  <div className="flex flex-wrap gap-1">
                    {(st.skills || []).map((sk) => {
                      const isVerified = studentEvs.some((e) => e.skill?.toLowerCase() === sk.toLowerCase());
                      return (
                        <span
                          key={sk}
                          className={`px-1.5 py-0.2 border text-[9px] uppercase font-bold ${
                            isVerified ? 'bg-campus-green text-white border-ink' : 'bg-canvas text-ink border-ink/40'
                          }`}
                        >
                          {sk} {isVerified ? '✓' : ''}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {st.bio && (
                  <p className="text-xs font-sans text-ink/80 line-clamp-2 italic pt-1">
                    "{st.bio}"
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-ink/20 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-bold"
                  onClick={() => navigate(`/profile?id=${st.id}`)}
                >
                  [ VIEW IDENTITY DOSSIER → ]
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
