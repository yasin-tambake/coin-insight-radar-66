
/**
 * Format a number as currency
 */
export const formatCurrency = (
  value: number | undefined | null,
  currency = 'usd',
  decimals = 2
): string => {
  if (value === undefined || value === null) return 'N/A';
  
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${value.toFixed(decimals)}`;
  }
};

/**
 * Format a number as percentage
 */
export const formatPercentage = (
  value: number | undefined | null
): string => {
  if (value === undefined || value === null) return 'N/A';
  
  try {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  } catch (error) {
    console.error('Error formatting percentage:', error);
    return 'N/A';
  }
};
