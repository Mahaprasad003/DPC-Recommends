'use client';

import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Tag } from '@/components/ui/Tag';
import { Resource } from '@/types/database';
import { capitalize } from '@/lib/utils/format';
import { ExternalLink, Building2 } from 'lucide-react';

interface ResourceCardProps {
  resource: Resource;
  searchQuery?: string;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource, searchQuery }) => {
  const handleCardClick = () => {
    if (resource.url) {
      const url = ensureProtocol(resource.url);
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

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
      className="h-full cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02] group"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3 px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="flex items-start justify-between gap-2">
          <h3 
            className="text-base sm:text-lg font-semibold line-clamp-2 group-hover:text-primary transition-colors flex-1 min-w-0"
            title={resource.title}
          >
            {searchQuery ? highlightText(resource.title, searchQuery) : resource.title}
          </h3>
          <ExternalLink className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3 px-4 sm:px-6 pb-4 sm:pb-6">
        {/* URL */}
        {resource.url && (
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <a 
              href={ensureProtocol(resource.url)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline truncate min-w-0"
              onClick={(e) => e.stopPropagation()}
            >
              {resource.url}
            </a>
          </div>
        )}

        {/* Source */}
        {resource.source && (
          <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
            <Building2 className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
            <span className="truncate">{resource.source}</span>
          </div>
        )}

        {/* Difficulty */}
        {resource.difficulty && (
          <div>
            <Badge variant={getDifficultyColor(resource.difficulty) as any} className="text-xs sm:text-sm">
              {capitalize(resource.difficulty)}
            </Badge>
          </div>
        )}

        {/* Topics */}
        {resource.topics && 
         Array.isArray(resource.topics) && 
         resource.topics.length > 0 && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {resource.topics.slice(0, 5).map((topic, index) => (
              <Tag key={index} variant="topic" className="text-xs sm:text-sm">
                {String(topic)}
              </Tag>
            ))}
            {resource.topics.length > 5 && (
              <Tag variant="topic" className="text-xs sm:text-sm">+{resource.topics.length - 5} more</Tag>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

