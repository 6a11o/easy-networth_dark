import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { FinancialProvider, useFinancial } from '../context/FinancialContext';
import { ReactNode } from 'react';
import { AssetCategory, LiabilityCategory } from '../types';

// Mock the Auth context
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    isAuthenticated: false
  })
}));

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    store,
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

// Test component to access and display financial context
const TestComponent = () => {
  const { 
    assets, 
    liabilities, 
    addAsset, 
    addLiability, 
    updateAsset, 
    updateLiability, 
    deleteAsset, 
    deleteLiability,
    getTotalAssets,
    getTotalLiabilities,
    getNetWorth,
    isPremium, 
    setIsPremium 
  } = useFinancial();

  return (
    <div>
      <div data-testid="assets-count">{assets.length}</div>
      <div data-testid="liabilities-count">{liabilities.length}</div>
      <div data-testid="total-assets">{getTotalAssets()}</div>
      <div data-testid="total-liabilities">{getTotalLiabilities()}</div>
      <div data-testid="net-worth">{getNetWorth()}</div>
      <div data-testid="premium-status">{isPremium ? 'premium' : 'free'}</div>
      
      <button onClick={() => addAsset('Test Asset', 1000, 'bank')}>Add Asset</button>
      <button onClick={() => addLiability('Test Liability', 500, 'creditcard')}>Add Liability</button>
      
      {assets.map(asset => (
        <div key={asset.id} data-testid={`asset-${asset.id}`}>
          <span>{asset.name}: ${asset.balance}</span>
          <button onClick={() => updateAsset(asset.id, { balance: asset.balance + 100 })}>
            Update
          </button>
          <button onClick={() => deleteAsset(asset.id)}>Delete</button>
        </div>
      ))}
      
      {liabilities.map(liability => (
        <div key={liability.id} data-testid={`liability-${liability.id}`}>
          <span>{liability.name}: ${liability.balance}</span>
          <button onClick={() => updateLiability(liability.id, { balance: liability.balance + 100 })}>
            Update
          </button>
          <button onClick={() => deleteLiability(liability.id)}>Delete</button>
        </div>
      ))}
      
      <button onClick={() => setIsPremium(true)}>Upgrade</button>
    </div>
  );
};

const renderWithFinancialProvider = (component: ReactNode) => {
  return render(
    <FinancialProvider>
      {component}
    </FinancialProvider>
  );
};

