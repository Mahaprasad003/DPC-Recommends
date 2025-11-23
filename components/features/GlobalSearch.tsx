'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useResources } from '@/lib/hooks/useResources';
import { useBookmarks } from '@/lib/hooks/useBookmarks';
import { Resource } from '@/types/database';

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
  scopeToBookmarks?: boolean;
}

export const GlobalSearch: React.FC<GlobalSearchProps> = ({ isOpen, onClose, scopeToBookmarks = false }) => {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const { data: resources = [], isLoading: resourcesLoading } = useResources();
  const { bookmarks, isLoading: bookmarksLoading } = useBookmarks();

  // Use bookmarks or all resources based on scope
  const isLoading = scopeToBookmarks ? bookmarksLoading : resourcesLoading;
  const searchableResources: Resource[] = scopeToBookmarks 
    ? bookmarks.map(b => b.resource).filter(Boolean) as Resource[]
    : resources;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
      // Focus search input when opened
      setTimeout(() => {
        const input = document.getElementById('global-search-input');
        input?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Reset selected index when search query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  // Filter resources based on search query
  const filteredResources = React.useMemo(() => {
    return searchQuery.trim()
      ? searchableResources.filter((resource: Resource) => {
          const query = searchQuery.toLowerCase();
          const topics = Array.isArray(resource.topics) ? resource.topics : [];
          const takeaways = Array.isArray(resource.key_takeaways) ? resource.key_takeaways : [];
          const categories = Array.isArray(resource.tag_categories) ? resource.tag_categories : [];
          const subcategories = Array.isArray(resource.tag_subcategories) ? resource.tag_subcategories : [];
          
          return (
            resource.title?.toLowerCase().includes(query) ||
            resource.author?.toLowerCase().includes(query) ||
            resource.source?.toLowerCase().includes(query) ||
            topics.some((topic: string) => topic.toLowerCase().includes(query)) ||
            takeaways.some((takeaway: string) => takeaway.toLowerCase().includes(query)) ||
            categories.some((cat: string) => cat.toLowerCase().includes(query)) ||
            subcategories.some((subcat: string) => subcat.toLowerCase().includes(query))
          );
        }).slice(0, 10) // Limit to 10 results
      : [];
  }, [searchQuery, searchableResources]);

  const handleResourceClick = useCallback((resource: Resource) => {
    if (resource.url) {
      window.open(resource.url, '_blank');
      onClose();
    }
  }, [onClose]);

  // Handle arrow keys and Enter
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || filteredResources.length === 0) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredResources.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredResources.length) % filteredResources.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredResources[selectedIndex]) {
          handleResourceClick(filteredResources[selectedIndex]);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredResources, handleResourceClick]);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && filteredResources.length > 0) {
      const selectedElement = document.querySelector(`[data-result-index="${selectedIndex}"]`);
      if (selectedElement) {
        selectedElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [selectedIndex, filteredResources.length]);

  if (!isOpen || !mounted) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm p-2 sm:p-4 pt-[5vh] sm:pt-[10vh] overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-background border border-border rounded-lg shadow-2xl w-full max-w-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="relative border-b border-border">
          <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
          <Input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={scopeToBookmarks ? "Search your bookmarks..." : "Search 300+ resources..."}
            className="pl-10 sm:pl-12 pr-10 sm:pr-12 border-0 focus-visible:ring-0 h-12 sm:h-14 text-sm sm:text-base bg-background"
            autoFocus
          />
          <button
            onClick={onClose}
            className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors touch-manipulation p-1"
            aria-label="Close"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] sm:max-h-[60vh] overflow-y-auto bg-background">
          {!searchQuery.trim() ? (
            <div className="p-4 sm:p-8 text-center bg-background">
              <Search className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-muted-foreground opacity-50" />
              <p className="text-sm sm:text-base text-muted-foreground mb-2">{scopeToBookmarks ? 'Start typing to search your bookmarks' : 'Start typing to search resources'}</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-4">
                <span className="hidden sm:inline">Try searching for:</span>
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {['Machine Learning', 'Python', 'Deep Learning'].map((term) => (
                    <button
                      key={term}
                      onClick={() => setSearchQuery(term)}
                      className="px-2 sm:px-3 py-1.5 sm:py-1 bg-primary/10 rounded text-primary hover:bg-primary/20 transition-colors touch-manipulation text-xs sm:text-sm"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : isLoading ? (
            <div className="p-6 sm:p-8 text-center text-muted-foreground bg-background text-sm sm:text-base">
              Searching...
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="p-6 sm:p-8 text-center bg-background">
              <p className="text-sm sm:text-base text-muted-foreground mb-2">
                No results found for &ldquo;{searchQuery}&rdquo;
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {scopeToBookmarks ? 'Try a different search term' : 'Try a different search term or browse all resources'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredResources.map((resource: Resource, index: number) => (
                <button
                  key={resource.id}
                  data-result-index={index}
                  onClick={() => handleResourceClick(resource)}
                  className={`w-full p-3 sm:p-4 transition-colors text-left group touch-manipulation ${
                    index === selectedIndex 
                      ? 'bg-accent border-l-2 border-l-primary' 
                      : 'bg-background hover:bg-accent active:bg-accent'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className={`text-sm sm:text-base font-semibold mb-1 transition-colors truncate ${
                        index === selectedIndex ? 'text-primary' : 'text-foreground group-hover:text-primary'
                      }`}>
                        {resource.title}
                      </h3>
                      {resource.author && (
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1.5 sm:mb-2">
                          by {resource.author}
                        </p>
                      )}
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {resource.topics && resource.topics.length > 0 && (
                          <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-primary/10 text-primary rounded-full">
                            {resource.topics[0]}
                          </span>
                        )}
                        {resource.difficulty && (
                          <span className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 bg-secondary text-secondary-foreground rounded-full">
                            {resource.difficulty}
                          </span>
                        )}
                      </div>
                    </div>
                    <ArrowRight className={`w-4 h-4 sm:w-5 sm:h-5 transition-all flex-shrink-0 ${
                      index === selectedIndex 
                        ? 'text-primary translate-x-1' 
                        : 'text-muted-foreground group-hover:text-primary group-hover:translate-x-1'
                    }`} />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer with shortcut hint */}
        <div className="border-t border-border p-2 sm:p-3 bg-muted/30">
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground">
            <div className="hidden sm:flex items-center gap-3 sm:gap-4">
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-background border border-border rounded text-[10px]">↑↓</kbd>
                <span className="text-[10px] sm:text-xs">to navigate</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-background border border-border rounded text-[10px]">↵</kbd>
                <span className="text-[10px] sm:text-xs">to open</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-background border border-border rounded text-[10px]">ESC</kbd>
                <span className="text-[10px] sm:text-xs">to close</span>
              </div>
            </div>
            <div className="sm:hidden text-xs text-muted-foreground">
              Tap to open resource
            </div>
            {searchQuery && (
              <span className="text-xs sm:text-sm">{filteredResources.length} results</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
