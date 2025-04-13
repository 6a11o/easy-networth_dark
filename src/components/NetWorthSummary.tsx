
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
      {/* Net Worth Card */}
      <Card className="bg-card/50 backdrop-blur-sm border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-medium text-muted-foreground">
            Net Worth
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div className="text-3xl font-bold">{formatCurrency(netWorth)}</div>
            {percentChange !== 0 && (
              <div className={cn(
                "flex items-center text-sm",
                percentChange >= 0 ? "text-green-500" : "text-red-500"
              )}>
                {percentChange >= 0 ? (
                  <ArrowUp className="mr-1 h-4 w-4" />
                ) : (
                  <ArrowDown className="mr-1 h-4 w-4" />
                )}
                {Math.abs(percentChange).toFixed(1)}%
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Total Assets Card */}
      <Card className="bg-card/50 backdrop-blur-sm border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-medium text-muted-foreground">
            Total Assets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-green-500">{formatCurrency(totalAssets)}</div>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
      
      {/* Total Liabilities Card */}
      <Card className="bg-card/50 backdrop-blur-sm border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-md font-medium text-muted-foreground">
            Total Liabilities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-3xl font-bold text-red-500">{formatCurrency(totalLiabilities)}</div>
            <DollarSign className="h-5 w-5 text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
