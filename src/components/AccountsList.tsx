
import { Edit, Trash, DollarSign } from "lucide-react";
import { useFinancial } from "@/context/FinancialContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Asset, Liability, assetCategoryLabels, liabilityCategoryLabels } from "@/types";
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
    deleteLiability 
  } = useFinancial();
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const [editType, setEditType] = useState<"asset" | "liability">("asset");
  const [editingItem, setEditingItem] = useState<Asset | Liability | null>(null);
  
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [category, setCategory] = useState("");
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0 
    }).format(amount);
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
  
  // Determine which accounts to display based on the type prop
  const accountsToDisplay = type === "assets" ? assets : liabilities;
  const isAssetType = type === "assets";
  
  return (
    <>
      <div className="space-y-4">
        {accountsToDisplay.length > 0 ? (
          accountsToDisplay.map((item) => (
            <div 
              key={item.id}
              className="flex items-center justify-between p-3 bg-secondary/50 rounded-md border border-white/5"
            >
              <div className="flex items-center">
                <span className={cn(
                  "w-2 h-8 mr-3 rounded-sm",
                  isAssetType 
                    ? `bg-asset-${item.category}` 
                    : `bg-liability-${item.category}`
                )} />
                <div>
                  <h4 className="font-medium">{item.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {isAssetType 
                      ? assetCategoryLabels[item.category as keyof typeof assetCategoryLabels]
                      : liabilityCategoryLabels[item.category as keyof typeof liabilityCategoryLabels]
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`font-medium ${isAssetType ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(item.balance)}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleEdit(item, isAssetType ? "asset" : "liability")}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleDeleteClick(item, isAssetType ? "asset" : "liability")}
                >
                  <Trash className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
            <DollarSign className="h-8 w-8 mb-2 opacity-20" />
            <p>No {isAssetType ? 'assets' : 'liabilities'} added yet.</p>
            <p className="text-sm">Add {isAssetType ? 'assets' : 'liabilities'} to track your net worth.</p>
          </div>
        )}
      </div>
      
      {/* Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {editType === "asset" ? "Asset" : "Liability"}</DialogTitle>
            <DialogDescription>
              Make changes to your {editType}. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Account name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="balance">Balance</Label>
              <Input
                id="balance"
                type="number"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {editType === "asset" ? (
                    Object.entries(assetCategoryLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))
                  ) : (
                    Object.entries(liabilityCategoryLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {editType === "asset" ? "Asset" : "Liability"}</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this account? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
