import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useFinancial } from "@/context/FinancialContext";
import { toast } from "sonner";

interface UpdateBalancesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpdateBalancesModal = ({ isOpen, onClose }: UpdateBalancesModalProps) => {
  const { assets, liabilities, updateAsset, updateLiability, createSnapshot } = useFinancial();

  const [assetBalances, setAssetBalances] = useState<{ id: string; balance: number }[]>([]);
  const [liabilityBalances, setLiabilityBalances] = useState<{ id: string; balance: number }[]>([]);

  // Load current balances when modal opens
  useEffect(() => {
    if (isOpen) {
      setAssetBalances(assets.map(a => ({ id: a.id, balance: a.balance })));
      setLiabilityBalances(liabilities.map(l => ({ id: l.id, balance: l.balance })));
    }
  }, [isOpen, assets, liabilities]);

  const handleAssetChange = (id: string, value: string) => {
    const num = value === "" ? 0 : parseFloat(value);
    setAssetBalances(prev => prev.map(a => a.id === id ? { ...a, balance: num } : a));
  };

  const handleLiabilityChange = (id: string, value: string) => {
    const num = value === "" ? 0 : parseFloat(value);
    setLiabilityBalances(prev => prev.map(l => l.id === id ? { ...l, balance: num } : l));
  };

  const handleSave = () => {
    // Update all asset balances
    for (const item of assetBalances) {
      updateAsset(item.id, { balance: item.balance });
    }

    // Update all liability balances
    for (const item of liabilityBalances) {
      updateLiability(item.id, { balance: item.balance });
    }

    // Save snapshot immediately after updating
    createSnapshot();

    toast.success("Balances updated and entry saved.");
    onClose();
  };

  const hasAccounts = assets.length > 0 || liabilities.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Update Balances</DialogTitle>
          <DialogDescription>
            Enter your current balances. A new entry will be saved automatically.
          </DialogDescription>
        </DialogHeader>

        {!hasAccounts ? (
          <div className="py-6 text-center text-muted-foreground text-sm">
            No accounts found. Add accounts first from the Accounts page.
          </div>
        ) : (
          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-1">

            {/* Assets */}
            {assets.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-green-400 text-sm uppercase tracking-wide">Assets</h3>
                {assets.map(asset => (
                  <div key={asset.id} className="flex items-center justify-between gap-4">
                    <Label className="flex-grow text-sm text-[#CBD5E1]">{asset.name}</Label>
                    <Input
                      type="number"
                      value={assetBalances.find(a => a.id === asset.id)?.balance ?? 0}
                      onChange={e => handleAssetChange(asset.id, e.target.value)}
                      className="w-36 text-right"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Liabilities */}
            {liabilities.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-medium text-red-400 text-sm uppercase tracking-wide">Liabilities</h3>
                {liabilities.map(liability => (
                  <div key={liability.id} className="flex items-center justify-between gap-4">
                    <Label className="flex-grow text-sm text-[#CBD5E1]">{liability.name}</Label>
                    <Input
                      type="number"
                      value={liabilityBalances.find(l => l.id === liability.id)?.balance ?? 0}
                      onChange={e => handleLiabilityChange(liability.id, e.target.value)}
                      className="w-36 text-right"
                    />
                  </div>
                ))}
              </div>
            )}

          </div>
        )}

        <DialogFooter className="gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          {hasAccounts && (
            <Button
              onClick={handleSave}
              className="bg-[#33C3F0] hover:bg-[#1AAFDE] text-black font-bold"
            >
              Save Entry
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
