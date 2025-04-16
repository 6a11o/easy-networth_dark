import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Asset, Liability, AssetCategory, LiabilityCategory, BalanceHistory } from '../types';
import { useAuth } from './AuthContext';

// Get API base URL based on environment
const getApiBaseUrl = () => {
  const env = process.env.NODE_ENV;
  if (env === 'production') {
    return 'https://api.easynetworth.com';
  } else if (env === 'test') {
    return 'https://test-api.easynetworth.com';
  }
  return 'https://dev-api.easynetworth.com';
};

// Context type definitions
type FinancialContextType = {
  // Assets
  assets: Asset[];
  addAsset: (name: string, balance: number, category: AssetCategory) => void;
  updateAsset: (id: string, data: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
  
  // Liabilities
  liabilities: Liability[];
  addLiability: (name: string, balance: number, category: LiabilityCategory) => void;
  updateLiability: (id: string, data: Partial<Liability>) => void;
  deleteLiability: (id: string) => void;
  
  // Balance history
  balanceHistory: BalanceHistory[];
  updateBalances: (date: string, updates: { id: string; balance: number }[]) => void;
  
  // Calculations
  getTotalAssets: () => number;
  getTotalLiabilities: () => number;
  getNetWorth: () => number;
  
  // Historical data
  getHistoricalDates: () => string[];
  getHistoricalNetWorth: (startDate?: string, endDate?: string) => { date: string; netWorth: number }[];
  
  // Premium status
  isPremium: boolean;
  setIsPremium: (status: boolean) => void;
  
  // Loading state
  isLoading: boolean;
};

// Create context with default values
const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

// Provider component
export const FinancialProvider = ({ children }: { children: ReactNode }) => {
  // State management
  const [assets, setAssets] = useState<Asset[]>([]);
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const [balanceHistory, setBalanceHistory] = useState<BalanceHistory[]>([]);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const { user, isAuthenticated } = useAuth();
  
  // Fetch user financial data when authenticated
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isAuthenticated || !user) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      
      try {
        // Fetch assets
        const assetsResponse = await fetch(`${getApiBaseUrl()}/assets`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });
        
        if (assetsResponse.ok) {
          const assetsData = await assetsResponse.json();
          setAssets(assetsData);
        }
        
        // Fetch liabilities
        const liabilitiesResponse = await fetch(`${getApiBaseUrl()}/liabilities`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });
        
        if (liabilitiesResponse.ok) {
          const liabilitiesData = await liabilitiesResponse.json();
          setLiabilities(liabilitiesData);
        }
        
        // Fetch balance history
        const historyResponse = await fetch(`${getApiBaseUrl()}/balance-history`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });
        
        if (historyResponse.ok) {
          const historyData = await historyResponse.json();
          setBalanceHistory(historyData);
        }
        
        // Fetch premium status
        const premiumResponse = await fetch(`${getApiBaseUrl()}/user/premium-status`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
          },
        });
        
        if (premiumResponse.ok) {
          const premiumData = await premiumResponse.json();
          setIsPremium(premiumData.isPremium);
        }
      } catch (error) {
        console.error('Error fetching financial data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [isAuthenticated, user]);
  
  // Fallback to localStorage for offline/development scenarios
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      const storedAssets = localStorage.getItem('assets');
      const storedLiabilities = localStorage.getItem('liabilities');
      const storedBalanceHistory = localStorage.getItem('balanceHistory');
      const storedPremium = localStorage.getItem('isPremium');
      
      if (storedAssets) setAssets(JSON.parse(storedAssets));
      if (storedLiabilities) setLiabilities(JSON.parse(storedLiabilities));
      if (storedBalanceHistory) setBalanceHistory(JSON.parse(storedBalanceHistory));
      if (storedPremium) setIsPremium(JSON.parse(storedPremium));
    }
  }, [isAuthenticated, isLoading]);
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('assets', JSON.stringify(assets));
    localStorage.setItem('liabilities', JSON.stringify(liabilities));
    localStorage.setItem('balanceHistory', JSON.stringify(balanceHistory));
    localStorage.setItem('isPremium', JSON.stringify(isPremium));
  }, [assets, liabilities, balanceHistory, isPremium]);
  
  // Asset management functions
  const addAsset = (name: string, balance: number, category: AssetCategory) => {
    // Check for free plan limitations
    if (!isPremium && assets.length >= 3) {
      throw new Error('Upgrade to premium to add more than 3 asset accounts.');
    }

    const newAsset: Asset = {
      id: uuidv4(),
      name,
      balance,
      category,
      createdAt: new Date().toISOString()
    };
    
    // API call to add asset
    if (isAuthenticated && user) {
      fetch(`${getApiBaseUrl()}/assets`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(newAsset),
      })
      .catch(error => console.error('Error adding asset:', error));
    }
    
    setAssets([...assets, newAsset]);
    
    // Add to balance history
    const today = new Date().toISOString().split('T')[0];
    const historyEntry: BalanceHistory = {
      id: uuidv4(),
      accountId: newAsset.id,
      date: today,
      balance
    };
    
    setBalanceHistory([...balanceHistory, historyEntry]);
  };
  
  const updateAsset = (id: string, data: Partial<Asset>) => {
    // Update local state
    setAssets(assets.map(asset => 
      asset.id === id ? { ...asset, ...data } : asset
    ));
    
    // API call to update asset
    if (isAuthenticated && user) {
      fetch(`${getApiBaseUrl()}/assets/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(data),
      })
      .catch(error => console.error('Error updating asset:', error));
    }
    
    // Update the latest balance in history if balance was changed
    if (data.balance !== undefined) {
      const today = new Date().toISOString().split('T')[0];
      
      // Check if there's already an entry for today
      const existingEntry = balanceHistory.find(
        entry => entry.accountId === id && entry.date === today
      );
      
      if (existingEntry) {
        // Update existing entry
        setBalanceHistory(balanceHistory.map(entry => 
          (entry.accountId === id && entry.date === today) 
            ? { ...entry, balance: data.balance! } 
            : entry
        ));
      } else {
        // Create new entry
        const historyEntry: BalanceHistory = {
          id: uuidv4(),
          accountId: id,
          date: today,
          balance: data.balance
        };
        
        setBalanceHistory([...balanceHistory, historyEntry]);
      }
    }
  };
  
  const deleteAsset = (id: string) => {
    // API call to delete asset
    if (isAuthenticated && user) {
      fetch(`${getApiBaseUrl()}/assets/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      })
      .catch(error => console.error('Error deleting asset:', error));
    }
    
    // Update local state
    setAssets(assets.filter(asset => asset.id !== id));
    
    // Remove from balance history
    setBalanceHistory(balanceHistory.filter(entry => entry.accountId !== id));
  };
  
  // Liability management functions
  const addLiability = (name: string, balance: number, category: LiabilityCategory) => {
    // Check for free plan limitations
    if (!isPremium && liabilities.length >= 2) {
      throw new Error('Upgrade to premium to add more than 2 liability accounts.');
    }

    const newLiability: Liability = {
      id: uuidv4(),
      name,
      balance,
      category,
      createdAt: new Date().toISOString()
    };
    
    setLiabilities([...liabilities, newLiability]);
    
    // Add to balance history
    const today = new Date().toISOString().split('T')[0];
    const historyEntry: BalanceHistory = {
      id: uuidv4(),
      accountId: newLiability.id,
      date: today,
      balance
    };
    
    setBalanceHistory([...balanceHistory, historyEntry]);
  };
  
  const updateLiability = (id: string, data: Partial<Liability>) => {
    setLiabilities(liabilities.map(liability => 
      liability.id === id ? { ...liability, ...data } : liability
    ));
    
    // Update the latest balance in history if balance was changed
    if (data.balance !== undefined) {
      const today = new Date().toISOString().split('T')[0];
      
      // Check if there's already an entry for today
      const existingEntry = balanceHistory.find(
        entry => entry.accountId === id && entry.date === today
      );
      
      if (existingEntry) {
        // Update existing entry
        setBalanceHistory(balanceHistory.map(entry => 
          (entry.accountId === id && entry.date === today) 
            ? { ...entry, balance: data.balance! } 
            : entry
        ));
      } else {
        // Create new entry
        const historyEntry: BalanceHistory = {
          id: uuidv4(),
          accountId: id,
          date: today,
          balance: data.balance
        };
        
        setBalanceHistory([...balanceHistory, historyEntry]);
      }
    }
  };
  
  const deleteLiability = (id: string) => {
    setLiabilities(liabilities.filter(liability => liability.id !== id));
    
    // Remove from balance history
    setBalanceHistory(balanceHistory.filter(entry => entry.accountId !== id));
  };
  
  // Balance update function
  const updateBalances = (date: string, updates: { id: string; balance: number }[]) => {
    // Check if there are already 3 distinct dates in history for non-premium users
    if (!isPremium) {
      const uniqueDates = new Set(balanceHistory.map(entry => entry.date));
      if (uniqueDates.size >= 3 && !uniqueDates.has(date)) {
        throw new Error('Upgrade to premium to track more than 3 historical data points.');
      }
    }
    
    const newEntries: BalanceHistory[] = updates.map(update => ({
      id: uuidv4(),
      accountId: update.id,
      date,
      balance: update.balance
    }));
    
    // Filter out any existing entries for the same date and accounts
    const filteredHistory = balanceHistory.filter(entry => 
      !updates.some(update => update.id === entry.accountId && entry.date === date)
    );
    
    setBalanceHistory([...filteredHistory, ...newEntries]);
    
    // Update current balances
    setAssets(assets.map(asset => {
      const update = updates.find(u => u.id === asset.id);
      return update ? { ...asset, balance: update.balance } : asset;
    }));
    
    setLiabilities(liabilities.map(liability => {
      const update = updates.find(u => u.id === liability.id);
      return update ? { ...liability, balance: update.balance } : liability;
    }));
  };
  
  // Calculation functions
  const getTotalAssets = () => {
    return assets.reduce((sum, asset) => sum + asset.balance, 0);
  };
  
  const getTotalLiabilities = () => {
    return liabilities.reduce((sum, liability) => sum + liability.balance, 0);
  };
  
  const getNetWorth = () => {
    return getTotalAssets() - getTotalLiabilities();
  };
  
  // Get all unique dates in the balance history
  const getHistoricalDates = () => {
    const uniqueDates = new Set(balanceHistory.map(entry => entry.date));
    return Array.from(uniqueDates).sort();
  };
  
  // Get historical net worth for charting
  const getHistoricalNetWorth = (startDate?: string, endDate?: string) => {
    const dates = getHistoricalDates();
    
    // Filter dates based on range if provided
    let filteredDates = dates;
    if (startDate) {
      filteredDates = filteredDates.filter(date => date >= startDate);
    }
    if (endDate) {
      filteredDates = filteredDates.filter(date => date <= endDate);
    }
    
    // Calculate net worth for each date
    return filteredDates.map(date => {
      // For each asset, find the most recent balance entry before or on this date
      const assetsValue = assets.reduce((sum, asset) => {
        const entries = balanceHistory
          .filter(entry => entry.accountId === asset.id && entry.date <= date)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        return sum + (entries[0]?.balance || 0);
      }, 0);
      
      // For each liability, find the most recent balance entry before or on this date
      const liabilitiesValue = liabilities.reduce((sum, liability) => {
        const entries = balanceHistory
          .filter(entry => entry.accountId === liability.id && entry.date <= date)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        return sum + (entries[0]?.balance || 0);
      }, 0);
      
      return {
        date,
        netWorth: assetsValue - liabilitiesValue
      };
    });
  };
  
  // Provide the context value
  const contextValue: FinancialContextType = {
    assets,
    addAsset,
    updateAsset,
    deleteAsset,
    liabilities,
    addLiability,
    updateLiability,
    deleteLiability,
    balanceHistory,
    updateBalances,
    getTotalAssets,
    getTotalLiabilities,
    getNetWorth,
    getHistoricalDates,
    getHistoricalNetWorth,
    isPremium,
    setIsPremium,
    isLoading
  };
  
  return (
    <FinancialContext.Provider value={contextValue}>
      {children}
    </FinancialContext.Provider>
  );
};

// Custom hook for using the context
export const useFinancial = () => {
  const context = useContext(FinancialContext);
  
  if (context === undefined) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  
  return context;
};
