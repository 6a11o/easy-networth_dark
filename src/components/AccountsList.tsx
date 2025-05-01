import { Edit, Trash, LockIcon, Banknote, LineChart, Bitcoin, Home, PiggyBank, Briefcase, CreditCard, Landmark, Coins, SmilePlus } from "lucide-react";
import { useFinancial } from "@/context/FinancialContext";
import { useCurrency } from "@/context/CurrencyContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Asset, Liability, AssetCategory, LiabilityCategory, assetCategoryLabels, liabilityCategoryLabels, assetCategoryColors, liabilityCategoryColors } from "@/types";
import { toast } from "sonner";
import { convertCurrency, formatAmountWithCurrency } from '@/utils/currencyUtils';
import { availableCurrencies } from '@/context/CurrencyContext';
import React from "react";

interface AccountsListProps {
  type?: "assets" | "liabilities";
}

// Category icon mapping
const categoryIcons: Record<string, JSX.Element> = {
  bank: <Banknote className="w-5 h-5" />, // Bank Accounts
  stocks: <LineChart className="w-5 h-5" />, // Stocks
  crypto: <Bitcoin className="w-5 h-5" />, // Crypto
  investment: <Briefcase className="w-5 h-5" />, // Investments
  realestate: <Home className="w-5 h-5" />, // Real Estate
  other: <PiggyBank className="w-5 h-5" />, // Other Assets
  mortgage: <Landmark className="w-5 h-5" />, // Mortgages
  creditcard: <CreditCard className="w-5 h-5" />, // Credit Cards
  loan: <Coins className="w-5 h-5" />, // Loans
};

// Helper to get color for a category
const getCategoryColor = (category: string, isAsset: boolean) => {
  return isAsset
    ? assetCategoryColors[category as keyof typeof assetCategoryColors] || '#33C3F0'
    : liabilityCategoryColors[category as keyof typeof liabilityCategoryColors] || '#f87171';
};

// Helper to get icon for a category
const getCategoryIcon = (category: string) => {
  return categoryIcons[category] || <PiggyBank className="w-5 h-5" />;
};

// Helper to get all accounts in a category
const getAccountsInCategory = (accounts: (Asset | Liability)[], category: string) => {
  return accounts.filter(acc => acc.category === category);
};

