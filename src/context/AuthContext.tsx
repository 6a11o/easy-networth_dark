import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Check for existing user session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);
  
  // Mock login functionality
  const login = async (email: string, password: string) => {
    // For demo purposes, any non-empty email/password combination is accepted
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Create mock user
    const mockUser: User = {
      id: 'user-' + Math.random().toString(36).substring(2, 9),
      email
    };
    
    // Store user in localStorage
    localStorage.setItem('user', JSON.stringify(mockUser));
    
    // Update state
    setUser(mockUser);
    setIsAuthenticated(true);
  };
  
  // Mock signup functionality
  const signup = async (email: string, password: string) => {
    // For demo purposes, just use the same login flow
    await login(email, password);
  };
  
  // Logout functionality
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };
  
  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};
