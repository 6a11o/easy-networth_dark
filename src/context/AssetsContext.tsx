import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Asset, AssetCategory } from '../types';
import { PremiumFeatureError, ValidationError } from '../utils/errors';
import { getTodayString } from '../utils/dateUtils';
import { useBalanceHistory } from './BalanceHistoryContext';

type AssetsContextType = {
  assets: Asset[];
  addAsset: (name: string, balance: number, category: AssetCategory) => void;
  updateAsset: (id: string, data: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
  getTotalAssets: () => number;
};

const AssetsContext = createContext<AssetsContextType | undefined>(undefined);

export const AssetsProvider = ({ children }: { children: ReactNode }) => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const { addBalanceEntry, removeAccountHistory } = useBalanceHistory();
  
  // Load assets from localStorage
  useEffect(() => {
    const storedAssets = localStorage.getItem('assets');
    if (storedAssets) {
      setAssets(JSON.parse(storedAssets));
    }
  }, []);
  
  // Save assets to localStorage
  useEffect(() => {
    localStorage.setItem('assets', JSON.stringify(assets));
  }, [assets]);
  
  const addAsset = (name: string, balance: number, category: AssetCategory) => {
    if (!name.trim()) {
      throw new ValidationError('Asset name is required.');
    }
    
    if (balance < 0) {
      throw new ValidationError('Asset balance cannot be negative.');
    }
    
    // Check for free plan limitations
    const isPremium = localStorage.getItem('isPremium') === 'true';
    if (!isPremium && assets.length >= 3) {
      throw new PremiumFeatureError('Upgrade to premium to add more than 3 asset accounts.');
    }

    const newAsset: Asset = {
      id: uuidv4(),
      name: name.trim(),
      balance,
      category,
      createdAt: new Date().toISOString()
    };
    
    setAssets(prev => [...prev, newAsset]);
    
    // Add initial balance history entry
    addBalanceEntry(newAsset.id, getTodayString(), balance);
  };
  
  const updateAsset = (id: string, data: Partial<Asset>) => {
    if (data.name !== undefined && !data.name.trim()) {
      throw new ValidationError('Asset name cannot be empty.');
    }
    
    if (data.balance !== undefined && data.balance < 0) {
      throw new ValidationError('Asset balance cannot be negative.');
    }
    
    setAssets(prev => prev.map(asset => 
      asset.id === id ? { ...asset, ...data } : asset
    ));
    
    // Update balance history if balance changed
    if (data.balance !== undefined) {
      addBalanceEntry(id, getTodayString(), data.balance);
    }
  };
  
  const deleteAsset = (id: string) => {
    setAssets(prev => prev.filter(asset => asset.id !== id));
    removeAccountHistory(id);
  };
  
  const getTotalAssets = () => {
    return assets.reduce((sum, asset) => sum + asset.balance, 0);
  };
  
  const value = {
    assets,
    addAsset,
    updateAsset,
    deleteAsset,
    getTotalAssets,
  };
  
  return (
    <AssetsContext.Provider value={value}>
      {children}
    </AssetsContext.Provider>
  );
};

export const useAssets = () => {
  const context = useContext(AssetsContext);
  
  if (context === undefined) {
    throw new Error('useAssets must be used within an AssetsProvider');
  }
  
  return context;
}; 