export const AccountsList = ({ type = "assets" }: AccountsListProps) => {
  const { 
    assets, 
    liabilities, 
    updateAsset, 
    updateLiability, 
    deleteAsset, 
    deleteLiability,
    isPremium,
    setIsPremium,
    getTotalAssets,
    getTotalLiabilities
  } = useFinancial();
  const { currency: mainCurrency, formatAmount } = useCurrency();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [editType, setEditType] = useState<"asset" | "liability">("asset");
  const [editingItem, setEditingItem] = useState<Asset | Liability | null>(null);
  
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [category, setCategory] = useState("");
  
  // Drag-and-drop state
  const initialAccounts: (Asset | Liability)[] = type === "assets" ? assets : liabilities;
  const [orderedAccounts, setOrderedAccounts] = useState<(Asset | Liability)[]>(initialAccounts);
  const dragItem = useRef<number | null>(null);
  const dragOverItem = useRef<number | null>(null);

  // Keep orderedAccounts in sync with context changes
  React.useEffect(() => {
    setOrderedAccounts(type === "assets" ? assets : liabilities);
  }, [assets, liabilities, type]);

  // Drag handlers
  const handleDragStart = (index: number) => {
    dragItem.current = index;
  };
  const handleDragEnter = (index: number) => {
    dragOverItem.current = index;
  };
  const handleDragEnd = () => {
    const from = dragItem.current;
    const to = dragOverItem.current;
    if (from === null || to === null || from === to) {
      dragItem.current = null;
      dragOverItem.current = null;
      return;
    }
    const updated = [...orderedAccounts];
    const [moved] = updated.splice(from, 1);
    updated.splice(to, 0, moved);
    setOrderedAccounts(updated);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  // Handle edit dialog open
  const handleEdit = (item: Asset | Liability, type: "asset" | "liability") => {
    setEditType(type);
    setEditingItem(item);
    setName(item.name);
    setBalance(item.balance.toString());
    setCategory(item.category);
    setIsDialogOpen(true);
  };
  
  // Handle save changes
  const handleSave = () => {
    if (!editingItem) return;
    
    try {
      if (editType === "asset") {
        updateAsset(editingItem.id, {
          name: editingItem.name,
          balance: editingItem.balance,
          category: editingItem.category as AssetCategory,
          currency: editingItem.currency
        });
      } else {
        updateLiability(editingItem.id, {
          name: editingItem.name,
          balance: editingItem.balance,
          category: editingItem.category as LiabilityCategory,
          currency: editingItem.currency
        });
      }
      setIsDialogOpen(false);
      toast.success("Account updated successfully");
    } catch (error) {
      toast.error("Failed to update account");
    }
  };
  
  // Handle delete confirmation
  const handleDeleteConfirm = () => {
    if (!editingItem) return;
    try {
      if (editType === "asset") {
        deleteAsset(editingItem.id);
        setOrderedAccounts(prev => prev.filter(acc => acc.id !== editingItem.id));
      } else {
        deleteLiability(editingItem.id);
        setOrderedAccounts(prev => prev.filter(acc => acc.id !== editingItem.id));
      }
      setIsDeleteDialogOpen(false);
      toast.success("Account deleted successfully");
      
      // Recalculate percentages for accounts in the same category
      const remainingAccounts = editType === "asset" ? assets : liabilities;
      const accountsInCategory = remainingAccounts.filter(acc => acc.category === editingItem.category);
      const totalInCategory = accountsInCategory.reduce((sum, acc) => sum + acc.balance, 0);
      
      // Update the ordered accounts with new percentages
      setOrderedAccounts(prev => prev.map(acc => {
        if (acc.category === editingItem.category) {
          return {
            ...acc,
            percentOfCategory: totalInCategory > 0 ? (acc.balance / totalInCategory) * 100 : 100
          };
        }
        return acc;
      }));
    } catch (error) {
      toast.error("Failed to delete account");
    }
  };
  
  // Handle delete button click
  const handleDeleteClick = (item: Asset | Liability, type: "asset" | "liability") => {
    setEditType(type);
    setEditingItem(item);
    setIsDeleteDialogOpen(true);
  };

  // Handle premium upgrade
  const handleUpgradeToPremium = () => {
    setIsPremium(true);
    toast.success("Upgraded to Pro successfully");
  };
  
  // Determine which accounts to display based on the type prop
  const accountsToDisplay = type === "assets" ? assets : liabilities;
  const isAssetType = type === "assets";
  
  // Check if the account limit is approaching or has been reached
  const isApproachingLimit = isAssetType 
    ? !isPremium && assets.length >= 2 && assets.length < 3
    : !isPremium && liabilities.length >= 1 && liabilities.length < 2;
  
  const isAtLimit = isAssetType
    ? !isPremium && assets.length >= 3
    : !isPremium && liabilities.length >= 2;

  const renderAccountItem = (item: Asset | Liability, index: number) => {
    const isAsset = 'category' in item && item.category in assetCategoryLabels;
    const categoryLabels = isAsset ? assetCategoryLabels : liabilityCategoryLabels;
    const allAccounts = isAsset ? assets : liabilities;
    
    // Convert all balances to main currency before calculating percentages
    const convertedBalance = convertCurrency(item.balance, item.currency, mainCurrency.code);
    const accountsInCategory = allAccounts.filter(acc => acc.category === item.category);
    const totalInCategory = accountsInCategory.reduce((sum, acc) => 
      sum + convertCurrency(acc.balance, acc.currency, mainCurrency.code), 0);
    const percentOfCategory = totalInCategory > 0 ? (convertedBalance / totalInCategory) * 100 : 100;
    
    const color = getCategoryColor(item.category, isAsset);
    const icon = getCategoryIcon(item.category);

    return (
      <div
        key={item.id}
        className="flex items-center justify-between rounded-lg shadow bg-[#181B23] border border-[#23263A] mb-2 p-2 group transition-all hover:shadow-lg cursor-move"
        style={{ borderLeft: `3px solid ${color}` }}
        draggable
        onDragStart={() => handleDragStart(index)}
        onDragEnter={() => handleDragEnter(index)}
        onDragEnd={handleDragEnd}
        onDragOver={e => e.preventDefault()}
        aria-grabbed={dragItem.current === index}
      >
        {/* Left section - Icon and main info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          {/* Icon */}
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${color}20` }}>
            {React.cloneElement(icon, { className: 'w-4 h-4', style: { color } })}
          </div>
          
          {/* Main info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-white truncate" title={item.name}>{item.name}</span>
              <span className="text-xs text-gray-400">{categoryLabels[item.category as keyof typeof categoryLabels]}</span>
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-sm font-bold text-white">{formatAmountWithCurrency(item.balance, item.currency)}</span>
              {item.currency !== mainCurrency.code && (
                <span className="text-xs text-gray-400">{formatAmount(convertedBalance)} in {mainCurrency.code}</span>
              )}
            </div>
          </div>
        </div>

        {/* Right section - Progress bar and actions */}
        <div className="flex items-center gap-3 ml-2">
          {/* Progress bar */}
          <div className="flex items-center gap-1.5 w-24">
            <div className="flex-1 h-1.5 rounded-full bg-[#23263A] overflow-hidden">
              <div
                className="h-1.5 rounded-full transition-all"
                style={{ width: `${percentOfCategory}%`, background: color }}
              />
            </div>
            <span className="text-[10px] text-gray-300 font-semibold">{percentOfCategory.toFixed(0)}%</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-[#23263A]"
              onClick={() => handleEdit(item, isAsset ? 'asset' : 'liability')}
            >
              <Edit className="h-3.5 w-3.5 text-gray-400 group-hover:text-primary" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 hover:bg-[#23263A]"
              onClick={() => handleDeleteClick(item, isAsset ? 'asset' : 'liability')}
            >
              <Trash className="h-3.5 w-3.5 text-gray-400 group-hover:text-red-400" />
            </Button>
            <span className="text-gray-400 cursor-move text-base px-1" title="Drag to reorder">≡</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="space-y-4">
        {/* Free Trial Limitation Warning */}
        {!isPremium && (isApproachingLimit || isAtLimit) && (
          <Card className="bg-primary/10 border border-primary/30 mb-4">
            <CardContent className="py-6">
              <div className="text-center">
                <div className="flex justify-center mb-2">
                  <LockIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium text-lg mb-2">
                  {isAtLimit ? "Free Trial Limit Reached" : "Free Trial Limit Approaching"}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {isAssetType
                    ? `Free trial is limited to 3 asset accounts. ${isAtLimit ? "You\'ve reached this limit." : "You\'re approaching this limit."}`
                    : `Free trial is limited to 2 liability accounts. ${isAtLimit ? "You\'ve reached this limit." : "You\'re approaching this limit."}`
                  }
                </p>
                <Button onClick={handleUpgradeToPremium} className="bg-[#33C3F0] hover:bg-[#33C3F0]/90 text-[#081924] font-semibold">
                  Upgrade to Pro
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {orderedAccounts.length > 0 ? (
          <div className="space-y-2 sm:space-y-3">
            {orderedAccounts.map((item, idx) => renderAccountItem(item, idx))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-[#7A7F92] bg-[#1A1F2C]/40 rounded-lg border border-[#1A1F2C]/90 shadow-inner px-4 text-center">
            {isAssetType ? (
              <>
                <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-[#1A1F2C]/80 flex items-center justify-center mb-3 sm:mb-4 border border-[#33C3F0]/10">
                  <span className="text-2xl sm:text-3xl opacity-20">+</span>
                </div>
                <p className="text-base sm:text-lg mb-0.5 sm:mb-1">No assets added yet.</p>
                <p className="text-xs sm:text-sm mb-3 sm:mb-4">Add assets to track your net worth.</p>
                <Button variant="outline" size="sm" className="border-[#33C3F0]/20 hover:bg-[#33C3F0]/10 text-[#33C3F0] text-sm">
                  Add Asset
                </Button>
              </>
            ) : (
              <>
                <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-[#1A1F2C]/80 flex items-center justify-center mb-3 sm:mb-4 border border-green-400/10">
                  <SmilePlus className="w-6 h-6 sm:w-8 sm:h-8 text-green-400/80" />
                </div>
                <p className="text-base sm:text-lg mb-0.5 sm:mb-1 text-green-400">Debt-free and in control. You're winning!</p>
                <p className="text-xs sm:text-sm mb-3 sm:mb-4">Keep up the great work with your financial journey.</p>
              </>
            )}
          </div>
        )}
      </div>
      
      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#131620] border border-[#33C3F0]/20 w-[90vw] max-w-[425px] p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Edit {editType === "asset" ? "Asset" : "Liability"}</DialogTitle>
            <DialogDescription className="text-sm">
              Update the details of your {editType === "asset" ? "asset" : "liability"} account.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-3 sm:py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={editingItem?.name || ''}
                onChange={(e) => setEditingItem(prev => prev ? { ...prev, name: e.target.value } : null)}
                className="bg-[#1A1F2C] border-[#33C3F0]/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="balance">Balance</Label>
              <Input
                id="balance"
                type="number"
                value={editingItem?.balance || ''}
                onChange={(e) => setEditingItem(prev => prev ? { ...prev, balance: parseFloat(e.target.value) } : null)}
                className="bg-[#1A1F2C] border-[#33C3F0]/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currency">Currency</Label>
              <Select
                value={editingItem?.currency || mainCurrency.code}
                onValueChange={(value) => setEditingItem(prev => prev ? { ...prev, currency: value } : null)}
              >
                <SelectTrigger className="bg-[#1A1F2C] border-[#33C3F0]/20">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1F2C] border-[#33C3F0]/20">
                  {availableCurrencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.name} ({currency.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={editingItem?.category || ''}
                onValueChange={(value) => setEditingItem(prev => {
                  if (!prev) return null;
                  return {
                    ...prev,
                    category: editType === 'asset' ? value as AssetCategory : value as LiabilityCategory
                  };
                })}
              >
                <SelectTrigger className="bg-[#1A1F2C] border-[#33C3F0]/20">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1F2C] border-[#33C3F0]/20">
                  {editType === 'asset'
                    ? Object.entries(assetCategoryLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))
                    : Object.entries(liabilityCategoryLabels).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="border-[#33C3F0]/20 hover:bg-[#1A1F2C]">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-[#33C3F0] hover:bg-[#33C3F0]/90 text-black">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-[#131620] border border-[#33C3F0]/20">
          <DialogHeader>
            <DialogTitle>Delete {editType === "asset" ? "Asset" : "Liability"}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="border-[#33C3F0]/20 hover:bg-[#1A1F2C]">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
