/**
 * Calculate days until expiry date
 * Uses date-only comparison to avoid timezone issues
 */
export const getDaysUntilExpiry = (expiryDate: string): number => {
  // Create dates at midnight to avoid time-of-day issues
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
};

/**
 * Get status based on expiry date
 */
export const getExpiryStatus = (expiryDate: string): 'expired' | 'expiring' | 'available' => {
  const days = getDaysUntilExpiry(expiryDate);
  
  if (days < 0) return 'expired';
  if (days <= 7) return 'expiring';
  return 'available';
};

/**
 * Format date for display
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};
