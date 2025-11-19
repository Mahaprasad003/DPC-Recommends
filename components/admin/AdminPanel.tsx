'use client';

import { useState } from 'react';
import { RefreshCw, Shield } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { refreshCache } from '@/app/actions/cache';
import { useQueryClient } from '@tanstack/react-query';

export function AdminPanel() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const queryClient = useQueryClient();

  const handleRefreshCache = async () => {
    setLoading(true);
    setMessage(null);

    try {
      // Refresh server-side cache
      const result = await refreshCache();

      if (result.success) {
        // Also invalidate React Query cache on the client
        await queryClient.invalidateQueries({ queryKey: ['resources'] });
        await queryClient.invalidateQueries({ queryKey: ['resource-options'] });
        await queryClient.invalidateQueries({ queryKey: ['sneak-peek-content'] });
        
        setMessage({ type: 'success', text: result.message || 'Cache refreshed' });
      } else {
        setMessage({ type: 'error', text: result.error || 'Failed to refresh cache' });
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-background border border-border rounded-lg shadow-lg p-4 space-y-3 min-w-[280px]">
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-border pb-2">
          <Shield className="w-4 h-4 text-primary" />
          <h3 className="font-semibold text-sm">Admin Panel</h3>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <Button
            onClick={handleRefreshCache}
            disabled={loading}
            variant="outline"
            size="sm"
            className="w-full justify-start"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh Cache'}
          </Button>
        </div>

        {/* Status Message */}
        {message && (
          <div
            className={`text-xs p-2 rounded ${
              message.type === 'success'
                ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300'
                : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300'
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}
