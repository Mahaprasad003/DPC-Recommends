'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase/client';
import { Bookmark } from '@/types/database';
import { useState, useCallback, useEffect } from 'react';

interface BookmarkResponse {
  bookmarks: Bookmark[];
}

interface CreateBookmarkData {
  resource_id: string;
  notes?: string;
}

export function useBookmarks() {
  const queryClient = useQueryClient();
  // Track local bookmark state for instant UI updates
  const [localBookmarkIds, setLocalBookmarkIds] = useState<Set<string>>(new Set());
  const [initialized, setInitialized] = useState(false);

  const getAuthToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token;
  };

  // Check if user is authenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    const checkAuth = async () => {
      const token = await getAuthToken();
      setIsAuthenticated(!!token);
    };
    checkAuth();
    
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAuth();
    });
    
    return () => subscription.unsubscribe();
  }, []);

  // Fetch all bookmarks - auto-enabled when authenticated
  const { data: bookmarks = [], isLoading, error, refetch } = useQuery<Bookmark[]>({
    queryKey: ['bookmarks'],
    queryFn: async () => {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/bookmarks', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookmarks');
      }

      const data: BookmarkResponse = await response.json();
      return data.bookmarks;
    },
    enabled: isAuthenticated,
  });

  // Initialize local state from server data
  useEffect(() => {
    if (bookmarks.length > 0 || initialized) {
      const ids = new Set(bookmarks.map(b => b.resource_id));
      setLocalBookmarkIds(ids);
      setInitialized(true);
    }
  }, [bookmarks, initialized]);

  // Create bookmark mutation
  const createBookmark = useMutation({
    mutationFn: async (data: CreateBookmarkData) => {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create bookmark');
      }

      return response.json();
    },
    onSuccess: () => {
      // Refetch in background to sync with server
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });

  // Delete bookmark mutation
  const deleteBookmark = useMutation({
    mutationFn: async (resource_id: string) => {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(`/api/bookmarks?resource_id=${resource_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete bookmark');
      }

      return response.json();
    },
    onSuccess: () => {
      // Refetch in background to sync with server
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });

  // Helper function to check if a resource is bookmarked
  const isBookmarked = useCallback((resource_id: string) => {
    return localBookmarkIds.has(resource_id);
  }, [localBookmarkIds]);

  // Toggle bookmark with instant local update
  const toggleBookmark = async (resource_id: string) => {
    const currentlyBookmarked = isBookmarked(resource_id);
    
    // Update local state IMMEDIATELY for instant feedback
    setLocalBookmarkIds(prev => {
      const newSet = new Set(prev);
      if (currentlyBookmarked) {
        newSet.delete(resource_id);
      } else {
        newSet.add(resource_id);
      }
      return newSet;
    });

    try {
      // Then update server in background
      if (currentlyBookmarked) {
        await deleteBookmark.mutateAsync(resource_id);
        return { action: 'removed' as const };
      } else {
        await createBookmark.mutateAsync({ resource_id });
        return { action: 'added' as const };
      }
    } catch (error) {
      // Rollback local state on error
      setLocalBookmarkIds(prev => {
        const newSet = new Set(prev);
        if (currentlyBookmarked) {
          newSet.add(resource_id);
        } else {
          newSet.delete(resource_id);
        }
        return newSet;
      });
      throw error;
    }
  };

  return {
    bookmarks,
    isLoading,
    error,
    refetch,
    createBookmark: createBookmark.mutateAsync,
    deleteBookmark: deleteBookmark.mutateAsync,
    toggleBookmark,
    isBookmarked,
    isCreating: createBookmark.isPending,
    isDeleting: deleteBookmark.isPending,
  };
}
