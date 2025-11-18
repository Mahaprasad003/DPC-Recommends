import { format, parseISO } from 'date-fns';

/**
 * Format date to readable string
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return '';
  
  try {
    const date = parseISO(dateString);
    return format(date, 'MMM d, yyyy');
  } catch {
    return dateString;
  }
}

/**
 * Format rating to display
 */
export function formatRating(rating: number | null | undefined): string {
  if (rating === null || rating === undefined) return 'N/A';
  return rating.toFixed(1);
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, length: number): string {
  if (!text || text.length <= length) return text;
  return text.slice(0, length) + '...';
}

/**
 * Capitalize first letter
 */
export function capitalize(str: string): string {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

