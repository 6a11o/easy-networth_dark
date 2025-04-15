import { ArrowDown, ArrowUp, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinancial } from "@/context/FinancialContext";
import { useCurrency } from "@/context/CurrencyContext";
import { cn } from "@/lib/utils";

export const NetWorthSummary = () => {
  const { getNetWorth, getTotalAssets, getTotalLiabilities, getHistoricalNetWorth } = useFinancial();
  const { currency, formatAmount } = useCurrency();
  
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
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {/* Assets Card */}
      <div className="bg-[#1A1F2C]/80 rounded-lg p-4 border border-[#33C3F0]/10 shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-[#7A7F92]">Assets</h3>
        </div>
        <div className="text-2xl font-bold text-green-400">{formatAmount(totalAssets)}</div>
        <div className="h-1 w-full bg-[#272D3D] rounded-full mt-2">
          <div className="h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full" 
            style={{ width: totalAssets > 0 ? `${Math.min(100, (totalAssets / (totalAssets + totalLiabilities)) * 100)}%` : "0%" }}>
          </div>
        </div>
      </div>
      
      {/* Liabilities Card */}
      <div className="bg-[#1A1F2C]/80 rounded-lg p-4 border border-[#33C3F0]/10 shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-[#7A7F92]">Liabilities</h3>
        </div>
        <div className="text-2xl font-bold text-red-400">{formatAmount(totalLiabilities)}</div>
        <div className="h-1 w-full bg-[#272D3D] rounded-full mt-2">
          <div className="h-1 bg-gradient-to-r from-red-400 to-red-600 rounded-full" 
            style={{ width: totalLiabilities > 0 ? `${Math.min(100, (totalLiabilities / (totalAssets + totalLiabilities)) * 100)}%` : "0%" }}>
          </div>
        </div>
      </div>
      
      {/* Growth Rate Card */}
      <div className="col-span-2 md:col-span-1 bg-[#1A1F2C]/80 rounded-lg p-4 border border-[#33C3F0]/10 shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-[#7A7F92]">Growth Rate</h3>
        </div>
        <div className="text-2xl font-bold text-[#66EACE]">
          {percentChange !== 0 ? `${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(1)}%` : 'N/A'}
        </div>
        <div className="flex items-center mt-1 text-xs text-[#7A7F92]">
          <TrendingUp className="h-3 w-3 mr-1 text-[#66EACE]" />
          <span>Since last update</span>
        </div>
      </div>
    </div>
  );
};
