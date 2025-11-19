'use server';

import { revalidateTag } from 'next/cache';

/**
 * Server action to refresh cache
 * Note: Authorization is checked on the client side before calling this action
 */
export async function refreshCache() {
  try {
    // Revalidate all cache tags
    revalidateTag('resources');
    revalidateTag('resource-options');
    revalidateTag('sneak-peek-content');

    return { 
      success: true, 
      message: 'Cache refreshed successfully',
      timestamp: new Date().toISOString()
    };
  } catch (error: any) {
    console.error('Error refreshing cache:', error);
    return { 
      success: false, 
      error: 'Failed to refresh cache: ' + error.message 
    };
  }
}
