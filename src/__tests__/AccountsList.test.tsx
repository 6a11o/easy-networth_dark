import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AccountsList } from '@/components/AccountsList';
import { useFinancial } from '@/context/FinancialContext';
import { useCurrency } from '@/context/CurrencyContext';
import { describe, it, beforeEach, vi, expect } from 'vitest';
import { toast } from 'sonner';

// Mock the modules
vi.mock('@/context/FinancialContext');
vi.mock('@/context/CurrencyContext');
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('AccountsList Component', () => {
  // Common test data
  const mockAssets = [
    { id: 'asset1', name: 'Checking Account', balance: 5000, category: 'bank', createdAt: '2023-01-01' },
    { id: 'asset2', name: 'Stocks Portfolio', balance: 20000, category: 'stocks', createdAt: '2023-01-02' }
  ];
  
  const mockLiabilities = [
    { id: 'liability1', name: 'Credit Card', balance: 2000, category: 'creditcard', createdAt: '2023-01-03' },
    { id: 'liability2', name: 'Mortgage', balance: 150000, category: 'mortgage', createdAt: '2023-01-04' }
  ];
  
  // Mock functions
  const mockUpdateAsset = vi.fn();
  const mockUpdateLiability = vi.fn();
  const mockDeleteAsset = vi.fn();
  const mockDeleteLiability = vi.fn();
  const mockSetIsPremium = vi.fn();
  
  // Set up mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock Financial context
    (useFinancial as any).mockReturnValue({
      assets: mockAssets,
      liabilities: mockLiabilities,
      updateAsset: mockUpdateAsset,
      updateLiability: mockUpdateLiability,
      deleteAsset: mockDeleteAsset,
      deleteLiability: mockDeleteLiability,
      isPremium: false,
      setIsPremium: mockSetIsPremium
    });
    
    // Mock Currency context
    (useCurrency as any).mockReturnValue({
      formatAmount: vi.fn((amount) => `$${amount.toLocaleString()}`)
    });
  });
  
  it('renders the asset list correctly', () => {
    render(<AccountsList type="assets" />);
    
    // Check that both assets are rendered
    expect(screen.getByText('Checking Account')).toBeInTheDocument();
    expect(screen.getByText('Stocks Portfolio')).toBeInTheDocument();
    
    // Check that amounts are formatted
    expect(screen.getByText('$5,000')).toBeInTheDocument();
    expect(screen.getByText('$20,000')).toBeInTheDocument();
  });
  
  it('renders the liabilities list correctly', () => {
    render(<AccountsList type="liabilities" />);
    
    // Check that both liabilities are rendered
    expect(screen.getByText('Credit Card')).toBeInTheDocument();
    expect(screen.getByText('Mortgage')).toBeInTheDocument();
    
    // Check that amounts are formatted
    expect(screen.getByText('$2,000')).toBeInTheDocument();
    expect(screen.getByText('$150,000')).toBeInTheDocument();
  });
  
  it('renders empty state for assets when there are no assets', () => {
    // Override the default mock to return empty assets
    (useFinancial as any).mockReturnValue({
      assets: [],
      liabilities: mockLiabilities,
      updateAsset: mockUpdateAsset,
      updateLiability: mockUpdateLiability,
      deleteAsset: mockDeleteAsset,
      deleteLiability: mockDeleteLiability,
      isPremium: false,
      setIsPremium: mockSetIsPremium
    });
    
    render(<AccountsList type="assets" />);
    
    // Check for empty state message
    expect(screen.getByText('No assets added yet.')).toBeInTheDocument();
    expect(screen.getByText('Add assets to track your net worth.')).toBeInTheDocument();
    expect(screen.getByText('Add Asset')).toBeInTheDocument();
  });
  
  it('renders empty state for liabilities when there are no liabilities', () => {
    // Override the default mock to return empty liabilities
    (useFinancial as any).mockReturnValue({
      assets: mockAssets,
      liabilities: [],
      updateAsset: mockUpdateAsset,
      updateLiability: mockUpdateLiability,
      deleteAsset: mockDeleteAsset,
      deleteLiability: mockDeleteLiability,
      isPremium: false,
      setIsPremium: mockSetIsPremium
    });
    
    render(<AccountsList type="liabilities" />);
    
    // Check for empty state message
    expect(screen.getByText('No liabilities added yet.')).toBeInTheDocument();
    expect(screen.getByText('Add liabilities to track your net worth.')).toBeInTheDocument();
    expect(screen.getByText('Add Liability')).toBeInTheDocument();
  });
  
  it('shows premium limitation warning when approaching the asset limit', () => {
    // Mock with 2 assets (approaching limit of 3)
    (useFinancial as any).mockReturnValue({
      assets: mockAssets, // has 2 assets
      liabilities: mockLiabilities,
      updateAsset: mockUpdateAsset,
      updateLiability: mockUpdateLiability,
      deleteAsset: mockDeleteAsset,
      deleteLiability: mockDeleteLiability,
      isPremium: false,
      setIsPremium: mockSetIsPremium
    });
    
    render(<AccountsList type="assets" />);
    
    // Check for warning message
    expect(screen.getByText('Free Trial Limit Approaching')).toBeInTheDocument();
    expect(screen.getByText('Free trial is limited to 3 asset accounts. You\'re approaching this limit.')).toBeInTheDocument();
  });
  
  it('allows upgrading to premium when clicking upgrade button', () => {
    render(<AccountsList type="assets" />);
    
    // Check for upgrade button and click it
    const upgradeButton = screen.getByText('Upgrade to Pro');
    fireEvent.click(upgradeButton);
    
    // Verify setIsPremium was called
    expect(mockSetIsPremium).toHaveBeenCalledWith(true);
    
    // Verify success toast was shown
    expect(toast.success).toHaveBeenCalledWith('Upgraded to Pro successfully');
  });
}); 