import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Liability, LiabilityCategory } from '../types';
import { PremiumFeatureError, ValidationError } from '../utils/errors';
import { getTodayString } from '../utils/dateUtils';
import { useBalanceHistory } from './BalanceHistoryContext';
import { useCurrency } from './CurrencyContext';
import { convertCurrency } from '../utils/currencyUtils';

type LiabilitiesContextType = {
  liabilities: Liability[];
  addLiability: (name: string, balance: number, category: LiabilityCategory) => void;
  updateLiability: (id: string, data: Partial<Liability>) => void;
  deleteLiability: (id: string) => void;
  getTotalLiabilities: () => number;
};

const LiabilitiesContext = createContext<LiabilitiesContextType | undefined>(undefined);

export const LiabilitiesProvider = ({ children }: { children: ReactNode }) => {
  const [liabilities, setLiabilities] = useState<Liability[]>([]);
  const { addBalanceEntry, removeAccountHistory } = useBalanceHistory();
  const { currency: mainCurrency } = useCurrency();
  
  // Load liabilities from localStorage
  useEffect(() => {
    const storedLiabilities = localStorage.getItem('liabilities');
    if (storedLiabilities) {
      setLiabilities(JSON.parse(storedLiabilities));
    }
  }, []);
  
  // Save liabilities to localStorage
  useEffect(() => {
    localStorage.setItem('liabilities', JSON.stringify(liabilities));
  }, [liabilities]);
  
  const addLiability = (name: string, balance: number, category: LiabilityCategory) => {
    if (!name.trim()) {
      throw new ValidationError('Liability name is required.');
    }
    
    if (balance < 0) {
      throw new ValidationError('Liability balance cannot be negative.');
    }
    
    // Check for free plan limitations
    const isPremium = localStorage.getItem('isPremium') === 'true';
    if (!isPremium && liabilities.length >= 2) {
      throw new PremiumFeatureError('Upgrade to premium to add more than 2 liability accounts.');
    }

    const newLiability: Liability = {
      id: uuidv4(),
      name: name.trim(),
      balance,
      category,
      currency: mainCurrency.code,
      createdAt: new Date().toISOString()
    };
    
    setLiabilities(prev => [...prev, newLiability]);
    
    // Add initial balance history entry
    addBalanceEntry(newLiability.id, getTodayString(), balance);
  };
  
  const updateLiability = (id: string, data: Partial<Liability>) => {
    if (data.name !== undefined && !data.name.trim()) {
      throw new ValidationError('Liability name cannot be empty.');
    }
    
    if (data.balance !== undefined && data.balance < 0) {
      throw new ValidationError('Liability balance cannot be negative.');
    }
    
    setLiabilities(prev => prev.map(liability => 
      liability.id === id ? { ...liability, ...data } : liability
    ));
    
    // Update balance history if balance changed
    if (data.balance !== undefined) {
      addBalanceEntry(id, getTodayString(), data.balance);
    }
  };
  
  const deleteLiability = (id: string) => {
    setLiabilities(prev => prev.filter(liability => liability.id !== id));
    removeAccountHistory(id);
  };
  
  const getTotalLiabilities = () => {
    return liabilities.reduce((sum, liability) => {
      const convertedAmount = convertCurrency(liability.balance, liability.currency || mainCurrency.code, mainCurrency.code);
      return sum + convertedAmount;
    }, 0);
  };
  
  const value = {
    liabilities,
    addLiability,
    updateLiability,
    deleteLiability,
    getTotalLiabilities,
  };
  
  return (
    <LiabilitiesContext.Provider value={value}>
      {children}
    </LiabilitiesContext.Provider>
  );
};

export const useLiabilities = () => {
  const context = useContext(LiabilitiesContext);
  
  if (context === undefined) {
    throw new Error('useLiabilities must be used within a LiabilitiesProvider');
  }
  
  return context;
}; 