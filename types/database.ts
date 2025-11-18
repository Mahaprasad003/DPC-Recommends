export interface Resource {
  id: string;
  title: string;
  url: string;
  author: string | null;
  source: string | null;
  topics: string[] | null;
  tag_categories: string[] | null;
  tag_subcategories: string[] | null;
  difficulty: string | null;
  rating: number | null;
  key_takeaways: string[] | null;
  date_added: string | null;
  publisher: string | null;
  created_at?: string;
  updated_at?: string;
}

export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced' | string;

export interface FilterOptions {
  topics: string[];
  tagCategories: string[];
  tagSubcategories: string[];
  difficulty: string[];
  content_type: string[];
}

export interface SearchFilters {
  search: string;
  filters: FilterOptions;
  sortBy: 'date_added' | 'rating' | 'title' | 'difficulty';
  sortOrder: 'asc' | 'desc';
}

