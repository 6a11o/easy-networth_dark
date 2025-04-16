// User related types
export type User = {
  id: string;
  email: string;
  token?: string; // Authentication token
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
  bank: 'rgb(180, 240, 240)',
  stocks: 'rgb(180, 240, 200)',
  crypto: 'rgb(220, 200, 240)',
  investment: 'rgb(240, 220, 180)',
  realestate: 'rgb(240, 200, 180)',
  other: 'rgb(220, 220, 220)'
};

export const liabilityCategoryColors: Record<LiabilityCategory, string> = {
  mortgage: 'rgb(240, 180, 180)',
  creditcard: 'rgb(240, 180, 220)',
  loan: 'rgb(220, 180, 240)',
  other: 'rgb(180, 220, 240)'
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
