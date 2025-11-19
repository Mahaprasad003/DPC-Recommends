import { useQuery } from '@tanstack/react-query';
import { Resource, FilterOptions } from '@/types/database';

interface UseResourcesParams {
  searchQuery?: string;
  filters?: FilterOptions;
  sortBy?: 'date_added' | 'rating' | 'title' | 'difficulty';
  sortOrder?: 'asc' | 'desc';
}

export function useResources({
  searchQuery = '',
  filters,
  sortBy = 'date_added',
  sortOrder = 'desc',
}: UseResourcesParams = {}) {
  return useQuery({
    queryKey: ['resources', searchQuery, filters, sortBy, sortOrder],
    queryFn: async () => {
      // Build query params
      const params = new URLSearchParams();
      if (searchQuery) params.set('search', searchQuery);
      params.set('sortBy', sortBy);
      params.set('sortOrder', sortOrder);
      
      if (filters) {
        if (filters.topics?.length) params.set('topics', filters.topics.join(','));
        if (filters.tagCategories?.length) params.set('tagCategories', filters.tagCategories.join(','));
        if (filters.tagSubcategories?.length) params.set('tagSubcategories', filters.tagSubcategories.join(','));
        if (filters.difficulty?.length) params.set('difficulty', filters.difficulty.join(','));
        if (filters.content_type?.length) params.set('content_type', filters.content_type.join(','));
      }

      const response = await fetch(`/api/resources?${params.toString()}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch resources');
      }

      const data = await response.json();
      return data as Resource[];
    },
    staleTime: 1000 * 60 * 60 * 12, // 12 hours - data considered fresh for 12 hours
  });
}

export function useResourceOptions() {
  return useQuery({
    queryKey: ['resource-options'],
    queryFn: async () => {
      const response = await fetch('/api/resource-options');
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to fetch resource options');
      }

      const data = await response.json();
      return data;
    },
    staleTime: 1000 * 60 * 60 * 12, // 12 hours - filter options change rarely, cache for 12 hours
  });
}
