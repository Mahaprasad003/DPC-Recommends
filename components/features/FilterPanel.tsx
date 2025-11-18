'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { FilterOptions } from '@/types/database';
import { X, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

interface FilterPanelProps {
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  availableOptions: {
    topics: string[];
    tagCategories: string[];
    tagSubcategories: string[];
    difficulties: string[];
    content_types: string[];
  };
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  filters,
  onFiltersChange,
  availableOptions,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: keyof FilterOptions, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const clearFilter = (key: keyof FilterOptions) => {
    const defaultValues: FilterOptions = {
      topics: [],
      tagCategories: [],
      tagSubcategories: [],
      difficulty: [],
      content_type: [],
    };
    updateFilter(key, defaultValues[key]);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      topics: [],
      tagCategories: [],
      tagSubcategories: [],
      difficulty: [],
      content_type: [],
    });
  };

  const activeFiltersCount =
    filters.topics.length +
    filters.tagCategories.length +
    filters.tagSubcategories.length +
    filters.difficulty.length +
    filters.content_type.length;

  const toggleTopic = (topic: string) => {
    const newTopics = filters.topics.includes(topic)
      ? filters.topics.filter((t) => t !== topic)
      : [...filters.topics, topic];
    updateFilter('topics', newTopics);
  };

  const toggleTagCategory = (category: string) => {
    const newCategories = filters.tagCategories.includes(category)
      ? filters.tagCategories.filter((c) => c !== category)
      : [...filters.tagCategories, category];
    updateFilter('tagCategories', newCategories);
  };

  const toggleTagSubcategory = (subcategory: string) => {
    const newSubcategories = filters.tagSubcategories.includes(subcategory)
      ? filters.tagSubcategories.filter((s) => s !== subcategory)
      : [...filters.tagSubcategories, subcategory];
    updateFilter('tagSubcategories', newSubcategories);
  };

  const toggleDifficulty = (difficulty: string) => {
    const newDifficulties = filters.difficulty.includes(difficulty)
      ? filters.difficulty.filter((d) => d !== difficulty)
      : [...filters.difficulty, difficulty];
    updateFilter('difficulty', newDifficulties);
  };

  const toggleContentType = (contentType: string) => {
    const newContentTypes = filters.content_type.includes(contentType)
      ? filters.content_type.filter((c) => c !== contentType)
      : [...filters.content_type, contentType];
    updateFilter('content_type', newContentTypes);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 flex-1 sm:flex-initial"
        >
          <Filter className="w-4 h-4" />
          <span className="text-sm sm:text-base">Filters</span>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
        {activeFiltersCount > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-xs sm:text-sm whitespace-nowrap">
            Clear all
          </Button>
        )}
      </div>

      {isOpen && (
        <Card>
          <CardHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-3">
            <h3 className="text-base sm:text-lg font-semibold">Filter Resources</h3>
          </CardHeader>
          <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-4 sm:pb-6">
            {/* Difficulty Filter */}
            {availableOptions.difficulties.length > 0 && (
              <div>
                <label className="text-xs sm:text-sm font-medium mb-2 block">Difficulty</label>
                <div className="flex flex-wrap gap-2">
                  {availableOptions.difficulties.map((difficulty) => (
                    <Button
                      key={difficulty}
                      variant={filters.difficulty.includes(difficulty) ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => toggleDifficulty(difficulty)}
                      className="text-xs sm:text-sm"
                    >
                      {difficulty}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Tag Categories Filter */}
            {availableOptions.tagCategories.length > 0 && (
              <div>
                <label className="text-xs sm:text-sm font-medium mb-2 block">Tag Categories</label>
                <div className="flex flex-wrap gap-2">
                  {availableOptions.tagCategories.map((category) => (
                    <Button
                      key={category}
                      variant={filters.tagCategories.includes(category) ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => toggleTagCategory(category)}
                      className="text-xs sm:text-sm"
                    >
                      {category}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Tag Subcategories Filter */}
            {availableOptions.tagSubcategories.length > 0 && (
              <div>
                <label className="text-xs sm:text-sm font-medium mb-2 block">Tag Subcategories</label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {availableOptions.tagSubcategories.map((subcategory) => (
                    <Button
                      key={subcategory}
                      variant={filters.tagSubcategories.includes(subcategory) ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => toggleTagSubcategory(subcategory)}
                      className="text-xs sm:text-sm"
                    >
                      {subcategory}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Topics Filter - Labelled as Topics_Detailed */}
            {availableOptions.topics.length > 0 && (
              <div>
                <label className="text-xs sm:text-sm font-medium mb-2 block">Topics_Detailed</label>
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {availableOptions.topics.map((topic) => (
                    <Button
                      key={topic}
                      variant={filters.topics.includes(topic) ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => toggleTopic(topic)}
                      className="text-xs sm:text-sm"
                    >
                      {topic}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Content Type Filter */}
            {availableOptions.content_types.length > 0 && (
              <div>
                <label className="text-xs sm:text-sm font-medium mb-2 block">Content Type</label>
                <div className="flex flex-wrap gap-2">
                  {availableOptions.content_types.map((contentType) => (
                    <Button
                      key={contentType}
                      variant={filters.content_type.includes(contentType) ? 'primary' : 'outline'}
                      size="sm"
                      onClick={() => toggleContentType(contentType)}
                      className="text-xs sm:text-sm"
                    >
                      {contentType}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Active Filters */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {filters.tagCategories.map((category) => (
            <Badge key={category} variant="secondary" className="flex items-center gap-1 text-xs sm:text-sm">
              <span className="hidden sm:inline">Category: </span>
              <span className="sm:hidden">Cat: </span>
              {category}
              <button
                onClick={() =>
                  updateFilter('tagCategories', filters.tagCategories.filter((c) => c !== category))
                }
                className="ml-1 hover:opacity-70"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {filters.tagSubcategories.map((subcategory) => (
            <Badge key={subcategory} variant="secondary" className="flex items-center gap-1 text-xs sm:text-sm">
              <span className="hidden sm:inline">Subcategory: </span>
              <span className="sm:hidden">Sub: </span>
              {subcategory}
              <button
                onClick={() =>
                  updateFilter(
                    'tagSubcategories',
                    filters.tagSubcategories.filter((s) => s !== subcategory)
                  )
                }
                className="ml-1 hover:opacity-70"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {filters.topics.map((topic) => (
            <Badge key={topic} variant="secondary" className="flex items-center gap-1 text-xs sm:text-sm">
              <span className="hidden sm:inline">Topics_Detailed: </span>
              <span className="sm:hidden">Topic: </span>
              {topic}
              <button
                onClick={() => updateFilter('topics', filters.topics.filter((t) => t !== topic))}
                className="ml-1 hover:opacity-70"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {filters.difficulty.map((diff) => (
            <Badge key={diff} variant="secondary" className="flex items-center gap-1 text-xs sm:text-sm">
              <span className="hidden sm:inline">Difficulty: </span>
              <span className="sm:hidden">Diff: </span>
              {diff}
              <button
                onClick={() =>
                  updateFilter('difficulty', filters.difficulty.filter((d) => d !== diff))
                }
                className="ml-1 hover:opacity-70"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
          {filters.content_type.map((contentType) => (
            <Badge key={contentType} variant="secondary" className="flex items-center gap-1 text-xs sm:text-sm">
              <span className="hidden sm:inline">Content Type: </span>
              <span className="sm:hidden">Type: </span>
              {contentType}
              <button
                onClick={() =>
                  updateFilter('content_type', filters.content_type.filter((c) => c !== contentType))
                }
                className="ml-1 hover:opacity-70"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

