import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Users, ArrowUpDown } from 'lucide-react';
import SearchBar from '../components/features/SearchBar';
import FilterPanel from '../components/features/FilterPanel';
import StudentCard from '../components/cards/StudentCard';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { CardSkeleton } from '../components/ui/Skeleton';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useDebounce } from '../hooks/useDebounce';
import { DEPARTMENTS, YEARS } from '../services/taxonomyService';
import { getSkillCategory } from '../components/skills/SkillBadge';

export default function DiscoverStudents() {
  const { students, sentConnections, connectStudent, loading: globalLoading } = useAppData();
  const { user } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 250);
  const [sortBy, setSortBy] = useState('match');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    department: '',
    year: '',
    category: '',
    availability: '',
  });

  // Filter students
  const filteredStudents = useMemo(() => {
    let result = (students || []).filter((s) => s.id !== user?.id);

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          (s.skills || []).some((sk) => sk.toLowerCase().includes(q)) ||
          (s.interests || []).some((it) => it.toLowerCase().includes(q)) ||
          (s.department || '').toLowerCase().includes(q)
      );
    }

    if (filters.department) {
      result = result.filter((s) => s.department === filters.department);
    }
    if (filters.year) {
      result = result.filter((s) => s.year === filters.year);
    }
    if (filters.category) {
      result = result.filter((s) =>
        (s.skills || []).some((sk) => getSkillCategory(sk) === filters.category)
      );
    }
    if (filters.availability) {
      result = result.filter(
        (s) =>
          (s.availability || []).includes(filters.availability) ||
          (s.availability || []).includes('Flexible')
      );
    }

    // Sort
    if (sortBy === 'match') {
      result.sort((a, b) => (b.matchScore || 80) - (a.matchScore || 80));
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'year') {
      result.sort((a, b) => a.year.localeCompare(b.year));
    }

    return result;
  }, [students, user, debouncedSearch, filters, sortBy]);

  const handleConnect = async (student) => {
    await connectStudent(student);
    addToast({
      type: 'success',
      title: 'Collaboration Invitation Dispatched',
      message: `Invitation transmitted to ${student.name}.`,
    });
  };

  const handleResetFilters = () => {
    setFilters({
      department: '',
      year: '',
      category: '',
      availability: '',
    });
    setSearch('');
  };

  return (
    <div className="space-y-6 animate-fade-in font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-retro-border pb-4">
        <div>
          <div className="text-[10px] text-retro-muted uppercase tracking-widest mb-1">
            [ DIRECTORY // CAMPUS_CANDIDATE_INDEX ]
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-retro-paper tracking-wide uppercase">
            Discover Campus Collaborators
          </h1>
          <p className="text-xs text-retro-muted font-sans mt-0.5">
            Locate peer innovators across campus based on verified competencies and availability.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Filter Toggle */}
          <Button
            variant="secondary"
            size="sm"
            icon={Filter}
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden"
          >
            Filters
          </Button>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 bg-retro-surface-elevated px-3 py-1.5 rounded-none border border-retro-border text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-retro-muted" />
            <span className="text-retro-muted text-[10px]">RANK:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-retro-paper outline-none cursor-pointer font-bold font-mono"
            >
              <option value="match" className="bg-retro-surface">Best Match</option>
              <option value="name" className="bg-retro-surface">Alphabetical</option>
              <option value="year" className="bg-retro-surface">Year Level</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search Input Bar */}
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="QUERY BY STUDENT NAME, SKILL (E.G. UI/UX, PYTHON), OR DOMAIN..."
      />

      {/* Main Content Layout with Sidebar Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Desktop Filter Panel */}
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          onReset={handleResetFilters}
          options={{
            departments: DEPARTMENTS,
            years: YEARS,
            categories: ['Technical', 'Creative', 'Communication', 'Business', 'Research', 'Leadership'],
            availabilities: ['Weekdays', 'Weekends', 'Evenings', 'Flexible'],
          }}
          isOpen={mobileFilterOpen}
          onClose={() => setMobileFilterOpen(false)}
        />

        {/* Student Cards Grid */}
        <div className="lg:col-span-3 space-y-3.5">
          <div className="flex items-center justify-between text-[10px] text-retro-muted uppercase px-1">
            <span>[ CANDIDATE_NODES // {filteredStudents.length} LOCATED ]</span>
          </div>

          {globalLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : filteredStudents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredStudents.map((student) => (
                <StudentCard
                  key={student.id}
                  student={student}
                  matchScore={student.matchScore}
                  isRequested={sentConnections.includes(student.id)}
                  onConnect={handleConnect}
                  onViewProfile={(st) => navigate(`/profile?id=${st.id}`)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Users}
              title="No candidates match query parameters"
              description="Adjust your search query, department filter, or competency category to locate peers."
              actionLabel="Clear Filter Parameters"
              onAction={handleResetFilters}
            />
          )}
        </div>
      </div>
    </div>
  );
}
