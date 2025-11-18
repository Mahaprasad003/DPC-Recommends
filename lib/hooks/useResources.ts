import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
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
      // Start with a simple query - no filters, no sorting
      let query = supabase.from('technical_content').select('*');
      
      // Log the initial query setup
      if (process.env.NODE_ENV === 'development') {
        console.log('Initial query setup for technical_content table');
      }

      // Apply search - search across text fields
      if (searchQuery.trim()) {
        const searchTerm = `%${searchQuery.trim()}%`;
        query = query.or(
          `title.ilike.${searchTerm},source.ilike.${searchTerm}`
        );
      }

      // Apply filters
      if (filters) {
        // Filter by tag categories (text column - use OR logic for multiple selections)
        if (filters.tagCategories && filters.tagCategories.length > 0) {
          try {
            // Since tag_categories is text, we use .or() with .ilike() for each category
            if (filters.tagCategories.length === 1) {
              query = query.ilike('tag_categories', `%${filters.tagCategories[0]}%`);
            } else {
              // Multiple categories: match any of them
              const categoryConditions = filters.tagCategories
                .map((cat) => `tag_categories.ilike.%${cat}%`)
                .join(',');
              query = query.or(categoryConditions);
            }
          } catch (error) {
            console.warn('Tag categories filter failed:', error);
          }
        }

        // Filter by tag subcategories (array overlap)
        if (filters.tagSubcategories && filters.tagSubcategories.length > 0) {
          try {
            query = query.overlaps('tag_subcategories', filters.tagSubcategories);
          } catch (error) {
            console.warn('Tag subcategories filter failed:', error);
          }
        }

        // Filter by topics (array overlap) - kept for backward compatibility
        if (filters.topics && filters.topics.length > 0) {
          try {
            query = query.overlaps('topics', filters.topics);
          } catch (error) {
            console.warn('Topics filter failed (column might not be array type):', error);
            // Continue without topics filter
          }
        }

        if (filters.difficulty && filters.difficulty.length > 0) {
          query = query.in('difficulty', filters.difficulty);
        }

        if (filters.content_type && filters.content_type.length > 0) {
          query = query.in('content_type', filters.content_type);
        }
      }

      const { data, error } = await query;

      // Log for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('Supabase Query Result:', {
          dataLength: data?.length,
          error: error?.message,
          errorCode: error?.code,
          errorDetails: error?.details,
          hasData: !!data,
        });
      }

      if (error) {
        console.error('Supabase Error Details:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        });
        throw error;
      }

      let results = (data || []) as Resource[];
      
      // Apply sorting client-side if we have results and sortBy is specified
      // This avoids database errors if the column doesn't exist
      if (sortBy && results.length > 0) {
        try {
          results.sort((a, b) => {
            let aVal: any = a[sortBy];
            let bVal: any = b[sortBy];
            
            // Handle null/undefined values
            if (aVal === null || aVal === undefined) aVal = '';
            if (bVal === null || bVal === undefined) bVal = '';
            
            // Handle string comparison
            if (typeof aVal === 'string') {
              aVal = aVal.toLowerCase();
              bVal = bVal.toLowerCase();
            }
            
            const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
            return sortOrder === 'asc' ? comparison : -comparison;
          });
        } catch (sortError) {
          console.warn('Client-side sorting failed:', sortError);
          // Continue without sorting
        }
      }

      // Client-side search in array fields (topics, key_takeaways) for better search coverage
      if (searchQuery.trim()) {
        const searchLower = searchQuery.trim().toLowerCase();
        // Also fetch resources that match in array fields
        const arrayQuery = supabase.from('technical_content').select('*');
        
        // Apply same filters
        if (filters) {
          if (filters.tagCategories && filters.tagCategories.length > 0) {
            try {
              // Since tag_categories is text, use .ilike() for search
              if (filters.tagCategories.length === 1) {
                arrayQuery.ilike('tag_categories', `%${filters.tagCategories[0]}%`);
              } else {
                const categoryConditions = filters.tagCategories
                  .map((cat) => `tag_categories.ilike.%${cat}%`)
                  .join(',');
                arrayQuery.or(categoryConditions);
              }
            } catch (error) {
              console.warn('Tag categories filter failed in array query:', error);
            }
          }
          if (filters.tagSubcategories && filters.tagSubcategories.length > 0) {
            try {
              arrayQuery.overlaps('tag_subcategories', filters.tagSubcategories);
            } catch (error) {
              console.warn('Tag subcategories filter failed in array query:', error);
            }
          }
          if (filters.topics && filters.topics.length > 0) {
            try {
              arrayQuery.overlaps('topics', filters.topics);
            } catch (error) {
              console.warn('Topics filter failed in array query:', error);
            }
          }
          if (filters.difficulty && filters.difficulty.length > 0) {
            arrayQuery.in('difficulty', filters.difficulty);
          }
          if (filters.content_type && filters.content_type.length > 0) {
            arrayQuery.in('content_type', filters.content_type);
          }
        }

        const { data: allFiltered } = await arrayQuery;
        const arrayMatches = (allFiltered || [])
          .filter((resource: Resource) => {
            // Ensure topics is an array before using .some()
            const topicsArray = Array.isArray(resource.topics) ? resource.topics : [];
            const inTopics = topicsArray.some((topic) =>
              String(topic).toLowerCase().includes(searchLower)
            );
            
            // Ensure key_takeaways is an array before using .some()
            const takeawaysArray = Array.isArray(resource.key_takeaways) ? resource.key_takeaways : [];
            const inTakeaways = takeawaysArray.some((takeaway) =>
              String(takeaway).toLowerCase().includes(searchLower)
            );
            
            return (inTopics || inTakeaways) && !results.find((r) => r.id === resource.id);
          }) as Resource[];

        results = [...results, ...arrayMatches];
      }

      // Re-apply sorting to combined results
      if (sortBy && results.length > 0) {
        results.sort((a, b) => {
          let aVal: any = a[sortBy];
          let bVal: any = b[sortBy];
          
          if (aVal === null || aVal === undefined) aVal = '';
          if (bVal === null || bVal === undefined) bVal = '';
          
          if (typeof aVal === 'string') {
            aVal = aVal.toLowerCase();
            bVal = bVal.toLowerCase();
          }
          
          const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
          return sortOrder === 'asc' ? comparison : -comparison;
        });
      }

      return results;
    },
    staleTime: 1000 * 60 * 60 * 12, // 12 hours - data considered fresh for 12 hours
  });
}

