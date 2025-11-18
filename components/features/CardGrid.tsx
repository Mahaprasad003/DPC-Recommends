'use client';

import React from 'react';
import { ResourceCard } from './ResourceCard';
import { Resource } from '@/types/database';

interface CardGridProps {
  resources: Resource[];
  searchQuery?: string;
  isLoading?: boolean;
}

export const CardGrid: React.FC<CardGridProps> = ({ resources, searchQuery, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-64 bg-muted animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  if (resources.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No resources found</p>
        <p className="text-muted-foreground text-sm mt-2">
          {searchQuery 
            ? 'Try adjusting your search or filters' 
            : 'No data available in the database. Please check:'}
        </p>
        {!searchQuery && (
          <ul className="text-left text-sm text-muted-foreground mt-4 max-w-md mx-auto space-y-2">
            <li>• Verify data exists in the technical_content table</li>
            <li>• Check RLS policies allow public read access</li>
            <li>• Visit /test-db to debug the connection</li>
          </ul>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {resources.map((resource) => (
        <ResourceCard
          key={resource.id}
          resource={resource}
          searchQuery={searchQuery}
        />
      ))}
    </div>
  );
};

