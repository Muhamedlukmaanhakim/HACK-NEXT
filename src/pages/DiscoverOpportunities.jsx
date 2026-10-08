import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Filter, PlusCircle } from 'lucide-react';
import SearchBar from '../components/features/SearchBar';
import FilterPanel from '../components/features/FilterPanel';
import OpportunityCard from '../components/cards/OpportunityCard';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { CardSkeleton } from '../components/ui/Skeleton';
import { useAppData } from '../context/AppDataContext';
import { useDebounce } from '../hooks/useDebounce';
import { COLLABORATION_TYPES, AVAILABILITY_OPTIONS } from '../services/taxonomyService';

const QUICK_TYPES = ['ALL', 'HACKATHON', 'STARTUP', 'COURSE PROJECT', 'RESEARCH', 'OPEN SOURCE'];

export default function DiscoverOpportunities() {
  const { opportunities, loading } = useAppData();
  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 250);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    projectType: '',
    availability: '',
  });

  const activeType = filters.projectType ? filters.projectType.toUpperCase() : 'ALL';

  const handleQuickType = (t) => {
    if (t === 'ALL') {
      setFilters((prev) => ({ ...prev, projectType: '' }));
    } else {
      setFilters((prev) => ({
        ...prev,
        projectType: t.charAt(0) + t.slice(1).toLowerCase(),
      }));
    }
  };

  const filteredOpportunities = useMemo(() => {
    let result = opportunities || [];

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase();
      result = result.filter(
        (o) =>
          o.title.toLowerCase().includes(q) ||
          o.description.toLowerCase().includes(q) ||
          (o.requiredSkills || []).some((s) => s.toLowerCase().includes(q))
      );
    }

    if (filters.projectType) {
      result = result.filter(
        (o) => o.type.toLowerCase() === filters.projectType.toLowerCase()
      );
    }

    if (filters.availability) {
      result = result.filter(
        (o) =>
          (o.availability || []).includes(filters.availability) ||
          (o.availability || []).includes('Flexible')
      );
    }

    return result;
  }, [opportunities, debouncedSearch, filters]);

  const handleResetFilters = () => {
    setFilters({ projectType: '', availability: '' });
    setSearch('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b-3 border-ink pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-bold uppercase tracking-wider text-brutal-red mb-1">
            02 / PROJECT DIRECTORY
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-ink uppercase tracking-tight leading-none">
            PROJECTS SEEKING TALENT.
          </h1>
          <p className="text-xs sm:text-sm font-mono text-ink/70 font-semibold uppercase mt-2">
            87 ACTIVE SQUADS, LABS AND STARTUPS ACROSS CAMPUS
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

          <Button
            variant="danger"
            size="md"
            icon={PlusCircle}
            onClick={() => navigate('/opportunities/create')}
            className="text-xs font-bold"
          >
            POST A PROJECT +
          </Button>
        </div>
      </div>

      {/* Search Input Bar */}
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="SEARCH BY PROJECT TITLE, TECH STACK (AI/ML, REACT), OR TYPE..."
      />

      {/* Quick category pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {QUICK_TYPES.map((t) => {
          const isActive = activeType === t;
          return (
            <button
              key={t}
              onClick={() => handleQuickType(t)}
              className={`px-3 py-1.5 font-mono text-xs font-bold border-2 border-ink uppercase transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-ink text-canvas shadow-brutal-sm'
                  : 'bg-white text-ink hover:bg-canvas'
              }`}
            >
              [ {t} ]
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Filter Panel */}
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          onReset={handleResetFilters}
          options={{
            projectTypes: COLLABORATION_TYPES,
            availabilities: AVAILABILITY_OPTIONS,
          }}
          isOpen={mobileFilterOpen}
          onClose={() => setMobileFilterOpen(false)}
        />

        {/* Opportunity Cards Feed */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono font-bold text-ink/70 uppercase">
            <span>{filteredOpportunities.length} OPPORTUNITIES OPEN</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : filteredOpportunities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredOpportunities.map((opp) => (
                <OpportunityCard
                  key={opp.id}
                  opportunity={opp}
                  matchScore={opp.matchScore}
                  onView={(o) => navigate(`/opportunities/${o.id}`)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Compass}
              title="NO POSTINGS MATCH YOUR CRITERIA"
              description="Adjust your search terms or filters to discover other active opportunities."
              actionLabel="RESET FILTERS"
              onAction={handleResetFilters}
            />
          )}
        </div>
      </div>
    </div>
  );
}
