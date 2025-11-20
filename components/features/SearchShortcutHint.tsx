'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';

export function SearchShortcutHint() {
  const [show, setShow] = useState(false);
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    // Only show for authenticated users
    if (!isAuthenticated || loading) return;

    // Check if user has seen the hint before
    const hasSeenHint = localStorage.getItem('hasSeenSearchHint');
    
    if (!hasSeenHint) {
      // Show hint after 2 seconds
      const timer = setTimeout(() => {
        setShow(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, loading]);

  const handleDismiss = () => {
    setShow(false);
    localStorage.setItem('hasSeenSearchHint', 'true');
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm animate-in slide-in-from-bottom-5">
      <div className="bg-primary text-primary-foreground rounded-lg shadow-lg p-4 relative">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-primary-foreground/80 hover:text-primary-foreground"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="pr-6">
          <p className="font-semibold mb-1">💡 Pro Tip</p>
          <p className="text-sm">
            Press{' '}
            <kbd className="px-2 py-1 bg-primary-foreground/20 rounded text-xs font-mono">
              ⌘K
            </kbd>
            {' '}or{' '}
            <kbd className="px-2 py-1 bg-primary-foreground/20 rounded text-xs font-mono">
              Ctrl+K
            </kbd>
            {' '}to quickly search 300+ resources from anywhere!
          </p>
        </div>
      </div>
    </div>
  );
}
