import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NetWorthSummary } from '@/components/NetWorthSummary';
import { useFinancial } from '@/context/FinancialContext';
import { useCurrency } from '@/context/CurrencyContext';
import { describe, it, beforeEach, vi, expect } from 'vitest';

// Mock the contexts
vi.mock('@/context/FinancialContext');
vi.mock('@/context/CurrencyContext');

describe('NetWorthSummary Component', () => {
  // Set up mock return values
  beforeEach(() => {
    // Mock the Financial context
    (useFinancial as any).mockReturnValue({
      getNetWorth: vi.fn().mockReturnValue(100000),
      getTotalAssets: vi.fn().mockReturnValue(150000),
      getTotalLiabilities: vi.fn().mockReturnValue(50000),
      getHistoricalNetWorth: vi.fn().mockReturnValue([
        { date: '2023-01-01', netWorth: 90000 },
        { date: '2023-02-01', netWorth: 100000 }
      ])
    });

    // Mock the Currency context
    (useCurrency as any).mockReturnValue({
      currency: { code: 'USD', symbol: '$', name: 'US Dollar' },
      formatAmount: vi.fn((amount) => `$${amount.toLocaleString()}`)
    });
  });

  it('renders the component with correct financial data', () => {
    render(<NetWorthSummary />);
    
    // Check that assets are displayed
    expect(screen.getByText('Assets')).toBeInTheDocument();
    expect(screen.getByText('$150,000')).toBeInTheDocument();
    
    // Check that liabilities are displayed
    expect(screen.getByText('Liabilities')).toBeInTheDocument();
    expect(screen.getByText('$50,000')).toBeInTheDocument();
    
    // Check that growth rate is displayed
    expect(screen.getByText('Growth Rate')).toBeInTheDocument();
    expect(screen.getByText('+11.1%')).toBeInTheDocument();
  });

  it('handles zero previous net worth correctly', () => {
    // Update mock to return zero for previous net worth
    (useFinancial as any).mockReturnValue({
      getNetWorth: vi.fn().mockReturnValue(10000),
      getTotalAssets: vi.fn().mockReturnValue(20000),
      getTotalLiabilities: vi.fn().mockReturnValue(10000),
      getHistoricalNetWorth: vi.fn().mockReturnValue([
        { date: '2023-01-01', netWorth: 0 },
        { date: '2023-02-01', netWorth: 10000 }
      ])
    });

    render(<NetWorthSummary />);
    
    // Should show N/A for growth rate since previous value was zero
    expect(screen.getByText('N/A')).toBeInTheDocument();
  });

  it('displays correct percentage allocation for assets and liabilities', () => {
    render(<NetWorthSummary />);
    
    // Get the progress bars
    const progressBars = document.querySelectorAll('.h-1.bg-gradient-to-r');
    
    // Asset bar should be 75% of total (assets are 75% of total assets + liabilities)
    expect(progressBars[0]).toHaveStyle('width: 75%');
    
    // Liability bar should be 25% of total (liabilities are 25% of total assets + liabilities)
    expect(progressBars[1]).toHaveStyle('width: 25%');
  });
}); 