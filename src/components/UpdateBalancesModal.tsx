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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useFinancial } from "@/context/FinancialContext";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface UpdateBalancesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UpdateBalancesModal = ({ isOpen, onClose }: UpdateBalancesModalProps) => {
  const [activeTab, setActiveTab] = useState("today");
  
  const { assets, liabilities, updateBalances, isPremium, setIsPremium } = useFinancial();
  
  // Today's balance state
  const [todayBalances, setTodayBalances] = useState<{ id: string; balance: number }[]>([]);
  
  // Historical data state
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [historicalBalances, setHistoricalBalances] = useState<{ id: string; balance: number }[]>([]);
  
  // Initialize balance states
  useEffect(() => {
    if (isOpen) {
      // Initialize today's balances with current values
      const initialBalances = [
        ...assets.map(asset => ({ id: asset.id, balance: asset.balance })),
        ...liabilities.map(liability => ({ id: liability.id, balance: liability.balance }))
      ];
      setTodayBalances(initialBalances);
      
      // Initialize historical balances with current values
      setHistoricalBalances([...initialBalances]);
    }
  }, [assets, liabilities, isOpen]);
  
  // Handle today's balance changes
  const handleTodayBalanceChange = (id: string, value: string) => {
    const numValue = value === "" ? 0 : parseFloat(value);
    
    setTodayBalances(prev => 
      prev.map(item => 
        item.id === id ? { ...item, balance: numValue } : item
      )
    );
  };
  
  // Handle historical balance changes
  const handleHistoricalBalanceChange = (id: string, value: string) => {
    const numValue = value === "" ? 0 : parseFloat(value);
    
    setHistoricalBalances(prev => 
      prev.map(item => 
        item.id === id ? { ...item, balance: numValue } : item
      )
    );
  };
  
  // Handle premium upgrade
  const handleUpgradeToPremium = () => {
    setIsPremium(true);
    toast.success("Upgraded to Premium! You now have access to all features.");
    setActiveTab("historical");
  };
  
  // Handle submit
  const handleSubmit = () => {
    try {
      if (activeTab === "historical" && !selectedDate) {
        toast.error("Please select a date");
        return;
      }
      
      // Get date in YYYY-MM-DD format
      const date = activeTab === "today" 
        ? format(new Date(), 'yyyy-MM-dd')
        : format(selectedDate!, 'yyyy-MM-dd');
      
      // Validate historical date is not in the future
      if (activeTab === "historical") {
        const today = new Date();
        if (selectedDate! > today) {
          toast.error("Cannot add data for future dates");
          return;
        }
      }
      
      // Use the appropriate balance set based on active tab
      const balances = activeTab === "today" ? todayBalances : historicalBalances;
      
      // Update balances for each account individually
      for (const item of balances) {
        updateBalances(item.id, date, item.balance);
      }
      
      toast.success(`Balances updated for ${activeTab === "today" ? "today" : format(selectedDate!, 'MMM d, yyyy')}`);
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Update Balances</DialogTitle>
          <DialogDescription>
            Update your account balances for today or add historical data.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="today">Today's Balance</TabsTrigger>
            <TabsTrigger value="historical" disabled={!isPremium && assets.length + liabilities.length > 0}>
              Historical Data
              {!isPremium && <span className="ml-1 text-xs text-yellow-300 font-medium">Premium</span>}
            </TabsTrigger>
          </TabsList>
          
          {/* Today's Balance Tab */}
          <TabsContent value="today">
            <div className="space-y-5 max-h-[min(60vh,500px)] overflow-y-auto pr-2">
              {/* Assets */}
              <div className="space-y-3">
                <h3 className="font-medium text-primary text-base">Assets</h3>
                {assets.length > 0 ? (
                  assets.map(asset => (
                    <div key={asset.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <Label className="flex-grow">{asset.name}</Label>
                      <Input
                        type="number"
                        value={todayBalances.find(b => b.id === asset.id)?.balance || 0}
                        onChange={(e) => handleTodayBalanceChange(asset.id, e.target.value)}
                        className="w-full sm:w-32"
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No assets found.</p>
                )}
              </div>
              
              {/* Liabilities */}
              <div className="space-y-3">
                <h3 className="font-medium text-primary text-base">Liabilities</h3>
                {liabilities.length > 0 ? (
                  liabilities.map(liability => (
                    <div key={liability.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                      <Label className="flex-grow">{liability.name}</Label>
                      <Input
                        type="number"
                        value={todayBalances.find(b => b.id === liability.id)?.balance || 0}
                        onChange={(e) => handleTodayBalanceChange(liability.id, e.target.value)}
                        className="w-full sm:w-32"
                      />
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No liabilities found.</p>
                )}
              </div>
            </div>
          </TabsContent>
          
          {/* Historical Data Tab */}
          <TabsContent value="historical">
            {isPremium ? (
              <>
                <div className="mb-5">
                  <Label>Select Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal mt-2",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                        disabled={(date) => date > new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="space-y-5 max-h-[min(50vh,400px)] overflow-y-auto pr-2">
                  {/* Assets */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-primary text-base">Assets</h3>
                    {assets.length > 0 ? (
                      assets.map(asset => (
                        <div key={asset.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <Label className="flex-grow">{asset.name}</Label>
                          <Input
                            type="number"
                            value={historicalBalances.find(b => b.id === asset.id)?.balance || 0}
                            onChange={(e) => handleHistoricalBalanceChange(asset.id, e.target.value)}
                            className="w-full sm:w-32"
                          />
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No assets found.</p>
                    )}
                  </div>
                  
                  {/* Liabilities */}
                  <div className="space-y-3">
                    <h3 className="font-medium text-primary text-base">Liabilities</h3>
                    {liabilities.length > 0 ? (
                      liabilities.map(liability => (
                        <div key={liability.id} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                          <Label className="flex-grow">{liability.name}</Label>
                          <Input
                            type="number"
                            value={historicalBalances.find(b => b.id === liability.id)?.balance || 0}
                            onChange={(e) => handleHistoricalBalanceChange(liability.id, e.target.value)}
                            className="w-full sm:w-32"
                          />
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No liabilities found.</p>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="p-6 text-center">
                <h3 className="text-lg font-medium mb-2">Premium Feature</h3>
                <p className="text-muted-foreground mb-4">
                  Free accounts can only add up to 3 historical data points. Upgrade to premium for unlimited data tracking.
                </p>
                <Button onClick={handleUpgradeToPremium}>Upgrade to Premium</Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="sm:justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
