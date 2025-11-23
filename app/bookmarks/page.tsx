'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Bookmark as BookmarkIcon, ArrowLeft, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { SearchBar } from '@/components/features/SearchBar';
import { useAuth } from '@/lib/hooks/useAuth';
import { useBookmarks } from '@/lib/hooks/useBookmarks';
import { ResourceCard } from '@/components/features/ResourceCard';
import { Resource } from '@/types/database';

export default function BookmarksPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { bookmarks, isLoading, refetch } = useBookmarks();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date_added' | 'rating' | 'title' | 'difficulty'>('date_added');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, authLoading, router]);

  useEffect(() => {
    if (isAuthenticated) {
      refetch();
    }
  }, [isAuthenticated, refetch]);

  // Filter and sort bookmarks
  const filteredAndSortedBookmarks = useMemo(() => {
    let filtered = bookmarks.filter(bookmark => {
      if (!bookmark.resource) return false;
      
      const resource = bookmark.resource;
      const query = searchQuery.toLowerCase();
      
      // Search in title, topics, author, source, and key takeaways
      const matchesTitle = resource.title?.toLowerCase().includes(query);
      const matchesTopics = Array.isArray(resource.topics) && resource.topics.some(topic => 
        String(topic).toLowerCase().includes(query)
      );
      const matchesAuthor = resource.author?.toLowerCase().includes(query);
      const matchesSource = resource.source?.toLowerCase().includes(query);
      const matchesKeyTakeaways = Array.isArray(resource.key_takeaways) && resource.key_takeaways.some(takeaway =>
        String(takeaway).toLowerCase().includes(query)
      );
      
      return matchesTitle || matchesTopics || matchesAuthor || matchesSource || matchesKeyTakeaways;
    });

    // Sort bookmarks
    filtered.sort((a, b) => {
      const resourceA = a.resource;
      const resourceB = b.resource;
      
      if (!resourceA || !resourceB) return 0;

      let comparison = 0;

      switch (sortBy) {
        case 'title':
          comparison = (resourceA.title || '').localeCompare(resourceB.title || '');
          break;
        case 'rating':
          comparison = (resourceA.rating || 0) - (resourceB.rating || 0);
          break;
        case 'difficulty':
          const difficultyOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3 };
          const diffA = difficultyOrder[resourceA.difficulty as keyof typeof difficultyOrder] || 0;
          const diffB = difficultyOrder[resourceB.difficulty as keyof typeof difficultyOrder] || 0;
          comparison = diffA - diffB;
          break;
        case 'date_added':
        default:
          // Sort by bookmark creation date
          comparison = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [bookmarks, searchQuery, sortBy, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/')}
            className="mb-3 sm:mb-4 -ml-2 text-xs sm:text-sm touch-manipulation"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            Back to Home
          </Button>
          
          <div className="flex items-center gap-2 sm:gap-3 mb-2">
            <BookmarkIcon className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold">My Bookmarks</h1>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">
            {isLoading 
              ? 'Loading your bookmarks...' 
              : `${bookmarks.length} ${bookmarks.length === 1 ? 'resource' : 'resources'} saved`
            }
          </p>
        </div>

        {/* Search and Sort Controls */}
        {!isLoading && bookmarks.length > 0 && (
          <div className="space-y-4 mb-6">
            {/* Search Bar */}
            <div>
              <SearchBar 
                value={searchQuery} 
                onChange={setSearchQuery}
                placeholder="Search your bookmarks..."
              />
            </div>

            {/* Sort Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 pb-3 sm:pb-4 border-b">
              {/* Results Count */}
              <p className="text-xs sm:text-sm text-muted-foreground">
                Showing {filteredAndSortedBookmarks.length} of {bookmarks.length} bookmark{bookmarks.length !== 1 ? 's' : ''}
              </p>
              
              {/* Sort Controls */}
              <div className="flex items-center gap-2">
                <label htmlFor="sort-by" className="text-xs sm:text-sm font-medium whitespace-nowrap">
                  Sort by:
                </label>
                <Select
                  id="sort-by"
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as 'date_added' | 'rating' | 'title' | 'difficulty')
                  }
                  className="w-28 sm:w-36 text-xs sm:text-sm h-9 sm:h-10"
                >
                  <option value="date_added">Date Added</option>
                  <option value="rating">Rating</option>
                  <option value="title">Title</option>
                  <option value="difficulty">Difficulty</option>
                </Select>
                <Button 
                  variant="outline" 
                  onClick={toggleSortOrder} 
                  className="h-9 sm:h-10 px-2 sm:px-3 touch-manipulation"
                  aria-label={`Sort order: ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
                >
                  <ArrowUpDown className="w-4 h-4" />
                  <span className="ml-1 sm:ml-2 text-xs sm:text-sm">{sortOrder === 'asc' ? 'Asc' : 'Desc'}</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12 sm:py-20">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-primary"></div>
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-12 sm:py-20 px-3">
            <BookmarkIcon className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-gray-300 dark:text-gray-600 mb-4 sm:mb-6" />
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">
              No bookmarks yet
            </h2>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 max-w-md mx-auto">
              Start exploring resources and bookmark the ones you find interesting. 
              They&apos;ll appear here for easy access later.
            </p>
            <Button
              variant="primary"
              onClick={() => router.push('/')}
              className="touch-manipulation"
            >
              Explore Resources
            </Button>
          </div>
        ) : filteredAndSortedBookmarks.length === 0 && searchQuery ? (
          <div className="text-center py-12 sm:py-20 px-3">
            <BookmarkIcon className="w-16 h-16 sm:w-20 sm:h-20 mx-auto text-gray-300 dark:text-gray-600 mb-4 sm:mb-6" />
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3">
              No bookmarks found
            </h2>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-4 sm:mb-6 max-w-md mx-auto">
              No bookmarks match your search &quot;{searchQuery}&quot;. Try adjusting your search terms.
            </p>
            <Button
              variant="outline"
              onClick={() => setSearchQuery('')}
              className="touch-manipulation"
            >
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
            {filteredAndSortedBookmarks.map((bookmark) => {
              const resource = bookmark.resource;
              if (!resource) return null;

              // Transform the resource to match the Resource type
              const transformedResource: Resource = {
                id: resource.id,
                title: resource.title,
                url: resource.url,
                author: resource.author || null,
                source: resource.source || null,
                topics: resource.topics || null,
                tag_categories: resource.tag_categories || null,
                tag_subcategories: resource.tag_subcategories || null,
                difficulty: resource.difficulty || null,
                rating: resource.rating || null,
                key_takeaways: resource.key_takeaways || null,
                date_added: resource.date_added || null,
                publisher: resource.publisher || null,
                created_at: resource.created_at,
                updated_at: resource.updated_at,
              };

              return (
                <ResourceCard
                  key={bookmark.id}
                  resource={transformedResource}
                  searchQuery={searchQuery}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
