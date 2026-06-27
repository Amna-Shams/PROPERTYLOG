export const formatPKR = (amount: number): string => {
  // Force Rs format with comma separators for thousands.
  const formatted = new Intl.NumberFormat('en-PK', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
  return `Rs ${formatted}`;
};
