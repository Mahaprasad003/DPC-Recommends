'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { isAdmin } from '@/lib/utils/admin';
import { AdminPanel } from './AdminPanel';

/**
 * Wrapper component that only shows AdminPanel to admin users
 */
export function AdminPanelWrapper() {
  const { user, loading } = useAuth();

  // Don't show anything while loading or if not admin
  if (loading || !user || !isAdmin(user.email)) {
    return null;
  }

  return <AdminPanel />;
}