// Helper to convert text to array (handles JSON strings, comma-separated, or already arrays)
const textToArray = (value: any): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === 'string') {
    // Try parsing as JSON first
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      // Not JSON, try splitting by comma or newline
      return value.split(/[,\n]/).map((s: string) => s.trim()).filter(Boolean);
    }
  }
  return [];
};

export function useResourceOptions() {
  return useQuery({
    queryKey: ['resource-options'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('technical_content')
        .select('topics, tag_categories, tag_subcategories, difficulty, content_type');

      if (error) {
        console.error('Error fetching resource options:', error);
        throw error;
      }

      const topics = new Set<string>();
      const tagCategories = new Set<string>();
      const tagSubcategories = new Set<string>();
      const difficulties = new Set<string>();
      const contentTypes = new Set<string>();

      data?.forEach((resource) => {
        // Topics - handle both array and text
        const topicsArray = textToArray(resource.topics);
        topicsArray.forEach((topic) => topics.add(topic));
        
        // Tag categories - text column, might contain comma-separated or single value
        if (resource.tag_categories) {
          const categoriesArray = textToArray(resource.tag_categories);
          categoriesArray.forEach((cat) => tagCategories.add(cat));
        }
        
        // Tag subcategories - array column
        if (resource.tag_subcategories) {
          const subcategoriesArray = textToArray(resource.tag_subcategories);
          subcategoriesArray.forEach((subcat) => tagSubcategories.add(subcat));
        }
        
        if (resource.difficulty) difficulties.add(String(resource.difficulty));
        if (resource.content_type) contentTypes.add(String(resource.content_type));
      });

      const result = {
        topics: Array.from(topics).sort(),
        tagCategories: Array.from(tagCategories).sort(),
        tagSubcategories: Array.from(tagSubcategories).sort(),
        difficulties: Array.from(difficulties).sort(),
        content_types: Array.from(contentTypes).sort(),
      };

      // Debug logging
      if (process.env.NODE_ENV === 'development') {
        console.log('Resource options loaded:', {
          topics: result.topics.length,
          tagCategories: result.tagCategories.length,
          tagSubcategories: result.tagSubcategories.length,
          difficulties: result.difficulties.length,
          content_types: result.content_types.length,
        });
      }

      return result;
    },
    staleTime: 1000 * 60 * 60 * 12, // 12 hours - filter options change rarely, cache for 12 hours
  });
}
