'use client';

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Search, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { GlobalSearch } from './GlobalSearch';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search resources...',
}) => {
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to open global search (desktop only)
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        // Only enable on devices with viewport width >= 640px
        if (window.innerWidth >= 640) {
          e.preventDefault();
          setIsGlobalSearchOpen(true);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleClear = () => {
    onChange('');
  };

  return (
    <>
      <div className="relative w-full">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4 sm:w-5 sm:h-5" />
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-10 sm:pl-12 pr-10 sm:pr-20 h-10 sm:h-11 text-sm sm:text-base"
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
          {value && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-6 w-6 sm:h-5 sm:w-5 p-0 hover:bg-transparent touch-manipulation"
              aria-label="Clear search"
            >
              <X className="w-4 h-4 sm:w-3 sm:h-3" />
            </Button>
          )}
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 cursor-pointer hover:bg-muted/80"
            onClick={() => setIsGlobalSearchOpen(true)}
            role="button"
            tabIndex={0}
          >
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      </div>
      
      <GlobalSearch isOpen={isGlobalSearchOpen} onClose={() => setIsGlobalSearchOpen(false)} />
    </>
  );
};

