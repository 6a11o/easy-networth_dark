import { ArrowDown, ArrowUp, TrendingUp, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinancial } from "@/context/FinancialContext";
import { useCurrency } from "@/context/CurrencyContext";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const NetWorthSummary = () => {
  const { getNetWorth, getTotalAssets, getTotalLiabilities, getHistoricalNetWorth } = useFinancial();
  const { currency, formatAmount } = useCurrency();
  
  const netWorth = getNetWorth();
  const totalAssets = getTotalAssets();
  const totalLiabilities = getTotalLiabilities();
  
  // Calculate change from previous period
  const netWorthHistory = getHistoricalNetWorth();
  let percentChange = 0;
  let absoluteChange = 0;
  let daysSinceLastUpdate = 0;
  
  if (netWorthHistory.length > 1) {
    const current = netWorthHistory[netWorthHistory.length - 1].netWorth;
    const previous = netWorthHistory[netWorthHistory.length - 2].netWorth;
    
    if (previous !== 0) {
      percentChange = ((current - previous) / Math.abs(previous)) * 100;
    }
    absoluteChange = current - previous;
    
    // Calculate days since last update
    const lastUpdate = new Date(netWorthHistory[netWorthHistory.length - 1].date);
    const today = new Date();
    daysSinceLastUpdate = Math.floor((today.getTime() - lastUpdate.getTime()) / (1000 * 60 * 60 * 24));
  }
  
  // Calculate asset and liability percentages
  const total = totalAssets + totalLiabilities;
  const assetPercentage = total > 0 ? (totalAssets / total) * 100 : 0;
  const liabilityPercentage = total > 0 ? (totalLiabilities / total) * 100 : 0;
  
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
      {/* Assets Card */}
      <div className="bg-[#1A1F2C]/80 rounded-lg p-3 sm:p-4 border border-[#33C3F0]/10 shadow-lg">
        <div className="flex justify-between items-center mb-1.5 sm:mb-2">
          <h3 className="text-[#7A7F92] text-sm sm:text-base">Assets</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-[#7A7F92] hover:text-[#33C3F0]" />
              </TooltipTrigger>
              <TooltipContent className="bg-[#1A1F2C] border-[#33C3F0]/20">
                <p>Total value of all your assets</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="text-xl sm:text-2xl font-bold text-green-400">{formatAmount(totalAssets)}</div>
        <div className="h-1 w-full bg-[#272D3D] rounded-full mt-1.5 sm:mt-2">
          <div className="h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full" 
            style={{ width: `${Math.min(100, assetPercentage)}%` }}>
          </div>
        </div>
        <div className="text-xs text-[#7A7F92] mt-1">
          {assetPercentage.toFixed(1)}% of total
        </div>
      </div>
      
      {/* Liabilities Card */}
      <div className="bg-[#1A1F2C]/80 rounded-lg p-3 sm:p-4 border border-[#33C3F0]/10 shadow-lg">
        <div className="flex justify-between items-center mb-1.5 sm:mb-2">
          <h3 className="text-[#7A7F92] text-sm sm:text-base">Liabilities</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-[#7A7F92] hover:text-[#33C3F0]" />
              </TooltipTrigger>
              <TooltipContent className="bg-[#1A1F2C] border-[#33C3F0]/20">
                <p>Total value of all your debts and obligations</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="text-xl sm:text-2xl font-bold text-red-400">{formatAmount(totalLiabilities)}</div>
        <div className="h-1 w-full bg-[#272D3D] rounded-full mt-1.5 sm:mt-2">
          <div className="h-1 bg-gradient-to-r from-red-400 to-red-600 rounded-full" 
            style={{ width: `${Math.min(100, liabilityPercentage)}%` }}>
          </div>
        </div>
        <div className="text-xs text-[#7A7F92] mt-1">
          {liabilityPercentage.toFixed(1)}% of total
        </div>
      </div>
      
      {/* Growth Rate Card */}
      <div className="col-span-1 xs:col-span-2 md:col-span-1 bg-[#1A1F2C]/80 rounded-lg p-3 sm:p-4 border border-[#33C3F0]/10 shadow-lg">
        <div className="flex justify-between items-center mb-1.5 sm:mb-2">
          <h3 className="text-[#7A7F92] text-sm sm:text-base">Growth Rate</h3>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-[#7A7F92] hover:text-[#33C3F0]" />
              </TooltipTrigger>
              <TooltipContent className="bg-[#1A1F2C] border-[#33C3F0]/20">
                <p>Change in net worth since last update</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="text-xl sm:text-2xl font-bold text-[#66EACE]">
          {percentChange !== 0 ? `${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(1)}%` : 'N/A'}
        </div>
        <div className="flex items-center mt-1 text-xs sm:text-sm text-[#7A7F92]">
          <TrendingUp className="h-3 w-3 mr-1 text-[#66EACE]" />
          <span>Since last update</span>
        </div>
        {daysSinceLastUpdate > 0 && (
          <div className="text-xs text-[#7A7F92] mt-1">
            {daysSinceLastUpdate} {daysSinceLastUpdate === 1 ? 'day' : 'days'} ago
          </div>
        )}
        {absoluteChange !== 0 && (
          <div className="text-xs text-[#7A7F92] mt-1">
            {formatAmount(Math.abs(absoluteChange))} {absoluteChange >= 0 ? 'increase' : 'decrease'}
          </div>
        )}
      </div>
    </div>
  );
};
