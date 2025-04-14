
import { ArrowDown, ArrowUp, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinancial } from "@/context/FinancialContext";
import { cn } from "@/lib/utils";

export const NetWorthSummary = () => {
  const { getNetWorth, getTotalAssets, getTotalLiabilities, getHistoricalNetWorth } = useFinancial();
  
  const netWorth = getNetWorth();
  const totalAssets = getTotalAssets();
  const totalLiabilities = getTotalLiabilities();
  
  // Calculate change from previous period
  const netWorthHistory = getHistoricalNetWorth();
  let percentChange = 0;
  
  if (netWorthHistory.length > 1) {
    const current = netWorthHistory[netWorthHistory.length - 1].netWorth;
    const previous = netWorthHistory[netWorthHistory.length - 2].netWorth;
    
    if (previous !== 0) {
      percentChange = ((current - previous) / Math.abs(previous)) * 100;
    }
  }
  
  // Format amounts as currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0 
    }).format(amount);
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Assets Card */}
      <Card className="bg-[#1A1F2C]/90 shadow-lg border-[#33C3F0]/10 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-medium text-[#A0AEC0] flex items-center">
            <div className="mr-2 h-8 w-8 rounded-full bg-[#33C3F0]/10 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-[#33C3F0]" />
            </div>
            Total Assets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl sm:text-3xl font-bold text-green-400">{formatCurrency(totalAssets)}</div>
            <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <ArrowUp className="h-5 w-5 text-green-500" />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Net Worth Change Card */}
      <Card className="bg-[#1A1F2C]/90 shadow-lg border-[#33C3F0]/10 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-medium text-[#A0AEC0] flex items-center">
            <div className="mr-2 h-8 w-8 rounded-full bg-[#9b87f5]/10 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-[#9b87f5]" />
            </div>
            Change
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-baseline">
              <span className="text-2xl sm:text-3xl font-bold">{percentChange !== 0 ? `${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(1)}%` : '—'}</span>
            </div>
            {percentChange !== 0 && (
              <div className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center",
                percentChange >= 0 ? "bg-green-500/10" : "bg-red-500/10" 
              )}>
                {percentChange >= 0 ? (
                  <ArrowUp className="h-5 w-5 text-green-500" />
                ) : (
                  <ArrowDown className="h-5 w-5 text-red-500" />
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Liabilities Card */}
      <Card className="bg-[#1A1F2C]/90 shadow-lg border-[#33C3F0]/10 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-medium text-[#A0AEC0] flex items-center">
            <div className="mr-2 h-8 w-8 rounded-full bg-[#F97316]/10 flex items-center justify-center">
              <DollarSign className="h-4 w-4 text-[#F97316]" />
            </div>
            Total Liabilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl sm:text-3xl font-bold text-red-400">{formatCurrency(totalLiabilities)}</div>
            <div className="h-10 w-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <ArrowDown className="h-5 w-5 text-red-500" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
