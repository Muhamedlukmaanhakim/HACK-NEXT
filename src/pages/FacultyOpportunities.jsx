import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Plus,
  Compass,
  Users,
  Eye,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import Button from '../components/ui/Button';
import OpportunityCard from '../components/cards/OpportunityCard';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';

export default function FacultyOpportunities() {
  const { user } = useAuth();
  const { opportunities } = useAppData();
  const navigate = useNavigate();

  // All campus opportunities with faculty-tagged ones first
  const facultyOpps = (opportunities || []).slice(0, 6);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in font-sans">
      {/* 1. Header Stamp */}
      <div className="border-b-2 border-ink pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4 font-mono">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink/60 mb-1">
            <Briefcase className="w-4 h-4 text-ink" />
            <span>FACULTY WORKFLOW // LAB INITIATIVES & CAPSTONE POSTS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-ink uppercase tracking-tight leading-none">
            INITIATIVES.
          </h1>
          <p className="text-xs sm:text-sm text-ink/75 font-bold uppercase mt-2">
            RESEARCH INITIATIVES · CAPSTONE PROJECTS · STUDENT TALENT SQUADS
          </p>
        </div>

        <Button
          variant="danger"
          size="md"
          icon={Plus}
          onClick={() => navigate('/faculty/opportunities/create')}
        >
          [ + POST LAB OPPORTUNITY → ]
        </Button>
      </div>

      {/* 2. Opportunities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {facultyOpps.map((opp) => (
          <div key={opp.id} className="space-y-2">
            <OpportunityCard
              opportunity={opp}
              onView={(o) => navigate(`/opportunities/${o.id}`)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
