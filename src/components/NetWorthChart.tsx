
import { useState } from "react";
import { useFinancial } from "@/context/FinancialContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TimePeriod } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronsUpDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

export const NetWorthChart = () => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("ALL");
  const { getHistoricalNetWorth } = useFinancial();
  
  // Get net worth history
  const netWorthHistory = getHistoricalNetWorth();
  
  // Filter data based on selected time period
  const filteredData = () => {
    if (timePeriod === "ALL" || netWorthHistory.length <= 1) {
      return netWorthHistory;
    }
    
    const now = new Date();
    let startDate = new Date();
    
    switch (timePeriod) {
      case "1M":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "3M":
        startDate.setMonth(now.getMonth() - 3);
        break;
      case "6M":
        startDate.setMonth(now.getMonth() - 6);
        break;
      case "1Y":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return netWorthHistory;
    }
    
    const cutoffDate = startDate.toISOString().split('T')[0];
    return netWorthHistory.filter(item => item.date >= cutoffDate);
  };
  
  // Format chart data
  const chartData = filteredData().map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    }),
    netWorth: item.netWorth
  }));
  
  // Time period options
  const periods: TimePeriod[] = ["1M", "3M", "6M", "1Y", "ALL"];
  
  // Format tooltip values
  const formatTooltipValue = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0 
    }).format(value);
  };
  
  const getTimeRangeLabel = (period: TimePeriod) => {
    switch(period) {
      case "1M": return "Last Month";
      case "3M": return "Last 3 Months";
      case "6M": return "Last 6 Months";
      case "1Y": return "Last Year";
      case "ALL": return "All Time";
      default: return "Select Period";
    }
  };
  
  // Get the net worth change percentage
  const getNetWorthChange = () => {
    if (chartData.length < 2) return { value: 0, percentage: 0 };
    
    const firstValue = chartData[0].netWorth;
    const lastValue = chartData[chartData.length - 1].netWorth;
    const change = lastValue - firstValue;
    const percentage = firstValue !== 0 ? (change / Math.abs(firstValue)) * 100 : 0;
    
    return { value: change, percentage };
  };
  
  const netWorthChange = getNetWorthChange();
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="bg-[#1A1F2C] border-[#33C3F0]/20 text-white hover:bg-[#272D3D]">
                {getTimeRangeLabel(timePeriod)}
                <ChevronDown className="ml-2 h-4 w-4 text-[#33C3F0]" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[#1A1F2C] border-[#33C3F0]/20">
              {periods.map((period) => (
                <DropdownMenuItem 
                  key={period}
                  onClick={() => setTimePeriod(period)}
                  className={cn(
                    "cursor-pointer hover:bg-[#272D3D] focus:bg-[#272D3D]",
                    timePeriod === period && "bg-[#33C3F0]/20 text-[#33C3F0]"
                  )}
                >
                  {getTimeRangeLabel(period)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {chartData.length >= 2 && (
          <div className="flex items-center gap-2">
            <div className="text-sm text-muted-foreground">Change:</div>
            <div className={cn(
              "flex items-center gap-1 text-sm font-medium",
              netWorthChange.value >= 0 ? "text-green-400" : "text-red-400"
            )}>
              {formatTooltipValue(netWorthChange.value)}
              <span className="text-xs">
                ({netWorthChange.value >= 0 ? "+" : ""}{netWorthChange.percentage.toFixed(1)}%)
              </span>
            </div>
          </div>
        )}
      </div>
      
      {chartData.length >= 2 ? (
        <div className="h-[350px] mt-6 luxury-shadow rounded-lg overflow-hidden">
          <ChartContainer
            config={{
              netWorth: {
                label: "Net Worth",
                theme: { light: "#9b87f5", dark: "#9b87f5" },
              },
            }}
            className="p-4 bg-gradient-to-b from-[#121825]/80 to-[#0A0C14]/95 border border-[#1A1F2C]/50 rounded-lg"
          >
            <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#9b87f5" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#9b87f5" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.7)' }}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.5)"
                tick={{ fill: 'rgba(255,255,255,0.7)' }}
                tickFormatter={formatTooltipValue}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent 
                    formatter={(value: number) => formatTooltipValue(value)}
                  />
                }
              />
              <Area 
                type="monotone" 
                dataKey="netWorth" 
                name="netWorth"
                stroke="#9b87f5" 
                strokeWidth={2}
                fill="url(#netWorthGradient)"
                activeDot={{ r: 6, stroke: '#9b87f5', strokeWidth: 2, fill: '#131620' }}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      ) : (
        <div className="flex h-[350px] items-center justify-center text-muted-foreground bg-[#1A1F2C]/30 rounded-lg border border-[#1A1F2C]/50 luxury-shadow">
          <div className="text-center space-y-2">
            <p>Add at least two balance updates to see your net worth trend.</p>
            <Button 
              onClick={() => window.location.href="/accounts"} 
              variant="outline" 
              size="sm" 
              className="border-[#33C3F0]/20 hover:bg-[#33C3F0]/10"
            >
              Add Accounts
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
