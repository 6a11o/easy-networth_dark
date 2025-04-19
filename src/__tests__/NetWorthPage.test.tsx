import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import NetWorthPage from '../pages/NetWorthPage';
import { FinancialProvider } from '../context/FinancialContext';
import { CurrencyProvider } from '../context/CurrencyContext';
import { ReactNode } from 'react';

const mockFinancialHook = {
  getHistoricalNetWorth: () => [
    { date: '2024-03-01', netWorth: 100000 },
    { date: '2024-03-15', netWorth: 120000 },
  ],
  getHistoricalDates: () => ['2024-03-01', '2024-03-15'],
  isPremium: false,
  setIsPremium: vi.fn(),
  assets: [],
  liabilities: [],
  balanceHistory: [],
  addAsset: vi.fn(),
  updateAsset: vi.fn(),
  deleteAsset: vi.fn(),
  addLiability: vi.fn(),
  updateLiability: vi.fn(),
  deleteLiability: vi.fn(),
  updateBalances: vi.fn(),
  getTotalAssets: () => 0,
  getTotalLiabilities: () => 0,
  getNetWorth: () => 0,
};

const useFinancialMock = vi.fn(() => mockFinancialHook);

// Mock the useFinancial hook
vi.mock('../context/FinancialContext', () => ({
  useFinancial: () => useFinancialMock(),
  FinancialProvider: ({ children }: { children: ReactNode }) => children,
}));

// Mock the useCurrency hook
vi.mock('../context/CurrencyContext', () => ({
  useCurrency: () => ({
    formatAmount: (amount: number) => `$${amount.toLocaleString()}`,
    currency: 'USD',
    setCurrency: vi.fn(),
  }),
  CurrencyProvider: ({ children }: { children: ReactNode }) => children,
}));

// Wrapper component for providing context
const Wrapper = ({ children }: { children: ReactNode }) => (
  <BrowserRouter>
    <CurrencyProvider>
      <FinancialProvider>
        {children}
      </FinancialProvider>
    </CurrencyProvider>
  </BrowserRouter>
);

describe('NetWorthPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useFinancialMock.mockReturnValue(mockFinancialHook);
  });

  it('renders the page title', () => {
    render(<NetWorthPage />, { wrapper: Wrapper });
    expect(screen.getByText('Net Worth Analysis')).toBeInTheDocument();
  });

  it('displays historical data when available', () => {
    render(<NetWorthPage />, { wrapper: Wrapper });
    expect(screen.getByText('Historical Data')).toBeInTheDocument();
    expect(screen.getByText('Net Worth History')).toBeInTheDocument();
  });

  it('shows premium upgrade card for non-premium users with 3+ data points', () => {
    const extendedMock = {
      ...mockFinancialHook,
      getHistoricalDates: () => ['2024-03-01', '2024-03-15', '2024-03-30'],
    };

    useFinancialMock.mockReturnValueOnce(extendedMock);

    render(<NetWorthPage />, { wrapper: Wrapper });

    expect(screen.getByText('Pro Feature Locked')).toBeInTheDocument();
    expect(screen.getByText(/Upgrade to Pro/)).toBeInTheDocument();
  });

  it('calculates and displays changes correctly', () => {
    render(<NetWorthPage />, { wrapper: Wrapper });
    
    // First row should show dashes for change
    expect(screen.getAllByText('—')).toHaveLength(2);
    
    // Second row should show the actual change
    expect(screen.getByText('$20,000')).toBeInTheDocument();
    expect(screen.getByText('20.0%')).toBeInTheDocument();
  });

  it('shows empty state message when no data is available', () => {
    const emptyMock = {
      ...mockFinancialHook,
      getHistoricalNetWorth: () => [],
      getHistoricalDates: () => [],
    };

    useFinancialMock.mockReturnValueOnce(emptyMock);

    render(<NetWorthPage />, { wrapper: Wrapper });

    expect(screen.getByText('No data available yet. Add assets or liabilities to see your net worth history.')).toBeInTheDocument();
  });
}); 