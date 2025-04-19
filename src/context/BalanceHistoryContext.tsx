import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { BalanceHistory } from '../types';
import { PremiumFeatureError, ValidationError } from '../utils/errors';
import { isValidDateString, compareDates } from '../utils/dateUtils';

type BalanceHistoryContextType = {
  balanceHistory: BalanceHistory[];
  addBalanceEntry: (accountId: string, date: string, balance: number) => void;
  removeAccountHistory: (accountId: string) => void;
  getHistoricalDates: () => string[];
  getAccountHistory: (accountId: string, startDate?: string, endDate?: string) => BalanceHistory[];
};

const BalanceHistoryContext = createContext<BalanceHistoryContextType | undefined>(undefined);

export const BalanceHistoryProvider = ({ children }: { children: ReactNode }) => {
  const [balanceHistory, setBalanceHistory] = useState<BalanceHistory[]>([]);
  
  // Load balance history from localStorage
  useEffect(() => {
    const storedHistory = localStorage.getItem('balanceHistory');
    if (storedHistory) {
      setBalanceHistory(JSON.parse(storedHistory));
    }
  }, []);
  
  // Save balance history to localStorage
  useEffect(() => {
    localStorage.setItem('balanceHistory', JSON.stringify(balanceHistory));
  }, [balanceHistory]);
  
  const addBalanceEntry = (accountId: string, date: string, balance: number) => {
    if (!isValidDateString(date)) {
      throw new ValidationError('Invalid date format. Use YYYY-MM-DD.');
    }
    
    if (balance < 0) {
      throw new ValidationError('Balance cannot be negative.');
    }
    
    // Check premium limitations for historical data points
    const isPremium = localStorage.getItem('isPremium') === 'true';
    if (!isPremium) {
      const uniqueDates = new Set(balanceHistory.map(entry => entry.date));
      if (uniqueDates.size >= 3 && !uniqueDates.has(date)) {
        throw new PremiumFeatureError('Upgrade to premium to track more than 3 historical data points.');
      }
    }
    
    // Check if entry already exists for this date and account
    const existingEntry = balanceHistory.find(
      entry => entry.accountId === accountId && entry.date === date
    );
    
    if (existingEntry) {
      // Update existing entry
      setBalanceHistory(prev => prev.map(entry => 
        (entry.accountId === accountId && entry.date === date)
          ? { ...entry, balance }
          : entry
      ));
    } else {
      // Add new entry
      const newEntry: BalanceHistory = {
        id: uuidv4(),
        accountId,
        date,
        balance
      };
      
      setBalanceHistory(prev => [...prev, newEntry]);
    }
  };
  
  const removeAccountHistory = (accountId: string) => {
    setBalanceHistory(prev => prev.filter(entry => entry.accountId !== accountId));
  };
  
  const getHistoricalDates = () => {
    const uniqueDates = new Set(balanceHistory.map(entry => entry.date));
    return Array.from(uniqueDates).sort(compareDates);
  };
  
  const getAccountHistory = (accountId: string, startDate?: string, endDate?: string) => {
    if (startDate && !isValidDateString(startDate)) {
      throw new ValidationError('Invalid start date format. Use YYYY-MM-DD.');
    }
    if (endDate && !isValidDateString(endDate)) {
      throw new ValidationError('Invalid end date format. Use YYYY-MM-DD.');
    }
    
    let filteredHistory = balanceHistory.filter(entry => entry.accountId === accountId);
    
    if (startDate) {
      filteredHistory = filteredHistory.filter(entry => entry.date >= startDate);
    }
    if (endDate) {
      filteredHistory = filteredHistory.filter(entry => entry.date <= endDate);
    }
    
    return filteredHistory.sort((a, b) => compareDates(a.date, b.date));
  };
  
  const value = {
    balanceHistory,
    addBalanceEntry,
    removeAccountHistory,
    getHistoricalDates,
    getAccountHistory,
  };
  
  return (
    <BalanceHistoryContext.Provider value={value}>
      {children}
    </BalanceHistoryContext.Provider>
  );
};

export const useBalanceHistory = () => {
  const context = useContext(BalanceHistoryContext);
  
  if (context === undefined) {
    throw new Error('useBalanceHistory must be used within a BalanceHistoryProvider');
  }
  
  return context;
}; 