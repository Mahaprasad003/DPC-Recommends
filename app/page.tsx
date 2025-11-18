'use client';

import React, { useState, useMemo } from 'react';
import { SearchBar } from '@/components/features/SearchBar';
import { FilterPanel } from '@/components/features/FilterPanel';
import { CardGrid } from '@/components/features/CardGrid';
import { useResources, useResourceOptions } from '@/lib/hooks/useResources';
import { FilterOptions } from '@/types/database';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ArrowUpDown } from 'lucide-react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    topics: [],
    tagCategories: [],
    tagSubcategories: [],
    difficulty: [],
    content_type: [],
  });
  const [sortBy, setSortBy] = useState<'date_added' | 'rating' | 'title' | 'difficulty'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const { data: resources, isLoading, error } = useResources({
    searchQuery,
    filters,
    sortBy,
    sortOrder,
  });

  const { data: options } = useResourceOptions();

  const availableOptions = useMemo(
    () => ({
      topics: options?.topics || [],
      tagCategories: options?.tagCategories || [],
      tagSubcategories: options?.tagSubcategories || [],
      difficulties: options?.difficulties || [],
      content_types: options?.content_types || [],
    }),
    [options]
  );

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="space-y-4">

        {/* Search and Sort */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <div className="flex-1 min-w-0">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as 'date_added' | 'rating' | 'title' | 'difficulty')
              }
              className="w-full sm:w-40 text-sm"
            >
              <option value="date_added">Date Added</option>
              <option value="rating">Rating</option>
              <option value="title">Title</option>
              <option value="difficulty">Difficulty</option>
            </Select>
            <Button variant="outline" onClick={toggleSortOrder} className="flex-shrink-0">
              <ArrowUpDown className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">{sortOrder === 'asc' ? 'Asc' : 'Desc'}</span>
            </Button>
          </div>
        </div>

        {/* Filters */}
        {options && (
          <FilterPanel
            filters={filters}
            onFiltersChange={setFilters}
            availableOptions={availableOptions}
          />
        )}
      </div>

      {/* Results Count */}
      {!isLoading && resources && (
        <div className="text-sm text-muted-foreground">
          Showing {resources.length} resource{resources.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-12">
          <p className="text-destructive text-lg">Error loading resources</p>
          <p className="text-muted-foreground text-sm mt-2">
            {error.message || 'Please check your Supabase configuration'}
          </p>
        </div>
      )}

      {/* Resources Grid */}
      <CardGrid resources={resources || []} searchQuery={searchQuery} isLoading={isLoading} />
    </div>
  );
}

