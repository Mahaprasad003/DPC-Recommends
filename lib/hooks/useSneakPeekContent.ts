import { useQuery } from '@tanstack/react-query';
import { Resource } from '@/types/database';

export function useSneakPeekContent() {
  return useQuery({
    queryKey: ['sneak-peek-content'],
    queryFn: async () => {
      const response = await fetch('/api/sneak-peek');
      
      if (!response.ok) {
        const error = await response.json();
        // If it's a table not found error, return empty array
        if (error.error?.includes('does not exist') || error.error?.includes('permission denied')) {
          return [] as Resource[];
        }
        throw new Error(error.error || 'Failed to fetch sneak peek content');
      }

      const data = await response.json();
      return data as Resource[];
    },
    staleTime: 1000 * 60 * 60 * 12, // 12 hours
    retry: 1, // Only retry once
  });
}

