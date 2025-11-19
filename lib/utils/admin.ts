/**
 * Admin utility functions
 */

/**
 * Check if a user is an admin based on their email
 * Admin email is configured via NEXT_PUBLIC_ADMIN_EMAIL environment variable
 */
export function isAdmin(userEmail: string | undefined | null): boolean {
  if (!userEmail) return false;
  
  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (!adminEmail) {
    console.warn('NEXT_PUBLIC_ADMIN_EMAIL not set - admin panel will not be available');
    return false;
  }
  
  return userEmail.toLowerCase() === adminEmail.toLowerCase();
}
