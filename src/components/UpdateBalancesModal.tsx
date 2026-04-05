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
import { useCurrency } from "@/context/CurrencyContext";
import { toast } from "sonner";
import { RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
 
interface UpdateBalancesModalProps {
  isOpen: boolean;
  onClose: () => void;
}
 
export const UpdateBalancesModal = ({ isOpen, onClose }: UpdateBalancesModalProps) => {
  const { assets, liabilities, updateAsset, updateLiability, createSnapshot } = useFinancial();
  const { formatAmount } = useCurrency();
 
  const [assetBalances, setAssetBalances] = useState<{ id: string; balance: number }[]>([]);
  const [liabilityBalances, setLiabilityBalances] = useState<{ id: string; balance: number }[]>([]);
 
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
 
  const previewAssets = assetBalances.reduce((sum, a) => sum + a.balance, 0);
  const previewLiabilities = liabilityBalances.reduce((sum, l) => sum + l.balance, 0);
  const previewNetWorth = previewAssets - previewLiabilities;
 
  const handleSave = () => {
    for (const item of assetBalances) {
      updateAsset(item.id, { balance: item.balance });
    }
    for (const item of liabilityBalances) {
      updateLiability(item.id, { balance: item.balance });
    }
    createSnapshot();
    toast.success("Entry saved successfully.");
    onClose();
  };
 
  const hasAccounts = assets.length > 0 || liabilities.length > 0;
 
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg w-full bg-[#0D1117] border border-[#33C3F0]/20 text-white shadow-2xl rounded-2xl p-0 overflow-hidden">
 
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-[#33C3F0]/10">
          <div className="flex items-center gap-3 mb-1">
            <div className="bg-[#1A1F2C] p-2 rounded-lg">
              <RefreshCw className="h-4 w-4 text-[#33C3F0]" />
            </div>
            <DialogTitle className="text-lg font-semibold text-white">
              Update Balances
            </DialogTitle>
          </div>
          <DialogDescription className="text-sm text-[#7A7F92] ml-11">
            Enter your current balances. A snapshot will be saved automatically.
          </DialogDescription>
        </div>
 
        {/* Live preview bar */}
        {hasAccounts && (
          <div className="px-6 py-3 bg-[#131620] border-b border-[#33C3F0]/10">
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-wide text-[#7A7F92] mb-0.5">Assets</p>
                <p className="text-sm font-bold text-green-400">{formatAmount(previewAssets)}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-wide text-[#7A7F92] mb-0.5">Net Worth</p>
                <p className={`text-sm font-bold ${previewNetWorth >= 0 ? 'text-[#33C3F0]' : 'text-red-400'}`}>
                  {formatAmount(previewNetWorth)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-wide text-[#7A7F92] mb-0.5">Liabilities</p>
                <p className="text-sm font-bold text-red-400">{formatAmount(previewLiabilities)}</p>
              </div>
            </div>
          </div>
        )}
 
        {/* Account inputs */}
        <div className="px-6 py-4 space-y-5 max-h-[45vh] overflow-y-auto">
          {!hasAccounts ? (
            <div className="py-8 text-center text-[#7A7F92] text-sm">
              No accounts found. Add accounts first from the Accounts page.
            </div>
          ) : (
            <>
              {/* Assets */}
              {assets.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-3.5 w-3.5 text-green-400" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-green-400">Assets</h3>
                  </div>
                  {assets.map(asset => (
                    <div
                      key={asset.id}
                      className="flex items-center justify-between gap-4 bg-[#131620] border border-[#33C3F0]/10 rounded-xl px-4 py-3 hover:border-[#33C3F0]/30 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">{asset.name}</p>
                        <p className="text-xs text-[#7A7F92] capitalize">{asset.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#7A7F92]">{asset.currency}</span>
                        <Input
                          type="number"
                          value={assetBalances.find(a => a.id === asset.id)?.balance ?? 0}
                          onChange={e => handleAssetChange(asset.id, e.target.value)}
                          className="w-32 text-right bg-[#0D1117] border-[#33C3F0]/20 text-white focus:border-[#33C3F0] focus:ring-0 rounded-lg"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
 
              {/* Liabilities */}
              {liabilities.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-3.5 w-3.5 text-red-400" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-red-400">Liabilities</h3>
                  </div>
                  {liabilities.map(liability => (
                    <div
                      key={liability.id}
                      className="flex items-center justify-between gap-4 bg-[#131620] border border-red-500/10 rounded-xl px-4 py-3 hover:border-red-500/30 transition-colors"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">{liability.name}</p>
                        <p className="text-xs text-[#7A7F92] capitalize">{liability.category}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#7A7F92]">{liability.currency}</span>
                        <Input
                          type="number"
                          value={liabilityBalances.find(l => l.id === liability.id)?.balance ?? 0}
                          onChange={e => handleLiabilityChange(liability.id, e.target.value)}
                          className="w-32 text-right bg-[#0D1117] border-red-500/20 text-white focus:border-red-400 focus:ring-0 rounded-lg"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
 
        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#33C3F0]/10 flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-[#33C3F0]/20 text-[#7A7F92] hover:text-white hover:border-[#33C3F0]/40 bg-transparent"
          >
            Cancel
          </Button>
          {hasAccounts && (
            <Button
              onClick={handleSave}
              className="bg-[#33C3F0] hover:bg-[#1AAFDE] text-black font-bold px-6 shadow-lg shadow-[#33C3F0]/20"
            >
              Save Entry
            </Button>
          )}
        </div>
 
      </DialogContent>
    </Dialog>
  );
};
 
