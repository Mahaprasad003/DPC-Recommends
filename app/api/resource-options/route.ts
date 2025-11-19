import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper to convert text to array
const textToArray = (value: any): string[] => {
  if (!value) return [];
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.map(String);
    } catch {
      return value.split(/[,\n]/).map((s: string) => s.trim()).filter(Boolean);
    }
  }
  return [];
};

async function fetchResourceOptions() {
  const { data, error } = await supabase
    .from('technical_content')
    .select('topics, tag_categories, tag_subcategories, difficulty, content_type');

  if (error) {
    throw error;
  }

  const topics = new Set<string>();
  const tagCategories = new Set<string>();
  const tagSubcategories = new Set<string>();
  const difficulties = new Set<string>();
  const contentTypes = new Set<string>();

  data?.forEach((resource) => {
    const topicsArray = textToArray(resource.topics);
    topicsArray.forEach((topic) => topics.add(topic));

    if (resource.tag_categories) {
      const categoriesArray = textToArray(resource.tag_categories);
      categoriesArray.forEach((cat) => tagCategories.add(cat));
    }

    if (resource.tag_subcategories) {
      const subcategoriesArray = textToArray(resource.tag_subcategories);
      subcategoriesArray.forEach((subcat) => tagSubcategories.add(subcat));
    }

    if (resource.difficulty) difficulties.add(String(resource.difficulty));
    if (resource.content_type) contentTypes.add(String(resource.content_type));
  });

  return {
    topics: Array.from(topics).sort(),
    tagCategories: Array.from(tagCategories).sort(),
    tagSubcategories: Array.from(tagSubcategories).sort(),
    difficulties: Array.from(difficulties).sort(),
    content_types: Array.from(contentTypes).sort(),
  };
}

// Cached version with 24 hour revalidation (options change with daily updates)
const getCachedResourceOptions = unstable_cache(
  async () => {
    return fetchResourceOptions();
  },
  ['resource-options'],
  {
    revalidate: 86400, // 24 hours
    tags: ['resource-options'],
  }
);

export async function GET() {
  try {
    const data = await getCachedResourceOptions();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Error fetching resource options:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch resource options' },
      { status: 500 }
    );
  }
}

