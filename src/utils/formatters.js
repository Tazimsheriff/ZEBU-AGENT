export const formatINR = (value, options = {}) => {
  if (value === undefined || value === null || isNaN(value)) return '₹0.00';
  const { compact = false, showSign = false, decimals = 2 } = options;

  const num = Number(value);
  const sign = showSign && num > 0 ? '+' : '';

  if (compact) {
    const abs = Math.abs(num);
    if (abs >= 10000000) {
      return `${sign}₹${(num / 10000000).toFixed(decimals)} Cr`;
    }
    if (abs >= 100000) {
      return `${sign}₹${(num / 100000).toFixed(decimals)} L`;
    }
    if (abs >= 1000) {
      return `${sign}₹${(num / 1000).toFixed(decimals)} K`;
    }
  }

  // Standard Indian numbering (lakhs/crores format)
  return `${sign}₹${num.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
};

export const formatPercent = (value, showSign = true) => {
  if (value === undefined || value === null || isNaN(value)) return '0.00%';
  const num = Number(value);
  const sign = showSign && num > 0 ? '+' : '';
  return `${sign}${num.toFixed(2)}%`;
};

export const formatTime = (date = new Date()) => {
  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(new Date(date));
};
