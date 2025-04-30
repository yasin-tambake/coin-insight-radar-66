
// Helper functions for formatting data
export const formatCurrency = (
  value: number,
  currency = 'usd',
  maximumFractionDigits = 2
): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    maximumFractionDigits,
  });
  
  return formatter.format(value);
};

export const formatPercentage = (value: number | undefined | null): string => {
  if (value === undefined || value === null) {
    return 'N/A';
  }
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};

export const formatCompactNumber = (value: number): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  });
  
  return formatter.format(value);
};
