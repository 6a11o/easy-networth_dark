import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { describe, it, vi, expect, beforeEach, afterEach } from 'vitest';

// Mock fetch API
global.fetch = vi.fn();

// Create a test component that uses the auth context
const TestComponent = () => {
  const { isAuthenticated, user, login, logout, signup } = useAuth();
  
  const handleLogin = async () => {
    try {
      await login('test@example.com', 'password123');
    } catch (error) {
      // Error is caught and handled here
      console.error('Login error caught in component:', error);
    }
  };
  
  return (
    <div>
      <div data-testid="auth-status">{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>
      {user && <div data-testid="user-email">{user.email}</div>}
      
      <button onClick={handleLogin}>Login</button>
      <button onClick={() => signup('new@example.com', 'password123')}>Signup</button>
      <button onClick={() => logout()}>Logout</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Clear localStorage
    localStorage.clear();
    
    // Mock successful fetch responses
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ({ 
        user: { 
          id: 'user123', 
          email: 'test@example.com' 
        }, 
        token: 'fake-token-123' 
      })
    });
  });
  
  afterEach(() => {
    vi.resetAllMocks();
  });
  
  it('provides authentication state and methods', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Initially not authenticated
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    
    // Login buttons should exist
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Signup')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });
  
  it('handles login correctly', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Click login button
    await act(async () => {
      fireEvent.click(screen.getByText('Login'));
    });
    
    // Check that fetch was called with correct arguments
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/login'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      })
    );
    
    // Should now be authenticated
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com');
  });
  
  it('handles signup correctly', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Click signup button
    await act(async () => {
      fireEvent.click(screen.getByText('Signup'));
    });
    
    // Check that fetch was called with correct arguments
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/signup'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
          email: 'new@example.com',
          password: 'password123'
        })
      })
    );
    
    // Should now be authenticated
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
  });
  
  it('handles logout correctly', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Login first
    await act(async () => {
      fireEvent.click(screen.getByText('Login'));
    });
    
    // Should be authenticated
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Authenticated');
    
    // Click logout button
    await act(async () => {
      fireEvent.click(screen.getByText('Logout'));
    });
    
    // Should now be logged out
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
  });
  
  it('handles login errors correctly', async () => {
    // Mock failed login
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ 
        error: 'Invalid credentials',
        message: 'Login failed'
      })
    });
    
    // Spy on console.error
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    
    // Click login button
    await act(async () => {
      fireEvent.click(screen.getByText('Login'));
    });
    
    // Should not be authenticated
    expect(screen.getByTestId('auth-status')).toHaveTextContent('Not Authenticated');
    
    // Should log error
    expect(consoleSpy).toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });
}); 