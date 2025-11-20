import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';
import { Resource, FilterOptions } from '@/types/database';

// Mark as dynamic since we use searchParams
export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to build query
async function fetchResources(
  searchQuery: string,
  filters: FilterOptions,
  sortBy: string,
  sortOrder: string
): Promise<Resource[]> {
  let query = supabase.from('technical_content').select('*');

  // Apply search
  if (searchQuery.trim()) {
    const searchTerm = searchQuery.trim();
    query = query.or(`title.ilike.%${searchTerm}%,source.ilike.%${searchTerm}%`);
  }

  // Apply filters
  if (filters) {
    if (filters.tagCategories && filters.tagCategories.length > 0) {
      if (filters.tagCategories.length === 1) {
        query = query.ilike('tag_categories', `%${filters.tagCategories[0]}%`);
      } else {
        const categoryConditions = filters.tagCategories
          .map((cat) => `tag_categories.ilike.%${cat}%`)
          .join(',');
        query = query.or(categoryConditions);
      }
    }

    if (filters.tagSubcategories && filters.tagSubcategories.length > 0) {
      query = query.overlaps('tag_subcategories', filters.tagSubcategories);
    }

    if (filters.topics && filters.topics.length > 0) {
      query = query.overlaps('topics', filters.topics);
    }

    if (filters.difficulty && filters.difficulty.length > 0) {
      query = query.in('difficulty', filters.difficulty);
    }

    if (filters.content_type && filters.content_type.length > 0) {
      query = query.in('content_type', filters.content_type);
    }
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  let results = (data || []) as Resource[];

  // Client-side sorting
  if (sortBy && results.length > 0) {
    results.sort((a, b) => {
      let aVal: any = a[sortBy as keyof Resource];
      let bVal: any = b[sortBy as keyof Resource];

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

  // Client-side search in array fields
  if (searchQuery.trim()) {
    const searchLower = searchQuery.trim().toLowerCase();
    let arrayQuery = supabase.from('technical_content').select('*');

    if (filters) {
      if (filters.tagCategories && filters.tagCategories.length > 0) {
        if (filters.tagCategories.length === 1) {
          arrayQuery = arrayQuery.ilike('tag_categories', `%${filters.tagCategories[0]}%`);
        } else {
          const categoryConditions = filters.tagCategories
            .map((cat) => `tag_categories.ilike.%${cat}%`)
            .join(',');
          arrayQuery = arrayQuery.or(categoryConditions);
        }
      }
      if (filters.tagSubcategories && filters.tagSubcategories.length > 0) {
        arrayQuery = arrayQuery.overlaps('tag_subcategories', filters.tagSubcategories);
      }
      if (filters.topics && filters.topics.length > 0) {
        arrayQuery = arrayQuery.overlaps('topics', filters.topics);
      }
      if (filters.difficulty && filters.difficulty.length > 0) {
        arrayQuery = arrayQuery.in('difficulty', filters.difficulty);
      }
      if (filters.content_type && filters.content_type.length > 0) {
        arrayQuery = arrayQuery.in('content_type', filters.content_type);
      }
    }

    const { data: allFiltered } = await arrayQuery;
    const arrayMatches = (allFiltered || [])
      .filter((resource: Resource) => {
        const topicsArray = Array.isArray(resource.topics) ? resource.topics : [];
        const inTopics = topicsArray.some((topic) =>
          String(topic).toLowerCase().includes(searchLower)
        );

        const takeawaysArray = Array.isArray(resource.key_takeaways) ? resource.key_takeaways : [];
        const inTakeaways = takeawaysArray.some((takeaway) =>
          String(takeaway).toLowerCase().includes(searchLower)
        );

        return (inTopics || inTakeaways) && !results.find((r) => r.id === resource.id);
      }) as Resource[];

    results = [...results, ...arrayMatches];

    // Re-apply sorting
    if (sortBy && results.length > 0) {
      results.sort((a, b) => {
        let aVal: any = a[sortBy as keyof Resource];
        let bVal: any = b[sortBy as keyof Resource];

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
  }

  return results;
}

// Cached version with 24 hour revalidation (database updates once daily)
const getCachedResources = unstable_cache(
  async (searchQuery: string, filters: FilterOptions, sortBy: string, sortOrder: string) => {
    return fetchResources(searchQuery, filters, sortBy, sortOrder);
  },
  ['resources'],
  {
    revalidate: 86400, // 24 hours
    tags: ['resources'],
  }
);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const searchQuery = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'date_added';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Parse filters from query params
    const filters: FilterOptions = {
      topics: searchParams.get('topics')?.split(',').filter(Boolean) || [],
      tagCategories: searchParams.get('tagCategories')?.split(',').filter(Boolean) || [],
      tagSubcategories: searchParams.get('tagSubcategories')?.split(',').filter(Boolean) || [],
      difficulty: searchParams.get('difficulty')?.split(',').filter(Boolean) || [],
      content_type: searchParams.get('content_type')?.split(',').filter(Boolean) || [],
    };

    const data = await getCachedResources(searchQuery, filters, sortBy, sortOrder);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching resources:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}

