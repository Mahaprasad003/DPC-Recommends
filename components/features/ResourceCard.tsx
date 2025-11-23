'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Tag } from '@/components/ui/Tag';
import { Resource } from '@/types/database';
import { capitalize } from '@/lib/utils/format';
import { ExternalLink, Building2, Bookmark, Check } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useBookmarks } from '@/lib/hooks/useBookmarks';

interface ResourceCardProps {
  resource: Resource;
  searchQuery?: string;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, searchQuery }) => {
  const { isAuthenticated } = useAuth();
  const { toggleBookmark, isBookmarked } = useBookmarks();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const bookmarked = isBookmarked(resource.id);

  const handleCardClick = () => {
    if (resource.url) {
      const url = ensureProtocol(resource.url);
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      return;
    }

    try {
      await toggleBookmark(resource.id);
      // Show confirmation animation
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 1500);
    } catch (error) {
      console.error('Bookmark error:', error);
    }
  };

  // Reset confirmation when bookmark state changes externally
  useEffect(() => {
    setShowConfirmation(false);
  }, [bookmarked]);

  const ensureProtocol = (url: string) => {
    if (!url) return url;
    // If URL doesn't start with http:// or https://, add https://
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  };

  const highlightText = (text: string, query?: string) => {
    if (!query || !text) return text;
    
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-900">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  const getDifficultyColor = (difficulty: string | null) => {
    if (!difficulty) return 'default';
    const diff = difficulty.toLowerCase();
    if (diff.includes('beginner')) return 'success';
    if (diff.includes('intermediate')) return 'warning';
    if (diff.includes('advanced')) return 'danger';
    return 'default';
  };

  return (
    <Card
      className="h-full cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] group relative flex flex-col"
      onClick={handleCardClick}
    >
      {/* Bookmark Button - Top Right Corner */}
      {isAuthenticated && (
        <button
          onClick={handleBookmarkClick}
          className={`
            absolute top-2 right-2 z-10 
            w-7 h-7 sm:w-8 sm:h-8
            flex items-center justify-center
            rounded-full
            transition-all duration-300 transform
            ${bookmarked
              ? 'bg-primary/90 hover:bg-primary text-primary-foreground scale-100' 
              : 'bg-white/90 dark:bg-gray-800/90 text-gray-600 dark:text-gray-400 hover:scale-110 hover:text-primary active:scale-95'
            }
            ${showConfirmation ? 'scale-125' : ''}
            backdrop-blur-sm shadow-md hover:shadow-lg
            border ${bookmarked ? 'border-primary/50' : 'border-gray-200 dark:border-gray-700'}
            touch-manipulation
          `}
          aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
          title={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          {showConfirmation ? (
            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" />
          ) : (
            <Bookmark 
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all ${bookmarked ? 'fill-current' : ''}`}
            />
          )}
        </button>
      )}
      
      <CardHeader className="pb-2 px-3 sm:px-4 pt-3 sm:pt-4 pr-11 sm:pr-12">
        <h3 
          className="text-sm sm:text-base font-semibold line-clamp-2 sm:line-clamp-3 group-hover:text-primary transition-colors leading-tight sm:leading-snug"
          title={resource.title}
        >
          {searchQuery ? highlightText(resource.title, searchQuery) : resource.title}
        </h3>
      </CardHeader>
      
      <CardContent className="space-y-2 px-3 sm:px-4 pb-3 sm:pb-4 flex-1 flex flex-col pr-11 sm:pr-4">
        {/* URL */}
        {resource.url && (
          <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
            <ExternalLink className="w-3 h-3 flex-shrink-0 mt-0.5" />
            <a 
              href={ensureProtocol(resource.url)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline break-all line-clamp-1 min-w-0 touch-manipulation"
              onClick={(e) => e.stopPropagation()}
            >
              {resource.url}
            </a>
          </div>
        )}

        {/* Source */}
        {resource.source && (
          <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
            <Building2 className="w-3 h-3 flex-shrink-0 mt-0.5" />
            <span className="break-words line-clamp-1">{resource.source}</span>
          </div>
        )}

        <div className="flex-1"></div>

        {/* Difficulty & Topics Container */}
        <div className="space-y-1.5 sm:space-y-2 pt-1">
          {/* Difficulty */}
          {resource.difficulty && (
            <div>
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] sm:text-xs font-medium border ${
                getDifficultyColor(resource.difficulty) === 'success' 
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                  : getDifficultyColor(resource.difficulty) === 'warning'
                  ? 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                  : getDifficultyColor(resource.difficulty) === 'danger'
                  ? 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
              }`}>
                {capitalize(resource.difficulty)}
              </span>
            </div>
          )}

          {/* Topics */}
          {resource.topics && 
           Array.isArray(resource.topics) && 
           resource.topics.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {resource.topics.slice(0, 3).map((topic, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2 py-0.5 rounded text-[11px] sm:text-xs font-medium bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-800"
                  title={String(topic)}
                >
                  {String(topic)}
                </span>
              ))}
              {resource.topics.length > 3 && (
                <span 
                  className="inline-flex items-center px-2 py-0.5 rounded text-[11px] sm:text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-slate-700 cursor-help"
                  title={resource.topics.slice(3).join(', ')}
                >
                  +{resource.topics.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

