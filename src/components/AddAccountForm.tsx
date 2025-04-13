
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useFinancial } from "@/context/FinancialContext";
import { AssetCategory, LiabilityCategory, assetCategoryLabels, liabilityCategoryLabels } from "@/types";
import { toast } from "sonner";

export const AddAccountForm = () => {
  const [activeTab, setActiveTab] = useState("asset");
  
  // Asset form state
  const [assetName, setAssetName] = useState("");
  const [assetBalance, setAssetBalance] = useState("");
  const [assetCategory, setAssetCategory] = useState<AssetCategory>("bank");
  
  // Liability form state
  const [liabilityName, setLiabilityName] = useState("");
  const [liabilityBalance, setLiabilityBalance] = useState("");
  const [liabilityCategory, setLiabilityCategory] = useState<LiabilityCategory>("creditcard");
  
  const { addAsset, addLiability } = useFinancial();
  
  // Handle asset form submission
  const handleAssetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const balance = parseFloat(assetBalance);
      
      if (isNaN(balance)) {
        toast.error("Please enter a valid balance");
        return;
      }
      
      addAsset(assetName, balance, assetCategory);
      
      // Clear form
      setAssetName("");
      setAssetBalance("");
      setAssetCategory("bank");
      
      toast.success("Asset added successfully");
    } catch (error) {
      toast.error("Failed to add asset");
    }
  };
  
  // Handle liability form submission
  const handleLiabilitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const balance = parseFloat(liabilityBalance);
      
      if (isNaN(balance)) {
        toast.error("Please enter a valid balance");
        return;
      }
      
      addLiability(liabilityName, balance, liabilityCategory);
      
      // Clear form
      setLiabilityName("");
      setLiabilityBalance("");
      setLiabilityCategory("creditcard");
      
      toast.success("Liability added successfully");
    } catch (error) {
      toast.error("Failed to add liability");
    }
  };
  
  return (
    <Card className="mt-6 bg-card/50 backdrop-blur-sm border-white/10">
      <CardHeader>
        <CardTitle>Add New Account</CardTitle>
        <CardDescription>
          Add a new asset or liability to track in your net worth.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="asset">Asset</TabsTrigger>
            <TabsTrigger value="liability">Liability</TabsTrigger>
          </TabsList>
          
          <TabsContent value="asset">
            <form onSubmit={handleAssetSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="asset-name">Name</Label>
                <Input
                  id="asset-name"
                  value={assetName}
                  onChange={(e) => setAssetName(e.target.value)}
                  placeholder="e.g., Checking Account"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="asset-balance">Current Balance ($)</Label>
                <Input
                  id="asset-balance"
                  type="number"
                  value={assetBalance}
                  onChange={(e) => setAssetBalance(e.target.value)}
                  placeholder="0"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="asset-category">Category</Label>
                <Select 
                  value={assetCategory} 
                  onValueChange={(value) => setAssetCategory(value as AssetCategory)}
                >
                  <SelectTrigger id="asset-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(assetCategoryLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button type="submit" className="w-full">Add Asset</Button>
            </form>
          </TabsContent>
          
          <TabsContent value="liability">
            <form onSubmit={handleLiabilitySubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="liability-name">Name</Label>
                <Input
                  id="liability-name"
                  value={liabilityName}
                  onChange={(e) => setLiabilityName(e.target.value)}
                  placeholder="e.g., Credit Card"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="liability-balance">Current Balance ($)</Label>
                <Input
                  id="liability-balance"
                  type="number"
                  value={liabilityBalance}
                  onChange={(e) => setLiabilityBalance(e.target.value)}
                  placeholder="0"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="liability-category">Category</Label>
                <Select 
                  value={liabilityCategory} 
                  onValueChange={(value) => setLiabilityCategory(value as LiabilityCategory)}
                >
                  <SelectTrigger id="liability-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(liabilityCategoryLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Button type="submit" className="w-full">Add Liability</Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
