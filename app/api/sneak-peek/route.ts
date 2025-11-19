import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';
import { Resource } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function fetchSneakPeekContent(): Promise<Resource[]> {
  const { data, error } = await supabase
    .from('sneak_peek_content')
    .select('*')
    .order('date_added', { ascending: false });

  if (error) {
    // Handle errors gracefully
    if (error.code === 'PGRST116' || error.message.includes('does not exist')) {
      return [];
    }
    if (error.code === '42501' || error.message.includes('permission denied')) {
      return [];
    }
    throw error;
  }

  return (data || []) as Resource[];
}

// Cached version with 24 hour revalidation (sneak peek updates with daily refresh)
const getCachedSneakPeek = unstable_cache(
  async () => {
    return fetchSneakPeekContent();
  },
  ['sneak-peek-content'],
  {
    revalidate: 86400, // 24 hours
    tags: ['sneak-peek-content'],
  }
);

export async function GET() {
  try {
    const data = await getCachedSneakPeek();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching sneak peek content:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch sneak peek content' },
      { status: 500 }
    );
  }
}

