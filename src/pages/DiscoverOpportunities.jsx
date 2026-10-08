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
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
            Discover Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-text-secondary mt-1">
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
            Post Opportunity
          </Button>
        </div>
      </div>

      {/* Search Input Bar */}
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search projects by title, requirement (e.g. AI/ML, UI/UX) or type..."
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
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between text-xs text-text-muted px-1">
            <span>Showing {filteredOpportunities.length} opportunities</span>
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
              title="No opportunities match your filters"
              description="Try relaxing your filters or create your own opportunity to assemble a new team."
              actionLabel="Reset Filters"
              onAction={handleResetFilters}
            />
          )}
        </div>
      </div>
    </div>
  );
}
