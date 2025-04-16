import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NetWorthChart } from '@/components/NetWorthChart';
import { useFinancial } from '@/context/FinancialContext';
import { useCurrency } from '@/context/CurrencyContext';
import { describe, it, beforeEach, vi, expect } from 'vitest';
import * as React from 'react';

// Mock the context hooks
vi.mock('@/context/FinancialContext');
vi.mock('@/context/CurrencyContext');

// Mock Recharts components
vi.mock('recharts', () => {
  const OriginalModule = vi.importActual('recharts');
  
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
    AreaChart: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="area-chart">{children}</div>
    ),
    Area: ({ dataKey, name }: { dataKey: string; name: string }) => (
      <div data-testid="chart-area" data-key={dataKey} data-name={name}></div>
    ),
    XAxis: () => <div data-testid="x-axis"></div>,
    YAxis: () => <div data-testid="y-axis"></div>,
    CartesianGrid: () => <div data-testid="cartesian-grid"></div>,
    Tooltip: () => <div data-testid="tooltip"></div>,
    defs: ({ children }: { children: React.ReactNode }) => <div data-testid="defs">{children}</div>,
    linearGradient: ({ children, id }: { children: React.ReactNode, id: string }) => 
      <div data-testid="linear-gradient" data-id={id}>{children}</div>,
    stop: ({ stopColor, stopOpacity }: { stopColor: string, stopOpacity: string }) => 
      <div data-testid="gradient-stop" data-color={stopColor} data-opacity={stopOpacity}></div>,
  };
});

describe('NetWorthChart Component', () => {
  // Common test data
  const mockHistoricalData = [
    { date: '2023-01-01', netWorth: 100000 },
    { date: '2023-02-01', netWorth: 105000 },
    { date: '2023-03-01', netWorth: 108000 },
    { date: '2023-04-01', netWorth: 110000 },
    { date: '2023-05-01', netWorth: 112000 },
    { date: '2023-06-01', netWorth: 115000 },
    { date: '2023-07-01', netWorth: 120000 },
  ];
  
  // Setup before each test
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock Financial context
    (useFinancial as any).mockReturnValue({
      getHistoricalNetWorth: vi.fn().mockReturnValue(mockHistoricalData)
    });
    
    // Mock Currency context
    (useCurrency as any).mockReturnValue({
      currency: { code: 'USD', symbol: '$', name: 'US Dollar' },
      formatAmount: vi.fn((amount) => `$${amount.toLocaleString()}`)
    });
  });
  
  it('renders the chart with default "ALL" time period', () => {
    render(<NetWorthChart />);
    
    // Check that the time period dropdown shows "All Time"
    expect(screen.getByText('All Time')).toBeInTheDocument();
    
    // Check that chart components are rendered
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('area-chart')).toBeInTheDocument();
    expect(screen.getByTestId('chart-area')).toBeInTheDocument();
    
    // Check that the chart area has the correct properties
    const chartArea = screen.getByTestId('chart-area');
    expect(chartArea).toHaveAttribute('data-key', 'netWorth');
    expect(chartArea).toHaveAttribute('data-name', 'Net Worth');
    
    // Check that the net worth change is displayed (20% increase from 100000 to 120000)
    expect(screen.getByText('$20,000')).toBeInTheDocument();
    expect(screen.getByText('(+20.0%)')).toBeInTheDocument();
  });
  
  it('shows dropdown time period selector', () => {
    render(<NetWorthChart />);
    
    // Check that the time period selector exists and shows "All Time"
    const allTimeButton = screen.getByText('All Time');
    expect(allTimeButton).toBeInTheDocument();
    
    // Check if the dropdown has the chevron icon
    const chevronIcon = document.querySelector('.lucide-chevron-down');
    expect(chevronIcon).toBeInTheDocument();
  });
  
  it('displays the empty state when there is not enough data', () => {
    // Mock with less than 2 data points
    (useFinancial as any).mockReturnValue({
      getHistoricalNetWorth: vi.fn().mockReturnValue([
        { date: '2023-07-01', netWorth: 120000 }
      ])
    });
    
    render(<NetWorthChart />);
    
    // Should show empty state message
    expect(screen.getByText('Add at least two balance updates to see your net worth trend.')).toBeInTheDocument();
    expect(screen.getByText('Add Accounts')).toBeInTheDocument();
    
    // Chart components should not be present
    expect(screen.queryByTestId('area-chart')).not.toBeInTheDocument();
  });
  
  it('handles negative net worth trend correctly', () => {
    // Mock with decreasing net worth
    (useFinancial as any).mockReturnValue({
      getHistoricalNetWorth: vi.fn().mockReturnValue([
        { date: '2023-01-01', netWorth: 120000 },
        { date: '2023-07-01', netWorth: 100000 }
      ])
    });
    
    render(<NetWorthChart />);
    
    // Should show negative change
    expect(screen.getByText('$-20,000')).toBeInTheDocument();
    expect(screen.getByText('(-16.7%)')).toBeInTheDocument();
  });
}); 