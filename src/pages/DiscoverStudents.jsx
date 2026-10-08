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

const QUICK_CATEGORIES = [
  'ALL',
  'TECHNICAL',
  'DESIGN',
  'PRODUCT',
  'MARKETING',
  'HARDWARE',
  'DATA',
];

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

  const activeCategory = filters.category ? filters.category.toUpperCase() : 'ALL';

  const handleQuickCategory = (cat) => {
    if (cat === 'ALL') {
      setFilters((prev) => ({ ...prev, category: '' }));
    } else {
      setFilters((prev) => ({
        ...prev,
        category: cat.charAt(0) + cat.slice(1).toLowerCase(),
      }));
    }
  };

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
        (s.skills || []).some((sk) => getSkillCategory(sk).toLowerCase() === filters.category.toLowerCase())
      );
    }
    if (filters.availability) {
      result = result.filter(
        (s) =>
          (s.availability || []).includes(filters.availability) ||
          (s.availability || []).includes('Flexible')
      );
    }

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
      title: 'INVITATION DISPATCHED',
      message: `Connection request sent to ${student.name}.`,
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
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b-3 border-ink pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-brutal-red mb-1">
            01 / STUDENT DIRECTORY
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-ink uppercase tracking-tight leading-none">
            FIND YOUR PEOPLE.
          </h1>
          <p className="text-xs sm:text-sm font-mono text-ink/70 font-semibold uppercase mt-2">
            1,240 STUDENTS LOOKING FOR COLLABORATORS ACROSS CAMPUS
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Button
            variant="outline"
            size="sm"
            icon={Filter}
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden text-xs"
          >
            FILTERS
          </Button>

          <div className="flex items-center gap-2 bg-white px-3 py-2 border-2 border-ink shadow-brutal-sm text-xs font-mono font-bold">
            <ArrowUpDown className="w-3.5 h-3.5 text-ink stroke-[2.5]" />
            <span className="text-ink/60 text-[10px]">RANK:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-ink outline-none cursor-pointer uppercase font-bold"
            >
              <option value="match">BEST MATCH</option>
              <option value="name">ALPHABETICAL</option>
              <option value="year">YEAR LEVEL</option>
            </select>
          </div>
        </div>
      </div>

      {/* Search Input Bar */}
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="SEARCH BY SKILL, NAME, DEPARTMENT, OR INTEREST..."
      />

      {/* Quick category pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {QUICK_CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => handleQuickCategory(cat)}
              className={`px-3 py-1.5 font-mono text-xs font-bold border-2 border-ink uppercase transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-ink text-canvas shadow-brutal-sm'
                  : 'bg-white text-ink hover:bg-canvas'
              }`}
            >
              [ {cat} ]
            </button>
          );
        })}
      </div>

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
          <div className="flex items-center justify-between text-xs font-mono font-bold text-ink/70 uppercase">
            <span>{filteredStudents.length} CANDIDATES FOUND</span>
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
              title="NO STUDENTS MATCH YOUR QUERY"
              description="Adjust your search query, department, or discipline filter to find more peers."
              actionLabel="RESET ALL FILTERS"
              onAction={handleResetFilters}
            />
          )}
        </div>
      </div>
    </div>
  );
}