describe('FinancialContext', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockLocalStorage.clear();
  });

  it('should initialize with empty financial data', () => {
    renderWithFinancialProvider(<TestComponent />);
    
    expect(screen.getByTestId('assets-count').textContent).toBe('0');
    expect(screen.getByTestId('liabilities-count').textContent).toBe('0');
    expect(screen.getByTestId('premium-status').textContent).toBe('free');
  });

  it('should add an asset and update totals', async () => {
    renderWithFinancialProvider(<TestComponent />);
    
    // Initial values
    expect(screen.getByTestId('assets-count').textContent).toBe('0');
    expect(screen.getByTestId('total-assets').textContent).toBe('0');
    expect(screen.getByTestId('net-worth').textContent).toBe('0');
    
    // Add an asset
    fireEvent.click(screen.getByText('Add Asset'));
    
    // Check updated values
    expect(screen.getByTestId('assets-count').textContent).toBe('1');
    expect(screen.getByTestId('total-assets').textContent).toBe('1000');
    expect(screen.getByTestId('net-worth').textContent).toBe('1000');
    
    // Check if the asset is displayed
    const assetElement = await screen.findByText(/Test Asset: \$1000/);
    expect(assetElement).toBeInTheDocument();
  });

  it('should add a liability and update totals', async () => {
    renderWithFinancialProvider(<TestComponent />);
    
    // Initial values
    expect(screen.getByTestId('liabilities-count').textContent).toBe('0');
    expect(screen.getByTestId('total-liabilities').textContent).toBe('0');
    expect(screen.getByTestId('net-worth').textContent).toBe('0');
    
    // Add a liability
    fireEvent.click(screen.getByText('Add Liability'));
    
    // Check updated values
    expect(screen.getByTestId('liabilities-count').textContent).toBe('1');
    expect(screen.getByTestId('total-liabilities').textContent).toBe('500');
    expect(screen.getByTestId('net-worth').textContent).toBe('-500');
    
    // Check if the liability is displayed
    const liabilityElement = await screen.findByText(/Test Liability: \$500/);
    expect(liabilityElement).toBeInTheDocument();
  });

  it('should update an asset and recalculate totals', async () => {
    renderWithFinancialProvider(<TestComponent />);
    
    // Add an asset
    fireEvent.click(screen.getByText('Add Asset'));
    
    // Find the update button for the asset
    const assetElement = await screen.findByText(/Test Asset: \$1000/);
    const assetContainer = assetElement.parentElement;
    const updateButton = within(assetContainer!).getByText('Update');
    
    // Update the asset
    fireEvent.click(updateButton);
    
    // Check if the asset was updated
    expect(await screen.findByText(/Test Asset: \$1100/)).toBeInTheDocument();
    expect(screen.getByTestId('total-assets').textContent).toBe('1100');
    expect(screen.getByTestId('net-worth').textContent).toBe('1100');
  });

  it('should update a liability and recalculate totals', async () => {
    renderWithFinancialProvider(<TestComponent />);
    
    // Add a liability
    fireEvent.click(screen.getByText('Add Liability'));
    
    // Find the update button for the liability
    const liabilityElement = await screen.findByText(/Test Liability: \$500/);
    const liabilityContainer = liabilityElement.parentElement;
    const updateButton = within(liabilityContainer!).getByText('Update');
    
    // Update the liability
    fireEvent.click(updateButton);
    
    // Check if the liability was updated
    expect(await screen.findByText(/Test Liability: \$600/)).toBeInTheDocument();
    expect(screen.getByTestId('total-liabilities').textContent).toBe('600');
    expect(screen.getByTestId('net-worth').textContent).toBe('-600');
  });

  it('should delete an asset and update totals', async () => {
    renderWithFinancialProvider(<TestComponent />);
    
    // Add an asset
    fireEvent.click(screen.getByText('Add Asset'));
    
    // Verify asset was added
    expect(screen.getByTestId('assets-count').textContent).toBe('1');
    expect(screen.getByTestId('total-assets').textContent).toBe('1000');
    
    // Find the delete button for the asset
    const assetElement = await screen.findByText(/Test Asset: \$1000/);
    const assetContainer = assetElement.parentElement;
    const deleteButton = within(assetContainer!).getByText('Delete');
    
    // Delete the asset
    fireEvent.click(deleteButton);
    
    // Check if the asset was removed
    expect(screen.getByTestId('assets-count').textContent).toBe('0');
    expect(screen.getByTestId('total-assets').textContent).toBe('0');
    expect(screen.getByTestId('net-worth').textContent).toBe('0');
    expect(screen.queryByText(/Test Asset/)).not.toBeInTheDocument();
  });

  it('should delete a liability and update totals', async () => {
    renderWithFinancialProvider(<TestComponent />);
    
    // Add a liability
    fireEvent.click(screen.getByText('Add Liability'));
    
    // Verify liability was added
    expect(screen.getByTestId('liabilities-count').textContent).toBe('1');
    expect(screen.getByTestId('total-liabilities').textContent).toBe('500');
    
    // Find the delete button for the liability
    const liabilityElement = await screen.findByText(/Test Liability: \$500/);
    const liabilityContainer = liabilityElement.parentElement;
    const deleteButton = within(liabilityContainer!).getByText('Delete');
    
    // Delete the liability
    fireEvent.click(deleteButton);
    
    // Check if the liability was removed
    expect(screen.getByTestId('liabilities-count').textContent).toBe('0');
    expect(screen.getByTestId('total-liabilities').textContent).toBe('0');
    expect(screen.getByTestId('net-worth').textContent).toBe('0');
    expect(screen.queryByText(/Test Liability/)).not.toBeInTheDocument();
  });

  it('should enforce premium limitations for assets', async () => {
    renderWithFinancialProvider(<TestComponent />);
    
    // Add 3 assets (free tier limit)
    for (let i = 0; i < 3; i++) {
      fireEvent.click(screen.getByText('Add Asset'));
    }
    
    // Try to add a 4th asset which should throw an error
    expect(() => {
      fireEvent.click(screen.getByText('Add Asset'));
    }).toThrow('Upgrade to premium to add more than 3 asset accounts.');
    
    // Verify we still have 3 assets
    expect(screen.getByTestId('assets-count').textContent).toBe('3');
  });

  it('should enforce premium limitations for liabilities', async () => {
    renderWithFinancialProvider(<TestComponent />);
    
    // Add 2 liabilities (free tier limit)
    for (let i = 0; i < 2; i++) {
      fireEvent.click(screen.getByText('Add Liability'));
    }
    
    // Try to add a 3rd liability which should throw an error
    expect(() => {
      fireEvent.click(screen.getByText('Add Liability'));
    }).toThrow('Upgrade to premium to add more than 2 liability accounts.');
    
    // Verify we still have 2 liabilities
    expect(screen.getByTestId('liabilities-count').textContent).toBe('2');
  });

  it('should allow unlimited accounts after upgrading to premium', async () => {
    renderWithFinancialProvider(<TestComponent />);
    
    // Add 3 assets (free tier limit)
    for (let i = 0; i < 3; i++) {
      fireEvent.click(screen.getByText('Add Asset'));
    }
    
    // Upgrade to premium
    fireEvent.click(screen.getByText('Upgrade'));
    expect(screen.getByTestId('premium-status').textContent).toBe('premium');
    
    // Should now be able to add a 4th asset
    fireEvent.click(screen.getByText('Add Asset'));
    expect(screen.getByTestId('assets-count').textContent).toBe('4');
  });

  it('should persist financial data to localStorage', async () => {
    const { unmount } = renderWithFinancialProvider(<TestComponent />);
    
    // Add asset and liability
    fireEvent.click(screen.getByText('Add Asset'));
    fireEvent.click(screen.getByText('Add Liability'));
    
    // Upgrade to premium
    fireEvent.click(screen.getByText('Upgrade'));
    
    // Unmount to trigger cleanup effects
    unmount();
    
    // Check if data was saved to localStorage
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('assets', expect.any(String));
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('liabilities', expect.any(String));
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith('isPremium', 'true');
    
    // Verify the stored data
    const storedAssets = JSON.parse(mockLocalStorage.store.assets);
    const storedLiabilities = JSON.parse(mockLocalStorage.store.liabilities);
    
    expect(storedAssets).toHaveLength(1);
    expect(storedAssets[0].name).toBe('Test Asset');
    expect(storedAssets[0].balance).toBe(1000);
    
    expect(storedLiabilities).toHaveLength(1);
    expect(storedLiabilities[0].name).toBe('Test Liability');
    expect(storedLiabilities[0].balance).toBe(500);
    
    expect(mockLocalStorage.store.isPremium).toBe('true');
  });

  it('should load financial data from localStorage on initialization', async () => {
    // Prepare localStorage with test data
    const testAssets = [
      { id: 'asset1', name: 'Saved Asset', balance: 2000, category: 'bank' as AssetCategory, createdAt: '2023-01-01' }
    ];
    
    const testLiabilities = [
      { id: 'liability1', name: 'Saved Liability', balance: 1000, category: 'loan' as LiabilityCategory, createdAt: '2023-01-01' }
    ];
    
    mockLocalStorage.setItem('assets', JSON.stringify(testAssets));
    mockLocalStorage.setItem('liabilities', JSON.stringify(testLiabilities));
    mockLocalStorage.setItem('isPremium', 'true');
    
    // Render with the provider
    renderWithFinancialProvider(<TestComponent />);
    
    // Verify data was loaded
    expect(screen.getByTestId('assets-count').textContent).toBe('1');
    expect(screen.getByTestId('liabilities-count').textContent).toBe('1');
    expect(screen.getByTestId('premium-status').textContent).toBe('premium');
    
    // Check the specific items
    expect(screen.getByText(/Saved Asset: \$2000/)).toBeInTheDocument();
    expect(screen.getByText(/Saved Liability: \$1000/)).toBeInTheDocument();
  });
});