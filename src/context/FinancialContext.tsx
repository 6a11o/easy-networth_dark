import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AssetsProvider, useAssets } from './AssetsContext';
import { LiabilitiesProvider, useLiabilities } from './LiabilitiesContext';
import { BalanceHistoryProvider, useBalanceHistory } from './BalanceHistoryContext';
import { v4 as uuidv4 } from 'uuid';
import { Asset, Liability, AssetCategory, LiabilityCategory, BalanceHistory } from '../types';
import { getTodayString, isValidDateString, compareDates } from '../utils/dateUtils';
import { PremiumFeatureError, ValidationError } from '../utils/errors';

// Context type definitions
type FinancialContextType = {
  // Core financial calculations
  getNetWorth: () => number;
  getHistoricalNetWorth: (startDate?: string, endDate?: string) => { date: string; netWorth: number }[];
  
  // Assets management
  assets: Asset[];
  addAsset: (name: string, balance: number, category: AssetCategory) => void;
  updateAsset: (id: string, data: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
  getTotalAssets: () => number;
  
  // Liabilities management
  liabilities: Liability[];
  addLiability: (name: string, balance: number, category: LiabilityCategory) => void;
  updateLiability: (id: string, data: Partial<Liability>) => void;
  deleteLiability: (id: string) => void;
  getTotalLiabilities: () => number;
  
  // Balance history
  balanceHistory: BalanceHistory[];
  updateBalances: (accountId: string, date: string, balance: number) => void;
  getHistoricalDates: () => string[];
  
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

const FinancialContextProvider = ({ children }: { children: ReactNode }) => {
  const [isPremium, setIsPremium] = useState(false);
  const { assets, addAsset, updateAsset, deleteAsset, getTotalAssets } = useAssets();
  const { liabilities, addLiability, updateLiability, deleteLiability, getTotalLiabilities } = useLiabilities();
  const { balanceHistory, addBalanceEntry, getHistoricalDates, getAccountHistory } = useBalanceHistory();
  
  // Load premium status from localStorage
  useEffect(() => {
    const storedPremium = localStorage.getItem('isPremium');
    if (storedPremium) {
      setIsPremium(JSON.parse(storedPremium));
    }
  }, []);
  
  // Save premium status to localStorage
  useEffect(() => {
    localStorage.setItem('isPremium', JSON.stringify(isPremium));
  }, [isPremium]);
  
  const getNetWorth = () => {
    return getTotalAssets() - getTotalLiabilities();
  };
  
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
      // Calculate total assets value for this date
      const assetsValue = assets.reduce((sum, asset) => {
        const history = getAccountHistory(asset.id, undefined, date);
        const latestEntry = history[history.length - 1];
        return sum + (latestEntry?.balance || 0);
      }, 0);
      
      // Calculate total liabilities value for this date
      const liabilitiesValue = liabilities.reduce((sum, liability) => {
        const history = getAccountHistory(liability.id, undefined, date);
        const latestEntry = history[history.length - 1];
        return sum + (latestEntry?.balance || 0);
      }, 0);
      
      return {
        date,
        netWorth: assetsValue - liabilitiesValue
      };
    });
  };
  
  const value: FinancialContextType = {
    // Core financial calculations
    getNetWorth,
    getHistoricalNetWorth,
    
    // Assets management
    assets,
    addAsset,
    updateAsset,
    deleteAsset,
    getTotalAssets,
    
    // Liabilities management
    liabilities,
    addLiability,
    updateLiability,
    deleteLiability,
    getTotalLiabilities,
    
    // Balance history
    balanceHistory,
    updateBalances: addBalanceEntry,
    getHistoricalDates,
    
    // Premium status
    isPremium,
    setIsPremium
  };
  
  return (
    <FinancialContext.Provider value={value}>
      {children}
    </FinancialContext.Provider>
  );
};

// Combined provider that includes all financial contexts
export const FinancialProvider = ({ children }: { children: ReactNode }) => {
  return (
    <BalanceHistoryProvider>
      <AssetsProvider>
        <LiabilitiesProvider>
          <FinancialContextProvider>
            {children}
          </FinancialContextProvider>
        </LiabilitiesProvider>
      </AssetsProvider>
    </BalanceHistoryProvider>
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
