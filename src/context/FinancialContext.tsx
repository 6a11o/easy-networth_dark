import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

// ─── Types ────────────────────────────────────────────────────────────────────

export type AssetCategory =
  | 'bank'
  | 'cash'
  | 'investments'
  | 'property'
  | 'crypto'
  | 'other';

export type LiabilityCategory =
  | 'credit_card'
  | 'loan'
  | 'mortgage'
  | 'other';

export type Asset = {
  id: string;
  name: string;
  balance: number;
  category: AssetCategory;
  currency: string;
  createdAt: string;
};

export type Liability = {
  id: string;
  name: string;
  balance: number;
  category: LiabilityCategory;
  currency: string;
  createdAt: string;
};

export type SnapshotAccount = {
  id: string;
  name: string;
  type: 'asset' | 'liability';
  balance: number;
  currency: string;
  category: string;
};

export type Snapshot = {
  id: string;
  date: string;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  accounts: SnapshotAccount[];
};

// ─── Context type ─────────────────────────────────────────────────────────────

type FinancialContextType = {
  // Assets
  assets: Asset[];
  addAsset: (name: string, balance: number, category: AssetCategory, currency: string) => void;
  updateAsset: (id: string, data: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
  getTotalAssets: () => number;

  // Liabilities
  liabilities: Liability[];
  addLiability: (name: string, balance: number, category: LiabilityCategory, currency: string) => void;
  updateLiability: (id: string, data: Partial<Liability>) => void;
  deleteLiability: (id: string) => void;
  getTotalLiabilities: () => number;

  // Net worth
  getNetWorth: () => number;

  // Snapshots — the core mechanic
  snapshots: Snapshot[];
  createSnapshot: () => void;
  deleteSnapshot: (id: string) => void;
  getHistoricalNetWorth: (startDate?: string, endDate?: string) => { date: string; netWorth: number; totalAssets: number; totalLiabilities: number }[];

  // Premium
  isPremium: boolean;
  setIsPremium: (status: boolean) => void;

  // Legacy compatibility (kept so existing components don't break)
  balanceHistory: Snapshot[];
  updateBalances: (accountId: string, date: string, balance: number) => void;
  getHistoricalDates: () => string[];
};

// ─── Storage keys ─────────────────────────────────────────────────────────────

const STORAGE_KEYS = {
  assets: 'enw_assets',
  liabilities: 'enw_liabilities',
  snapshots: 'enw_snapshots',
  isPremium: 'enw_isPremium',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    console.error('Failed to save to localStorage:', key);
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const FinancialProvider = ({ children }: { children: ReactNode }) => {
  const [assets, setAssets] = useState<Asset[]>(() =>
    loadFromStorage<Asset[]>(STORAGE_KEYS.assets, [])
  );

  const [liabilities, setLiabilities] = useState<Liability[]>(() =>
    loadFromStorage<Liability[]>(STORAGE_KEYS.liabilities, [])
  );

  const [snapshots, setSnapshots] = useState<Snapshot[]>(() =>
    loadFromStorage<Snapshot[]>(STORAGE_KEYS.snapshots, [])
  );

  const [isPremium, setIsPremiumState] = useState<boolean>(() =>
    loadFromStorage<boolean>(STORAGE_KEYS.isPremium, false)
  );

  // Persist whenever state changes
  useEffect(() => { saveToStorage(STORAGE_KEYS.assets, assets); }, [assets]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.liabilities, liabilities); }, [liabilities]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.snapshots, snapshots); }, [snapshots]);
  useEffect(() => { saveToStorage(STORAGE_KEYS.isPremium, isPremium); }, [isPremium]);

  // ─── Calculations ───────────────────────────────────────────────────────────

  const getTotalAssets = (): number =>
    assets.reduce((sum, a) => sum + a.balance, 0);

  const getTotalLiabilities = (): number =>
    liabilities.reduce((sum, l) => sum + l.balance, 0);

  const getNetWorth = (): number =>
    getTotalAssets() - getTotalLiabilities();

  // ─── Assets ─────────────────────────────────────────────────────────────────

  const addAsset = (name: string, balance: number, category: AssetCategory, currency: string) => {
    const newAsset: Asset = {
      id: uuidv4(),
      name,
      balance,
      category,
      currency,
      createdAt: new Date().toISOString(),
    };
    setAssets(prev => [...prev, newAsset]);
  };

  const updateAsset = (id: string, data: Partial<Asset>) => {
    setAssets(prev => prev.map(a => (a.id === id ? { ...a, ...data } : a)));
  };

  const deleteAsset = (id: string) => {
    setAssets(prev => prev.filter(a => a.id !== id));
  };

  // ─── Liabilities ────────────────────────────────────────────────────────────

  const addLiability = (name: string, balance: number, category: LiabilityCategory, currency: string) => {
    const newLiability: Liability = {
      id: uuidv4(),
      name,
      balance,
      category,
      currency,
      createdAt: new Date().toISOString(),
    };
    setLiabilities(prev => [...prev, newLiability]);
  };

  const updateLiability = (id: string, data: Partial<Liability>) => {
    setLiabilities(prev => prev.map(l => (l.id === id ? { ...l, ...data } : l)));
  };

  const deleteLiability = (id: string) => {
    setLiabilities(prev => prev.filter(l => l.id !== id));
  };

  // ─── Snapshots ──────────────────────────────────────────────────────────────

  const createSnapshot = () => {
    const totalAssets = getTotalAssets();
    const totalLiabilities = getTotalLiabilities();
    const netWorth = totalAssets - totalLiabilities;

    const snapshotAccounts: SnapshotAccount[] = [
      ...assets.map(a => ({
        id: a.id,
        name: a.name,
        type: 'asset' as const,
        balance: a.balance,
        currency: a.currency,
        category: a.category,
      })),
      ...liabilities.map(l => ({
        id: l.id,
        name: l.name,
        type: 'liability' as const,
        balance: l.balance,
        currency: l.currency,
        category: l.category,
      })),
    ];

    const newSnapshot: Snapshot = {
      id: uuidv4(),
      date: new Date().toISOString(),
      totalAssets,
      totalLiabilities,
      netWorth,
      accounts: snapshotAccounts,
    };

    setSnapshots(prev => [...prev, newSnapshot]);
  };

  const deleteSnapshot = (id: string) => {
    setSnapshots(prev => prev.filter(s => s.id !== id));
  };

  const getHistoricalNetWorth = (startDate?: string, endDate?: string) => {
    let filtered = [...snapshots].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    if (startDate) {
      filtered = filtered.filter(s => new Date(s.date) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(s => new Date(s.date) <= new Date(endDate));
    }

    return filtered.map(s => ({
      date: s.date,
      netWorth: s.netWorth,
      totalAssets: s.totalAssets,
      totalLiabilities: s.totalLiabilities,
    }));
  };

  // ─── Premium ────────────────────────────────────────────────────────────────

  const setIsPremium = (status: boolean) => {
    setIsPremiumState(status);
  };

  // ─── Legacy compatibility ───────────────────────────────────────────────────

  const updateBalances = (_accountId: string, _date: string, _balance: number) => {
    // No-op — replaced by createSnapshot
  };

  const getHistoricalDates = (): string[] =>
    snapshots.map(s => s.date);

  // ─── Context value ──────────────────────────────────────────────────────────

  const value: FinancialContextType = {
    assets,
    addAsset,
    updateAsset,
    deleteAsset,
    getTotalAssets,

    liabilities,
    addLiability,
    updateLiability,
    deleteLiability,
    getTotalLiabilities,

    getNetWorth,

    snapshots,
    createSnapshot,
    deleteSnapshot,
    getHistoricalNetWorth,

    isPremium,
    setIsPremium,

    // Legacy
    balanceHistory: snapshots,
    updateBalances,
    getHistoricalDates,
  };

  return (
    <FinancialContext.Provider value={value}>
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};
