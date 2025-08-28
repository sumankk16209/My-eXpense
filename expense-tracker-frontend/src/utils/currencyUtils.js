/**
 * Currency utilities for Indian Rupee (INR) formatting
 */

/**
 * Format amount as Indian Rupee
 * @param {number} amount - The amount to format
 * @param {boolean} showSymbol - Whether to show the ₹ symbol (default: true)
 * @returns {string} Formatted currency string
 */
export const formatINR = (amount, showSymbol = true) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return showSymbol ? '₹0.00' : '0.00';
  }

  return new Intl.NumberFormat('en-IN', {
    style: showSymbol ? 'currency' : 'decimal',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

/**
 * Format amount as Indian Rupee without symbol
 * @param {number} amount - The amount to format
 * @returns {string} Formatted amount without ₹ symbol
 */
export const formatAmount = (amount) => {
  return formatINR(amount, false);
};

/**
 * Parse Indian currency string to number
 * @param {string} currencyString - Currency string to parse
 * @returns {number} Parsed number or 0 if invalid
 */
export const parseINR = (currencyString) => {
  if (!currencyString) return 0;
  
  // Remove ₹ symbol and commas, then parse
  const cleanString = currencyString.replace(/[₹,\s]/g, '');
  const parsed = parseFloat(cleanString);
  
  return isNaN(parsed) ? 0 : parsed;
};

/**
 * Validate amount for Indian currency
 * @param {number} amount - Amount to validate
 * @returns {object} Validation result with isValid and message
 */
export const validateINRAmount = (amount) => {
  if (amount <= 0) {
    return {
      isValid: false,
      message: 'Amount must be greater than ₹0'
    };
  }

  if (amount > 999999999.99) {
    return {
      isValid: false,
      message: 'Amount cannot exceed ₹99,99,99,999.99'
    };
  }

  return {
    isValid: true,
    message: ''
  };
};

/**
 * Get Indian number system formatting (lakhs, crores)
 * @param {number} amount - Amount to format
 * @returns {string} Human readable format
 */
export const formatINRReadable = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0';
  }

  if (amount < 1000) {
    return formatINR(amount);
  } else if (amount < 100000) {
    const thousands = Math.floor(amount / 1000);
    const remainder = amount % 1000;
    if (remainder === 0) {
      return `₹${thousands}K`;
    } else {
      return `₹${thousands}K ${formatINR(remainder)}`;
    }
  } else if (amount < 10000000) {
    const lakhs = Math.floor(amount / 100000);
    const remainder = amount % 100000;
    if (remainder === 0) {
      return `₹${lakhs}L`;
    } else {
      return `₹${lakhs}L ${formatINR(remainder)}`;
    }
  } else {
    const crores = Math.floor(amount / 10000000);
    const remainder = amount % 10000000;
    if (remainder === 0) {
      return `₹${crores}C`;
    } else {
      return `₹${crores}C ${formatINR(remainder)}`;
    }
  }
};

/**
 * Format amount for display in summary cards
 * @param {number} amount - Amount to format
 * @returns {string} Formatted amount for summary display
 */
export const formatSummaryAmount = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0.00';
  }

  // For summary cards, use readable format for large amounts
  if (amount >= 100000) {
    return formatINRReadable(amount);
  }

  return formatINR(amount);
};
