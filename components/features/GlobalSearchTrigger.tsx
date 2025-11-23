'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import { usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import { GlobalSearch } from './GlobalSearch';

// Create context to share state across multiple instances
const SearchContext = createContext<{
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
} | null>(null);

let keyboardListenerAttached = false;

export const GlobalSearchTrigger: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isBookmarksPage = pathname === '/bookmarks';

  useEffect(() => {
    // Prevent multiple keyboard listeners
    if (keyboardListenerAttached) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to toggle search
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      // ESC to close
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    keyboardListenerAttached = true;

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      keyboardListenerAttached = false;
    };
  }, []);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground border rounded-lg hover:bg-accent transition-colors w-full max-w-xs"
      >
        <Search className="h-4 w-4 flex-shrink-0" />
        <span className="flex-1 text-left">Search resources...</span>
        <kbd className="hidden lg:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      {/* Mobile trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Search"
      >
        <Search className="h-5 w-5" />
      </button>

      {/* Only render one instance of the modal */}
      {isOpen && <GlobalSearch isOpen={isOpen} onClose={() => setIsOpen(false)} scopeToBookmarks={isBookmarksPage} />}
    </>
  );
};
