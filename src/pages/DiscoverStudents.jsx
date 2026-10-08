import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter, Users, ArrowUpDown } from 'lucide-react';
import SearchBar from '../components/features/SearchBar';
import FilterPanel from '../components/features/FilterPanel';
import StudentCard from '../components/cards/StudentCard';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { CardSkeleton } from '../components/ui/Skeleton';
import ErrorState from '../components/ui/ErrorState';
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

  const [isLoading, setIsLoading] = useState(false);

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
      title: 'Collaboration Request Dispatched',
      message: `Invitation sent to ${student.name}.`,
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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Find Your Next Teammate
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
            Discover peer innovators across campus based on verified competencies and availability.
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
          <div className="flex items-center gap-2 bg-surface-elevated px-3 py-1.5 rounded-xl border border-surface-border text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-text-muted" />
            <span className="text-text-muted">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-text-primary outline-none cursor-pointer"
            >
              <option value="match" className="bg-surface-elevated">Best Match</option>
              <option value="name" className="bg-surface-elevated">Alphabetical</option>
              <option value="year" className="bg-surface-elevated">Year Level</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search Input Bar */}
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search by student name, skill (e.g. UI/UX, Python) or interest..."
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
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-text-muted px-1">
            <span>Showing {filteredStudents.length} candidates</span>
          </div>

          {globalLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : filteredStudents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              title="No students match your criteria"
              description="Try adjusting your search query, department filter, or skill category to discover more peers."
              actionLabel="Reset All Filters"
              onAction={handleResetFilters}
            />
          )}
        </div>
      </div>
    </div>
  );
}
