import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Asset, Liability, AssetCategory, LiabilityCategory, BalanceHistory } from '../types';

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
};

// Create context with default values
const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

// Sample data for demonstration
const sampleAssets: Asset[] = [
  {
    id: '1',
    name: 'Checking Account',
    balance: 5000,
    category: 'bank',
    createdAt: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Stock Portfolio',
    balance: 15000,
    category: 'stocks',
    createdAt: new Date().toISOString()
  }
];

const sampleLiabilities: Liability[] = [
  {
    id: '1',
    name: 'Credit Card',
    balance: 2000,
    category: 'creditcard',
    createdAt: new Date().toISOString()
  }
];

// Sample balance history
const today = new Date();
const oneMonthAgo = new Date();
oneMonthAgo.setMonth(today.getMonth() - 1);

const twoMonthsAgo = new Date();
twoMonthsAgo.setMonth(today.getMonth() - 2);

const sampleBalanceHistory: BalanceHistory[] = [
  // Asset 1 history
  {
    id: uuidv4(),
    accountId: '1',
    date: twoMonthsAgo.toISOString().split('T')[0],
    balance: 4000
  },
  {
    id: uuidv4(),
    accountId: '1',
    date: oneMonthAgo.toISOString().split('T')[0],
    balance: 4500
  },
  {
    id: uuidv4(),
    accountId: '1',
    date: today.toISOString().split('T')[0],
    balance: 5000
  },
  
  // Asset 2 history
  {
    id: uuidv4(),
    accountId: '2',
    date: twoMonthsAgo.toISOString().split('T')[0],
    balance: 12000
  },
  {
    id: uuidv4(),
    accountId: '2',
    date: oneMonthAgo.toISOString().split('T')[0],
    balance: 13500
  },
  {
    id: uuidv4(),
    accountId: '2',
    date: today.toISOString().split('T')[0],
    balance: 15000
  },
  
  // Liability 1 history
  {
    id: uuidv4(),
    accountId: '1', // Same ID as asset, but we know it's a liability from context
    date: twoMonthsAgo.toISOString().split('T')[0],
    balance: 3000
  },
  {
    id: uuidv4(),
    accountId: '1',
    date: oneMonthAgo.toISOString().split('T')[0],
    balance: 2500
  },
  {
    id: uuidv4(),
    accountId: '1',
    date: today.toISOString().split('T')[0],
    balance: 2000
  }
];

// Provider component
export const FinancialProvider = ({ children }: { children: ReactNode }) => {
  // State management
  const [assets, setAssets] = useState<Asset[]>(sampleAssets);
  const [liabilities, setLiabilities] = useState<Liability[]>(sampleLiabilities);
  const [balanceHistory, setBalanceHistory] = useState<BalanceHistory[]>(sampleBalanceHistory);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  
  // Load data from localStorage on mount
  useEffect(() => {
    const storedAssets = localStorage.getItem('assets');
    const storedLiabilities = localStorage.getItem('liabilities');
    const storedBalanceHistory = localStorage.getItem('balanceHistory');
    const storedPremium = localStorage.getItem('isPremium');
    
    if (storedAssets) setAssets(JSON.parse(storedAssets));
    if (storedLiabilities) setLiabilities(JSON.parse(storedLiabilities));
    if (storedBalanceHistory) setBalanceHistory(JSON.parse(storedBalanceHistory));
    if (storedPremium) setIsPremium(JSON.parse(storedPremium));
  }, []);
  
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
    setAssets(assets.map(asset => 
      asset.id === id ? { ...asset, ...data } : asset
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
  
  const deleteAsset = (id: string) => {
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
  
  const value = {
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
    setIsPremium
  };
  
  return (
    <FinancialContext.Provider value={value}>
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
