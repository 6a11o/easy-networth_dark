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

// Environment-aware API endpoint
const getApiBaseUrl = () => {
  const env = process.env.NODE_ENV;
  if (env === 'production') {
    return 'https://api.easynetworth.com';
  } else if (env === 'test') {
    return 'https://test-api.easynetworth.com';
  }
  return 'https://dev-api.easynetworth.com';
};

// Dev mode configuration - set to false when testing actual auth flows
const DEV_AUTH_BYPASS = process.env.NODE_ENV === 'development';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Check for existing user session on mount
  useEffect(() => {
    // Development mode auto-login bypass
    if (DEV_AUTH_BYPASS) {
      console.info('🔑 Development mode: Auto-login enabled');
      const devUser = {
        id: 'dev-user-id',
        email: 'dev@easynetworth.com',
        token: 'dev-mode-token'
      };
      setUser(devUser);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(devUser));
      return;
    }
    
    // Normal authentication logic for production
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
  
  const login = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    // Development mode auto-login bypass
    if (DEV_AUTH_BYPASS) {
      console.info('🔑 Development mode: Login bypassed');
      const devUser = {
        id: 'dev-user-id',
        email: email || 'dev@easynetworth.com',
        token: 'dev-mode-token'
      };
      localStorage.setItem('user', JSON.stringify(devUser));
      setUser(devUser);
      setIsAuthenticated(true);
      return;
    }
    
    try {
      const response = await fetch(`${getApiBaseUrl()}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      const userData = await response.json();
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(userData.user));
      
      // Update state
      setUser(userData.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };
  
  const signup = async (email: string, password: string) => {
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    // Development mode auto-signup bypass
    if (DEV_AUTH_BYPASS) {
      console.info('🔑 Development mode: Signup bypassed');
      const devUser = {
        id: 'dev-user-id',
        email: email || 'dev@easynetworth.com',
        token: 'dev-mode-token'
      };
      localStorage.setItem('user', JSON.stringify(devUser));
      setUser(devUser);
      setIsAuthenticated(true);
      return;
    }
    
    try {
      const response = await fetch(`${getApiBaseUrl()}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Signup failed');
      }
      
      const userData = await response.json();
      
      // Store user in localStorage
      localStorage.setItem('user', JSON.stringify(userData.user));
      
      // Update state
      setUser(userData.user);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };
  
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
