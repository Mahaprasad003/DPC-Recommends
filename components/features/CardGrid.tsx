'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { ResourceCard } from './ResourceCard';
import { Resource } from '@/types/database';
import { useInfiniteScroll } from '@/lib/hooks/useInfiniteScroll';

interface CardGridProps {
  resources: Resource[];
  searchQuery?: string;
  isLoading?: boolean;
  viewMode?: 'grid' | 'list';
}

const INITIAL_ITEMS = 20;
const ITEMS_PER_PAGE = 20;

export const CardGrid: React.FC<CardGridProps> = ({ resources, searchQuery, isLoading, viewMode = 'grid' }) => {
  const [displayCount, setDisplayCount] = useState(INITIAL_ITEMS);

  // Load more items when scrolling
  const loadMore = useCallback(() => {
    if (displayCount < resources.length) {
      setDisplayCount(prev => Math.min(prev + ITEMS_PER_PAGE, resources.length));
    }
  }, [displayCount, resources.length]);

  // Reset display count when resources change (search/filter)
  React.useEffect(() => {
    setDisplayCount(INITIAL_ITEMS);
  }, [resources]);

  const loadMoreRef = useInfiniteScroll(loadMore, {
    threshold: 0.1,
    rootMargin: '200px',
  });

  // Get visible resources
  const visibleResources = useMemo(
    () => resources.slice(0, displayCount),
    [resources, displayCount]
  );

  const hasMore = displayCount < resources.length;
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7 md:gap-8">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-72 sm:h-64 bg-muted animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 px-3">
        <p className="text-muted-foreground text-base sm:text-lg">No resources found</p>
        <p className="text-muted-foreground text-xs sm:text-sm mt-2">
          {searchQuery 
            ? 'Try adjusting your search or filters' 
            : 'No data available in the database. Please check:'}
        </p>
        {!searchQuery && (
          <ul className="text-left text-xs sm:text-sm text-muted-foreground mt-4 max-w-md mx-auto space-y-2">
            <li>• Verify data exists in the technical_content table</li>
            <li>• Check RLS policies allow public read access</li>
            <li>• Visit /test-db to debug the connection</li>
          </ul>
        )}
      </div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-3">
        {visibleResources.map((resource, index) => (
          <div
            key={resource.id}
            className="animate-fadeIn"
            style={{
              animationDelay: `${(index % ITEMS_PER_PAGE) * 50}ms`,
              animationFillMode: 'backwards'
            }}
          >
            <ResourceCard
              resource={resource}
              searchQuery={searchQuery}
              viewMode="list"
            />
          </div>
        ))}
        
        {/* Load more trigger */}
        {hasMore && (
          <div ref={loadMoreRef} className="py-8 text-center">
            <div className="inline-block">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          </div>
        )}

        {/* Show count */}
        {!hasMore && resources.length > INITIAL_ITEMS && (
          <div className="text-center py-4 text-sm text-muted-foreground">
            All {resources.length} resources loaded
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-7 md:gap-8">
        {visibleResources.map((resource, index) => (
          <div
            key={resource.id}
            className="animate-fadeIn"
            style={{
              animationDelay: `${(index % ITEMS_PER_PAGE) * 50}ms`,
              animationFillMode: 'backwards'
            }}
          >
            <ResourceCard
              resource={resource}
              searchQuery={searchQuery}
              viewMode="grid"
            />
          </div>
        ))}
      </div>
      
      {/* Load more trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="py-8 text-center">
          <div className="inline-block">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}

      {/* Show count */}
      {!hasMore && resources.length > INITIAL_ITEMS && (
        <div className="text-center py-4 text-sm text-muted-foreground">
          All {resources.length} resources loaded
        </div>
      )}
    </>
  );
};

