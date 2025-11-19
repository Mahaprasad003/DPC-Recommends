'use client';

import React, { useState, useMemo } from 'react';
import { SearchBar } from '@/components/features/SearchBar';
import { FilterPanel } from '@/components/features/FilterPanel';
import { CardGrid } from '@/components/features/CardGrid';
import { HeroSection } from '@/components/features/HeroSection';
import { useResources, useResourceOptions } from '@/lib/hooks/useResources';
import { useSneakPeekContent } from '@/lib/hooks/useSneakPeekContent';
import { useAuth } from '@/lib/hooks/useAuth';
import { FilterOptions } from '@/types/database';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { ArrowUpDown } from 'lucide-react';

export default function HomePage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
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

  // Fetch main content for authenticated users
  const { data: resources, isLoading: resourcesLoading, error: resourcesError } = useResources({
    searchQuery,
    filters,
    sortBy,
    sortOrder,
  });

  // Fetch sneak peek content for unauthenticated users
  const { data: sneakPeekContent, isLoading: sneakPeekLoading, error: sneakPeekError } = useSneakPeekContent();

  const { data: options } = useResourceOptions();

  // Determine which data to use based on auth status
  const isLoading = authLoading || (isAuthenticated ? resourcesLoading : sneakPeekLoading);
  const error = isAuthenticated ? resourcesError : sneakPeekError;
  const displayResources = isAuthenticated ? (resources || []) : (sneakPeekContent || []);

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

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-64 bg-muted animate-pulse rounded-lg"
            />
          ))}
        </div>
      </div>
    );
  }

  // Show hero section and sneak peek content for unauthenticated users
  if (!isAuthenticated) {
    return (
      <div className="space-y-12">
        {/* Hero Section */}
        <HeroSection
          onSignUp={() => {
            // This will be handled by the Header component's modal
            // We can trigger it via a custom event or pass a callback
            window.dispatchEvent(new CustomEvent('openLoginModal', { detail: { mode: 'signup' } }));
          }}
          onSignIn={() => {
            window.dispatchEvent(new CustomEvent('openLoginModal', { detail: { mode: 'signin' } }));
          }}
        />

        {/* Sneak Peek Section */}
        <div className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">Sneak Peek</h2>
            <p className="text-muted-foreground">
              Here's a preview of what you'll get access to after signing in
            </p>
          </div>

          {/* Content Coverage Box */}
          <div className="max-w-3xl mx-auto">
            <div className="p-6 rounded-lg border bg-card/50 backdrop-blur-sm">
              <p className="text-center text-sm sm:text-base text-muted-foreground">
                <span className="font-semibold text-foreground">Comprehensive coverage:</span> Classical ML, Deep Learning, Agents, LLMs, MCP, and much more from{' '}
                <span className="font-semibold text-foreground">well-reputed sources</span>
              </p>
            </div>
          </div>

          {/* Results Count */}
          {!sneakPeekLoading && sneakPeekContent && (
            <div className="text-sm text-muted-foreground text-center">
              Showing {sneakPeekContent.length} resource{sneakPeekContent.length !== 1 ? 's' : ''} (300+ available after sign in)
            </div>
          )}

          {/* Error State */}
          {sneakPeekError && (
            <div className="text-center py-12">
              <p className="text-destructive text-lg">Error loading sneak peek content</p>
              <p className="text-muted-foreground text-sm mt-2">
                {sneakPeekError.message || 'Please check your Supabase configuration'}
              </p>
              <p className="text-muted-foreground text-xs mt-2">
                Check the browser console for more details
              </p>
            </div>
          )}

          {/* Sneak Peek Content Grid */}
          {!sneakPeekError && (
            <CardGrid resources={displayResources} searchQuery="" isLoading={sneakPeekLoading} />
          )}

          {/* Bottom CTA */}
          <div className="text-center pt-8 pb-4">
            <p className="text-muted-foreground mb-2">
              Want to see all 300+ resources with full search and filtering?
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Plus get access to our{' '}
              <a 
                href="https://datapecharcha.substack.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                free high-value newsletter
              </a>
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="primary"
                size="lg"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('openLoginModal', { detail: { mode: 'signup' } }));
                }}
                className="px-8"
              >
                Sign Up Free
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent('openLoginModal', { detail: { mode: 'signin' } }));
                }}
                className="px-8"
              >
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show full content with filters for authenticated users
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
      <CardGrid resources={displayResources} searchQuery={searchQuery} isLoading={isLoading} />
    </div>
  );
}

