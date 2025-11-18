'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 60 * 12, // 12 hours - data considered fresh for 12 hours
            gcTime: 1000 * 60 * 60 * 24, // 24 hours - cache kept for 24 hours
            refetchOnWindowFocus: false,
            refetchOnMount: false, // Don't refetch when component remounts
            refetchOnReconnect: false, // Don't refetch on reconnect
          },
        },
      })
  );

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}

