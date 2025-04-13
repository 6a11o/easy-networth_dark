
import { useState, useEffect } from "react";
import { useFinancial } from "@/context/FinancialContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowDownRight, ArrowUpRight, TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export const RecapSection = () => {
  const { getHistoricalDates, getHistoricalNetWorth, getTotalAssets, getTotalLiabilities } = useFinancial();
  
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [comparison, setComparison] = useState<{
    netWorthChange: number;
    netWorthChangePercent: number;
    assetsChange: number;
    assetsChangePercent: number;
    liabilitiesChange: number;
    liabilitiesChangePercent: number;
  }>({
    netWorthChange: 0,
    netWorthChangePercent: 0,
    assetsChange: 0,
    assetsChangePercent: 0,
    liabilitiesChange: 0,
    liabilitiesChangePercent: 0,
  });

  // Get available dates
  useEffect(() => {
    const dates = getHistoricalDates();
    setAvailableDates(dates);
    
    if (dates.length >= 2) {
      setStartDate(dates[0]);
      setEndDate(dates[dates.length - 1]);
    }
  }, [getHistoricalDates]);

  // Calculate comparison when dates change
  useEffect(() => {
    if (startDate && endDate) {
      const historicalData = getHistoricalNetWorth(startDate, endDate);
      
      if (historicalData.length >= 2) {
        const startData = historicalData[0];
        const endData = historicalData[historicalData.length - 1];
        
        // Calculate net worth changes
        const netWorthStart = startData.netWorth;
        const netWorthEnd = endData.netWorth;
        const netWorthChange = netWorthEnd - netWorthStart;
        const netWorthChangePercent = netWorthStart !== 0 
          ? (netWorthChange / Math.abs(netWorthStart)) * 100 
          : 0;
        
        // For assets and liabilities, we'll need to calculate for the specific dates
        // This is a simplified approach as we only have net worth per date
        const startDateData = getHistoricalNetWorth(startDate, startDate)[0];
        const endDateData = getHistoricalNetWorth(endDate, endDate)[0];
        
        // Calculate assets changes (approximate)
        const assetsStart = getTotalAssets(); // This is current, not historical
        const assetsEnd = getTotalAssets(); // This is current, not historical
        const assetsChange = assetsEnd - assetsStart;
        const assetsChangePercent = assetsStart !== 0 
          ? (assetsChange / Math.abs(assetsStart)) * 100 
          : 0;
        
        // Calculate liabilities changes (approximate)
        const liabilitiesStart = getTotalLiabilities(); // This is current, not historical
        const liabilitiesEnd = getTotalLiabilities(); // This is current, not historical
        const liabilitiesChange = liabilitiesEnd - liabilitiesStart;
        const liabilitiesChangePercent = liabilitiesStart !== 0 
          ? (liabilitiesChange / Math.abs(liabilitiesStart)) * 100 
          : 0;
        
        setComparison({
          netWorthChange,
          netWorthChangePercent,
          assetsChange,
          assetsChangePercent,
          liabilitiesChange,
          liabilitiesChangePercent
        });
      }
    }
  }, [startDate, endDate, getHistoricalNetWorth, getTotalAssets, getTotalLiabilities]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Historical Analysis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Date selectors */}
        <div>
          <label className="block text-sm font-medium mb-2">Start Date</label>
          <Select value={startDate} onValueChange={setStartDate}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select start date" />
            </SelectTrigger>
            <SelectContent>
              {availableDates.map((date) => (
                <SelectItem key={`start-${date}`} value={date}>
                  {new Date(date).toLocaleDateString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">End Date</label>
          <Select value={endDate} onValueChange={setEndDate}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select end date" />
            </SelectTrigger>
            <SelectContent>
              {availableDates.map((date) => (
                <SelectItem key={`end-${date}`} value={date}>
                  {new Date(date).toLocaleDateString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Comparison cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Net Worth Comparison */}
        <Card className="bg-[#2A2F42] border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium text-muted-foreground flex items-center">
              <span className="mr-2">Net Worth Change</span>
              {comparison.netWorthChange >= 0 ? 
                <TrendingUp className="h-4 w-4 text-green-500" /> : 
                <TrendingDown className="h-4 w-4 text-red-500" />
              }
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1">
              {formatCurrency(comparison.netWorthChange)}
            </div>
            <div className={cn(
              "text-sm flex items-center",
              comparison.netWorthChangePercent >= 0 ? "text-green-500" : "text-red-500"
            )}>
              {comparison.netWorthChangePercent >= 0 ? 
                <ArrowUpRight className="h-4 w-4 mr-1" /> : 
                <ArrowDownRight className="h-4 w-4 mr-1" />
              }
              {Math.abs(comparison.netWorthChangePercent).toFixed(1)}%
            </div>
          </CardContent>
        </Card>
        
        {/* Assets Comparison */}
        <Card className="bg-[#2A2F42] border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium text-muted-foreground flex items-center">
              <span className="mr-2">Assets Change</span>
              {comparison.assetsChange >= 0 ? 
                <TrendingUp className="h-4 w-4 text-green-500" /> : 
                <TrendingDown className="h-4 w-4 text-red-500" />
              }
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1 text-green-500">
              {formatCurrency(comparison.assetsChange)}
            </div>
            <div className={cn(
              "text-sm flex items-center",
              comparison.assetsChangePercent >= 0 ? "text-green-500" : "text-red-500"
            )}>
              {comparison.assetsChangePercent >= 0 ? 
                <ArrowUpRight className="h-4 w-4 mr-1" /> : 
                <ArrowDownRight className="h-4 w-4 mr-1" />
              }
              {Math.abs(comparison.assetsChangePercent).toFixed(1)}%
            </div>
          </CardContent>
        </Card>
        
        {/* Liabilities Comparison */}
        <Card className="bg-[#2A2F42] border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium text-muted-foreground flex items-center">
              <span className="mr-2">Liabilities Change</span>
              {comparison.liabilitiesChange <= 0 ? 
                <TrendingUp className="h-4 w-4 text-green-500" /> : 
                <TrendingDown className="h-4 w-4 text-red-500" />
              }
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold mb-1 text-red-500">
              {formatCurrency(comparison.liabilitiesChange)}
            </div>
            <div className={cn(
              "text-sm flex items-center",
              // For liabilities, decreasing is good
              comparison.liabilitiesChange <= 0 ? "text-green-500" : "text-red-500"
            )}>
              {comparison.liabilitiesChange <= 0 ? 
                <ArrowUpRight className="h-4 w-4 mr-1" /> : 
                <ArrowDownRight className="h-4 w-4 mr-1" />
              }
              {Math.abs(comparison.liabilitiesChangePercent).toFixed(1)}%
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
