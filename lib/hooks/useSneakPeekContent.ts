import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { Resource } from '@/types/database';

export function useSneakPeekContent() {
  return useQuery({
    queryKey: ['sneak-peek-content'],
    queryFn: async () => {
      // Try to fetch from sneak_peek_content table
      const { data, error } = await supabase
        .from('sneak_peek_content')
        .select('*')
        .order('date_added', { ascending: false });

      // Log for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('Sneak Peek Content Query Result:', {
          dataLength: data?.length,
          error: error?.message,
          errorCode: error?.code,
          errorDetails: error?.details,
          hasData: !!data,
        });
      }

      if (error) {
        console.error('Error fetching sneak peek content:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
        
        // If table doesn't exist or permission denied, return empty array instead of throwing
        // This allows the app to continue working even if sneak_peek_content isn't set up
        if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
          console.warn('sneak_peek_content table does not exist or is not accessible. Returning empty array.');
          return [] as Resource[];
        }
        
        if (error.code === '42501' || error.message.includes('permission denied')) {
          console.warn('Permission denied for sneak_peek_content table. Check RLS policies. Returning empty array.');
          return [] as Resource[];
        }
        
        throw error;
      }

      return (data || []) as Resource[];
    },
    staleTime: 1000 * 60 * 60 * 12, // 12 hours
    retry: 1, // Only retry once
  });
}

