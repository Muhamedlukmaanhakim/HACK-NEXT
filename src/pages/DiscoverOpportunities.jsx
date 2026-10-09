import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass, Filter, Plus } from 'lucide-react';
import SearchBar from '../components/features/SearchBar';
import FilterPanel from '../components/features/FilterPanel';
import OpportunityCard from '../components/cards/OpportunityCard';
import Button from '../components/ui/Button';
import EmptyState from '../components/ui/EmptyState';
import { CardSkeleton } from '../components/ui/Skeleton';
import { useAppData } from '../context/AppDataContext';
import { useDebounce } from '../hooks/useDebounce';
import { COLLABORATION_TYPES, AVAILABILITY_OPTIONS } from '../services/taxonomyService';

const QUICK_TYPES = ['ALL', 'HACKATHON', 'STARTUP', 'COURSE PROJECT', 'RESEARCH'];

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
    <div className="space-y-6 animate-fade-in font-sans">
      {/* 1. Header */}
      <div className="border-b-2 border-ink pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4 font-mono">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-ink/60 mb-2">
            [INDEX / 02]
          </div>
          <h1 className="text-3xl sm:text-5xl font-display font-black text-ink uppercase tracking-tight leading-none">
            CAMPUS PROJECTS.
          </h1>
          <p className="text-xs sm:text-sm text-ink/75 font-bold uppercase mt-2">
            PROJECT DIRECTORY / 02 · ACTIVE SQUADS SEEKING SPECIFIC TALENT
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Button
            variant="primary"
            size="sm"
            icon={Plus}
            iconPosition="left"
            onClick={() => navigate('/opportunities/create')}
          >
            [ + START PROJECT → ]
          </Button>
        </div>
      </div>

      {/* 2. Compact Search Input */}
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="SEARCH BY PROJECT TITLE, TECH STACK, OR REQUIRED SKILL..."
      />

      {/* 3. Quick Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none font-mono">
        {QUICK_TYPES.map((type) => {
          const isActive = activeType === type;
          return (
            <button
              key={type}
              onClick={() => handleQuickType(type)}
              className={`px-3 py-1.5 text-xs font-bold border-2 border-ink uppercase transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-ink text-canvas shadow-brutal-sm'
                  : 'bg-white text-ink hover:bg-canvas'
              }`}
            >
              [ {type} ]
            </button>
          );
        })}
      </div>

      {/* 4. Projects Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono font-bold text-ink/70 uppercase">
          <span>{filteredOpportunities.length} PROJECT DOSSIERS LISTED</span>
          <span>CAMPUS WIDE</span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        ) : filteredOpportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredOpportunities.map((opp) => (
              <OpportunityCard
                key={opp.id}
                opportunity={opp}
                onView={(o) => navigate(`/discover/opportunities/${o.id}`)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Compass}
            title="NO PROJECTS MATCH YOUR QUERY"
            description="Adjust your search query or collaboration type filter to find more projects."
            actionLabel="RESET ALL FILTERS"
            onAction={handleResetFilters}
          />
        )}
      </div>
    </div>
  );
}
