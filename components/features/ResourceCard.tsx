'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Resource } from '@/types/database';
import { capitalize } from '@/lib/utils/format';
import { Bookmark, Check, ExternalLink, Building2 } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useBookmarks } from '@/lib/hooks/useBookmarks';

interface ResourceCardProps {
  resource: Resource;
  searchQuery?: string;
  viewMode?: 'grid' | 'list';
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, searchQuery, viewMode = 'grid' }) => {
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
    if (!isAuthenticated) return;

    try {
      await toggleBookmark(resource.id);
      setShowConfirmation(true);
      setTimeout(() => setShowConfirmation(false), 1500);
    } catch (error) {
      console.error('Bookmark error:', error);
    }
  };

  useEffect(() => {
    setShowConfirmation(false);
  }, [bookmarked]);

  const ensureProtocol = (url: string) => {
    if (!url) return url;
    if (!/^https?:\/\//i.test(url)) return `https://${url}`;
    return url;
  };

  const highlightText = (text: string, query?: string) => {
    if (!query || !text) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-900 rounded px-0.5">{part}</mark>
      ) : part
    );
  };

  // Extract domain from URL
  const getDomain = (url: string | null) => {
    if (!url) return null;
    try {
      const fullUrl = ensureProtocol(url);
      return new URL(fullUrl).hostname.replace(/^www\./, '');
    } catch {
      return url.replace(/^https?:\/\/(www\.)?/, '').split('/')[0];
    }
  };

  const domain = getDomain(resource.url);

  // Get up to 2 tags
  const tags = resource.tag_subcategories?.slice(0, 2) || [];
  const remainingTagCount = (resource.tag_subcategories?.length || 0) - 2;

  // Truncate long tag names
  const truncateTag = (tag: string, maxLen: number = 18) => {
    const str = String(tag);
    return str.length > maxLen ? str.slice(0, maxLen) + '...' : str;
  };

  // Get difficulty badge styles
  const getDifficultyStyles = (difficulty: string | null) => {
    if (!difficulty) return 'bg-secondary/50 text-foreground border-border';
    const diff = difficulty.toLowerCase();
    if (diff.includes('beginner')) return 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700';
    if (diff.includes('intermediate')) return 'bg-amber-100 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700';
    if (diff.includes('advanced')) return 'bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-700';
    return 'bg-secondary/50 text-foreground border-border';
  };

  // List view layout - Icon-based style
  if (viewMode === 'list') {
    return (
      <div
        className="border rounded-lg hover:border-primary/50 transition-all cursor-pointer group bg-card p-4"
        onClick={handleCardClick}
      >
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            {/* Title - 1 line on list */}
            <h3 className="font-semibold text-base group-hover:text-primary transition-colors truncate">
              {searchQuery ? highlightText(resource.title, searchQuery) : resource.title}
            </h3>

            {/* Metadata row with icons */}
            <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1.5">
              {domain && (
                <span className="flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span className="truncate">{domain}</span>
                </span>
              )}
              {domain && resource.source && <span className="text-muted-foreground/40">•</span>}
              {resource.source && (
                <span className="flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  <span className="truncate">{resource.source}</span>
                </span>
              )}
            </div>

            {/* Tags row */}
            <div className="flex items-center gap-2 mt-2.5 flex-wrap">
              {resource.difficulty && (
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getDifficultyStyles(resource.difficulty)}`}>
                  {capitalize(resource.difficulty)}
                </span>
              )}
              {tags.slice(0, 1).map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-secondary/50 text-foreground"
                  title={String(tag)}
                >
                  {truncateTag(tag)}
                </span>
              ))}
              {/* Show 2nd tag only on larger screens */}
              {tags[1] && (
                <span
                  className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-secondary/50 text-foreground"
                  title={String(tags[1])}
                >
                  {truncateTag(tags[1])}
                </span>
              )}
              {remainingTagCount > 0 && (
                <span className="text-xs text-muted-foreground">+{remainingTagCount + (tags[1] ? 0 : 1)}</span>
              )}
              {/* Mobile: show +N if there's a hidden 2nd tag */}
              {tags[1] && remainingTagCount === 0 && (
                <span className="sm:hidden text-xs text-muted-foreground">+1</span>
              )}
            </div>
          </div>

          {/* Bookmark button */}
          {isAuthenticated && (
            <button
              onClick={handleBookmarkClick}
              className={`
                flex-shrink-0 w-9 h-9 flex items-center justify-center rounded-full
                transition-all duration-300
                ${bookmarked
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
                }
                touch-manipulation
              `}
              aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
            >
              {showConfirmation ? (
                <Check className="w-4 h-4 animate-pulse" />
              ) : (
                <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
              )}
            </button>
          )}
        </div>
      </div>
    );
  }

  // Grid view layout - Icon-based style
  return (
    <Card
      className="h-full cursor-pointer transition-all hover:border-primary/50 group relative flex flex-col"
      onClick={handleCardClick}
    >
      {/* Bookmark Button */}
      {isAuthenticated && (
        <button
          onClick={handleBookmarkClick}
          className={`
            absolute top-3 right-3 z-10 
            w-8 h-8 flex items-center justify-center rounded-full
            transition-all duration-300
            ${bookmarked
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
            }
            touch-manipulation
          `}
          aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
          {showConfirmation ? (
            <Check className="w-4 h-4 animate-pulse" />
          ) : (
            <Bookmark className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
          )}
        </button>
      )}

      <CardContent className="p-4 sm:p-5 flex flex-col h-full">
        {/* Title - Hero, 2 lines max */}
        <h3
          className="font-semibold text-base sm:text-lg leading-snug group-hover:text-primary transition-colors pr-8 line-clamp-2"
          title={resource.title}
        >
          {searchQuery ? highlightText(resource.title, searchQuery) : resource.title}
        </h3>

        {/* Metadata with icons */}
        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-2 flex-wrap">
          {domain && (
            <span className="flex items-center gap-1.5">
              <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{domain}</span>
            </span>
          )}
          {domain && resource.source && <span className="text-muted-foreground/40">•</span>}
          {resource.source && (
            <span className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{resource.source}</span>
            </span>
          )}
        </div>

        {/* Spacer */}
        <div className="flex-1 min-h-3" />

        {/* Bottom: Difficulty + Tags */}
        <div className="flex items-center gap-2 mt-4 flex-wrap">
          {resource.difficulty && (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getDifficultyStyles(resource.difficulty)}`}>
              {capitalize(resource.difficulty)}
            </span>
          )}
          {tags.slice(0, 1).map((tag, index) => (
            <span
              key={index}
              className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-secondary/50 text-foreground"
              title={String(tag)}
            >
              {truncateTag(tag)}
            </span>
          ))}
          {/* Show 2nd tag only on larger screens */}
          {tags[1] && (
            <span
              className="hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-secondary/50 text-foreground"
              title={String(tags[1])}
            >
              {truncateTag(tags[1])}
            </span>
          )}
          {remainingTagCount > 0 && (
            <span className="text-xs text-muted-foreground">+{remainingTagCount + (tags[1] ? 0 : 1)}</span>
          )}
          {/* Mobile: show +N if there's a hidden 2nd tag */}
          {tags[1] && remainingTagCount === 0 && (
            <span className="sm:hidden text-xs text-muted-foreground">+1</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
