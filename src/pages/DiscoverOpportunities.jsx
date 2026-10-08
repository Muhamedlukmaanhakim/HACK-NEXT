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
      result = result.filter((o) => o.type === filters.projectType);
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
    <div className="space-y-6 animate-fade-in font-mono">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-retro-border pb-4">
        <div>
          <div className="text-[10px] text-retro-muted uppercase tracking-widest mb-1">
            [ SECTION 06 // PROJECT FREQUENCY ]
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-retro-paper tracking-wide uppercase">
            PROJECT FREQUENCY <span className="text-retro-orange">//</span> OPPORTUNITIES
          </h1>
          <p className="text-xs text-retro-muted font-sans mt-0.5">
            Explore open project postings, hackathon squads, research initiatives, and campus startups.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            icon={Filter}
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden"
          >
            Filters
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={PlusCircle}
            onClick={() => navigate('/opportunities/create')}
          >
            Create Project
          </Button>
        </div>
      </div>

      {/* Search Input Bar */}
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="QUERY BY PROJECT TITLE, REQUIREMENT (E.G. AI/ML, UI/UX) OR TYPE..."
      />

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
        <div className="lg:col-span-3 space-y-3.5">
          <div className="flex items-center justify-between text-[10px] text-retro-muted uppercase px-1">
            <span>[ OPEN_PROJECT_POSTS // {filteredOpportunities.length} LOCATED ]</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </div>
          ) : filteredOpportunities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
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
              title="No opportunities match your filter parameters"
              description="Adjust filters or initialize your own project post to assemble a new crew."
              actionLabel="Clear Filter Parameters"
              onAction={handleResetFilters}
            />
          )}
        </div>
      </div>
    </div>
  );
}
