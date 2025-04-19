import { Edit, Trash, LockIcon } from "lucide-react";
import { useFinancial } from "@/context/FinancialContext";
import { useCurrency } from "@/context/CurrencyContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useState } from "react";
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
import { Asset, Liability, assetCategoryLabels, liabilityCategoryLabels, assetCategoryColors, liabilityCategoryColors } from "@/types";
import { toast } from "sonner";

interface AccountsListProps {
  type?: "assets" | "liabilities";
}

export const AccountsList = ({ type = "assets" }: AccountsListProps) => {
  const { 
    assets, 
    liabilities, 
    updateAsset, 
    updateLiability, 
    deleteAsset, 
    deleteLiability,
    isPremium,
    setIsPremium
  } = useFinancial();
  const { formatAmount } = useCurrency();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [editType, setEditType] = useState<"asset" | "liability">("asset");
  const [editingItem, setEditingItem] = useState<Asset | Liability | null>(null);
  
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [category, setCategory] = useState("");
  
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
      const balanceValue = parseFloat(balance);
      
      if (isNaN(balanceValue)) {
        toast.error("Please enter a valid balance");
        return;
      }
      
      if (editType === "asset") {
        updateAsset(editingItem.id, { 
          name, 
          balance: balanceValue, 
          category: category as any 
        });
      } else {
        updateLiability(editingItem.id, { 
          name, 
          balance: balanceValue,
          category: category as any 
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
      } else {
        deleteLiability(editingItem.id);
      }
      
      setIsDeleteDialogOpen(false);
      toast.success("Account deleted successfully");
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

        {accountsToDisplay.length > 0 ? (
          <div className="space-y-2 sm:space-y-3">
            {accountsToDisplay.map((item) => {
              // Determine the correct color map and category type
              const categoryColors = isAssetType ? assetCategoryColors : liabilityCategoryColors;
              const categoryKey = item.category as keyof typeof categoryColors;
              const color = categoryColors[categoryKey] || (isAssetType ? "#33C3F0" : "#f87171"); // Default color
              
              return (
                <div 
                  key={item.id}
                  className="flex flex-col xs:flex-row justify-between items-start xs:items-center p-2.5 sm:p-3 bg-[#1A1F2C]/60 rounded border border-[#1A1F2C]/90 shadow-md hover:shadow-lg transition-all hover:bg-[#1A1F2C]/80 gap-2 xs:gap-0"
                >
                  <div className="flex items-center w-full xs:w-auto">
                    <div className="w-1.5 sm:w-2 h-8 rounded-sm mr-2 sm:mr-3" style={{ backgroundColor: color }}></div>
                    <div>
                      <h4 className="font-medium text-sm sm:text-base">{item.name}</h4>
                      <p className="text-[10px] sm:text-xs text-[#7A7F92]">
                        {isAssetType 
                          ? assetCategoryLabels[item.category as keyof typeof assetCategoryLabels]
                          : liabilityCategoryLabels[item.category as keyof typeof liabilityCategoryLabels]
                        }
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full xs:w-auto justify-between xs:justify-end pl-3.5 xs:pl-0">
                    <span className={`font-medium text-sm sm:text-base ${isAssetType ? 'text-green-400' : 'text-red-400'}`}>
                      {formatAmount(item.balance)}
                    </span>
                    <div className="flex space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleEdit(item, isAssetType ? "asset" : "liability")}
                        className="h-7 w-7 sm:h-8 sm:w-8 rounded-full hover:bg-[#33C3F0]/10"
                      >
                        <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#33C3F0]" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDeleteClick(item, isAssetType ? "asset" : "liability")}
                        className="h-7 w-7 sm:h-8 sm:w-8 rounded-full hover:bg-red-400/10"
                      >
                        <Trash className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-400" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-[#7A7F92] bg-[#1A1F2C]/40 rounded-lg border border-[#1A1F2C]/90 shadow-inner px-4 text-center">
            <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-[#1A1F2C]/80 flex items-center justify-center mb-3 sm:mb-4 border border-[#33C3F0]/10">
              <span className="text-2xl sm:text-3xl opacity-20">{isAssetType ? '+' : '−'}</span>
            </div>
            <p className="text-base sm:text-lg mb-0.5 sm:mb-1">No {isAssetType ? 'assets' : 'liabilities'} added yet.</p>
            <p className="text-xs sm:text-sm mb-3 sm:mb-4">Add {isAssetType ? 'assets' : 'liabilities'} to track your net worth.</p>
            <Button variant="outline" size="sm" className="border-[#33C3F0]/20 hover:bg-[#33C3F0]/10 text-[#33C3F0] text-sm">
              Add {isAssetType ? 'Asset' : 'Liability'}
            </Button>
          </div>
        )}
      </div>
      
      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-[#131620] border border-[#33C3F0]/20 w-[90vw] max-w-[425px] p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Edit {editType === "asset" ? "Asset" : "Liability"}</DialogTitle>
            <DialogDescription className="text-sm">
              Make changes to your {editType}. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 sm:space-y-4 py-3 sm:py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-[#1A1F2C] border-[#33C3F0]/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="balance">Balance</Label>
              <Input
                id="balance"
                type="text"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                className="bg-[#1A1F2C] border-[#33C3F0]/20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="bg-[#1A1F2C] border-[#33C3F0]/20">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1F2C] border-[#33C3F0]/20">
                  {Object.entries(
                    editType === "asset" ? assetCategoryLabels : liabilityCategoryLabels
                  ).map(([value, label]) => (
                    <SelectItem key={value} value={value} className="focus:bg-[#33C3F0]/20">
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
              Save changes
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
