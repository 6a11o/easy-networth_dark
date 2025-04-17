// User related types
export type User = {
  id: string;
  email: string;
};

// Category types
export type AssetCategory = 'bank' | 'stocks' | 'crypto' | 'investment' | 'realestate' | 'other';
export type LiabilityCategory = 'mortgage' | 'creditcard' | 'loan' | 'other';

// Financial account types
export type FinancialAccount = {
  id: string;
  name: string;
  balance: number;
  createdAt: string;
};

export type Asset = FinancialAccount & {
  category: AssetCategory;
};

export type Liability = FinancialAccount & {
  category: LiabilityCategory;
};

// Balance history
export type BalanceHistory = {
  id: string;
  date: string;
  accountId: string;
  balance: number;
};

// Category color mapping
export const assetCategoryColors: Record<AssetCategory, string> = {
  bank: '#3498db', // Blue
  stocks: '#2ecc71', // Green
  crypto: '#f1c40f', // Yellow
  investment: '#e67e22', // Orange
  realestate: '#9b59b6', // Purple
  other: '#95a5a6' // Gray
};

export const liabilityCategoryColors: Record<LiabilityCategory, string> = {
  mortgage: '#e74c3c', // Red
  creditcard: '#c0392b', // Darker Red
  loan: '#d35400', // Pumpkin
  other: '#7f8c8d' // Darker Gray
};

// Category labels for display
export const assetCategoryLabels: Record<AssetCategory, string> = {
  bank: 'Bank Accounts',
  stocks: 'Stocks',
  crypto: 'Crypto',
  investment: 'Investments',
  realestate: 'Real Estate',
  other: 'Other Assets'
};

export const liabilityCategoryLabels: Record<LiabilityCategory, string> = {
  mortgage: 'Mortgages',
  creditcard: 'Credit Cards',
  loan: 'Loans',
  other: 'Other Debts'
};

// Dashboard period type
export type TimePeriod = '1M' | '3M' | '6M' | '1Y' | 'ALL';
