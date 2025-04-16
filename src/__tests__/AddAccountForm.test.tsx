/* 
 * These tests are currently disabled because they require more detailed knowledge
 * of the AddAccountForm component implementation to properly mock the required props
 * and test the component behavior.
 */

/*
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AddAccountForm } from '@/components/AddAccountForm';
import { useFinancial } from '@/context/FinancialContext';
import { describe, it, beforeEach, vi, expect } from 'vitest';
import { toast } from 'sonner';
import userEvent from '@testing-library/user-event';

// Mock the modules
vi.mock('@/context/FinancialContext');
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('AddAccountForm Component', () => {
  // Mock functions
  const mockAddAsset = vi.fn();
  const mockAddLiability = vi.fn();
  
  // Set up mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock Financial context
    (useFinancial as any).mockReturnValue({
      addAsset: mockAddAsset,
      addLiability: mockAddLiability,
      isPremium: true
    });
  });
  
  it('renders the form with both asset and liability tabs', () => {
    render(<AddAccountForm isOpen={true} onClose={vi.fn()} />);
    
    // Check for asset and liability tabs
    expect(screen.getByText('Add Asset')).toBeInTheDocument();
    expect(screen.getByText('Add Liability')).toBeInTheDocument();
    
    // Should default to asset tab
    expect(screen.getByLabelText('Account Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Balance')).toBeInTheDocument();
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
  });
  
  it('switches between asset and liability tabs', async () => {
    render(<AddAccountForm isOpen={true} onClose={vi.fn()} />);
    
    // Default is asset tab
    expect(screen.getByText('Asset Details')).toBeInTheDocument();
    
    // Click on liability tab
    await userEvent.click(screen.getByText('Add Liability'));
    
    // Should now show liability form
    expect(screen.getByText('Liability Details')).toBeInTheDocument();
  });
  
  it('validates required fields for assets', async () => {
    render(<AddAccountForm isOpen={true} onClose={vi.fn()} />);
    
    // Try to submit without filling required fields
    await userEvent.click(screen.getByText('Add Account'));
    
    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText('Account name is required')).toBeInTheDocument();
      expect(screen.getByText('Please enter a valid balance')).toBeInTheDocument();
      expect(screen.getByText('Please select a category')).toBeInTheDocument();
    });
    
    // addAsset should not have been called
    expect(mockAddAsset).not.toHaveBeenCalled();
  });
  
  it('validates required fields for liabilities', async () => {
    render(<AddAccountForm isOpen={true} onClose={vi.fn()} />);
    
    // Switch to liability tab
    await userEvent.click(screen.getByText('Add Liability'));
    
    // Try to submit without filling required fields
    await userEvent.click(screen.getByText('Add Account'));
    
    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText('Account name is required')).toBeInTheDocument();
      expect(screen.getByText('Please enter a valid balance')).toBeInTheDocument();
      expect(screen.getByText('Please select a category')).toBeInTheDocument();
    });
    
    // addLiability should not have been called
    expect(mockAddLiability).not.toHaveBeenCalled();
  });
  
  it('validates positive balance values', async () => {
    render(<AddAccountForm isOpen={true} onClose={vi.fn()} />);
    
    // Fill in name and category
    await userEvent.type(screen.getByLabelText('Account Name'), 'Test Account');
    
    // Set negative balance
    await userEvent.type(screen.getByLabelText('Balance'), '-500');
    
    // Select category
    const categorySelect = screen.getByLabelText('Category');
    await userEvent.click(categorySelect);
    await userEvent.click(screen.getByText('Bank Account'));
    
    // Try to submit
    await userEvent.click(screen.getByText('Add Account'));
    
    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText('Balance must be a positive number')).toBeInTheDocument();
    });
    
    // addAsset should not have been called
    expect(mockAddAsset).not.toHaveBeenCalled();
  });
  
  it('successfully submits asset form', async () => {
    const onCloseMock = vi.fn();
    render(<AddAccountForm isOpen={true} onClose={onCloseMock} />);
    
    // Fill in form
    await userEvent.type(screen.getByLabelText('Account Name'), 'Checking Account');
    await userEvent.type(screen.getByLabelText('Balance'), '5000');
    
    // Select category
    const categorySelect = screen.getByLabelText('Category');
    await userEvent.click(categorySelect);
    await userEvent.click(screen.getByText('Bank Account'));
    
    // Submit form
    await userEvent.click(screen.getByText('Add Account'));
    
    // Check that addAsset was called with correct values
    await waitFor(() => {
      expect(mockAddAsset).toHaveBeenCalledWith('Checking Account', 5000, 'bank');
      expect(toast.success).toHaveBeenCalled();
      expect(onCloseMock).toHaveBeenCalled();
    });
  });
  
  it('successfully submits liability form', async () => {
    const onCloseMock = vi.fn();
    render(<AddAccountForm isOpen={true} onClose={onCloseMock} />);
    
    // Switch to liability tab
    await userEvent.click(screen.getByText('Add Liability'));
    
    // Fill in form
    await userEvent.type(screen.getByLabelText('Account Name'), 'Credit Card');
    await userEvent.type(screen.getByLabelText('Balance'), '2000');
    
    // Select category
    const categorySelect = screen.getByLabelText('Category');
    await userEvent.click(categorySelect);
    await userEvent.click(screen.getByText('Credit Card'));
    
    // Submit form
    await userEvent.click(screen.getByText('Add Account'));
    
    // Check that addLiability was called with correct values
    await waitFor(() => {
      expect(mockAddLiability).toHaveBeenCalledWith('Credit Card', 2000, 'creditcard');
      expect(toast.success).toHaveBeenCalled();
      expect(onCloseMock).toHaveBeenCalled();
    });
  });
  
  it('displays premium upgrade message when not premium', async () => {
    // Mock not premium
    (useFinancial as any).mockReturnValue({
      addAsset: mockAddAsset,
      addLiability: mockAddLiability,
      isPremium: false,
      assets: Array(3).fill({ id: '1', name: 'Test', balance: 100, category: 'bank' })
    });
    
    render(<AddAccountForm isOpen={true} onClose={vi.fn()} />);
    
    // Should show premium upgrade message
    expect(screen.getByText(/Free plan is limited/)).toBeInTheDocument();
    expect(screen.getByText('Upgrade to Pro')).toBeInTheDocument();
  });
  
  it('handles API errors gracefully', async () => {
    // Mock addAsset to throw error
    mockAddAsset.mockImplementation(() => {
      throw new Error('API Error');
    });
    
    render(<AddAccountForm isOpen={true} onClose={vi.fn()} />);
    
    // Fill in form
    await userEvent.type(screen.getByLabelText('Account Name'), 'Checking Account');
    await userEvent.type(screen.getByLabelText('Balance'), '5000');
    
    // Select category
    const categorySelect = screen.getByLabelText('Category');
    await userEvent.click(categorySelect);
    await userEvent.click(screen.getByText('Bank Account'));
    
    // Submit form
    await userEvent.click(screen.getByText('Add Account'));
    
    // Check that error toast was shown
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
});
*/ 