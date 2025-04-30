import { useState, useMemo, useCallback } from "react";
import { useFinancial } from "@/context/FinancialContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { TimePeriod } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrency } from "@/context/CurrencyContext";

export const NetWorthChart = () => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("ALL");
  const { getHistoricalNetWorth, getHistoricalDates } = useFinancial();
  const { currency, formatAmount } = useCurrency();
  
  // Memoize the historical data
  const netWorthHistory = useMemo(() => getHistoricalNetWorth(), [getHistoricalNetWorth]);
  const dates = useMemo(() => getHistoricalDates(), [getHistoricalDates]);
  
  // Memoize filtered data based on time period
  const filteredData = useMemo(() => {
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
  }, [timePeriod, netWorthHistory]);
  
  // Memoize chart data formatting
  const chartData = useMemo(() => filteredData.map(item => ({
    date: new Date(item.date).toLocaleDateString(undefined, {
      month: 'short', 
      day: 'numeric',
      year: timePeriod === '1Y' || timePeriod === 'ALL' ? 'numeric' : undefined
    }),
    netWorth: item.netWorth,
    rawDate: item.date // Keep original date for tooltip
  })), [filteredData, timePeriod]);
  
  // Memoize net worth change calculation
  const netWorthChange = useMemo(() => {
    if (chartData.length < 2) return { value: 0, percentage: 0 };
    
    const firstValue = chartData[0].netWorth;
    const lastValue = chartData[chartData.length - 1].netWorth;
    const change = lastValue - firstValue;
    const percentage = firstValue !== 0 ? (change / Math.abs(firstValue)) * 100 : 0;
    
    return { value: change, percentage };
  }, [chartData]);
  
  // Memoize time period label
  const getTimeRangeLabel = useCallback((period: TimePeriod) => {
    switch(period) {
      case "1M": return "Last Month";
      case "3M": return "Last 3 Months";
      case "6M": return "Last 6 Months";
      case "1Y": return "Last Year";
      case "ALL": return "All Time";
      default: return "Select Period";
    }
  }, []);
  
  // Determine trend color and gradient
  const trendColor = netWorthChange.value >= 0 ? '#4ade80' : '#f87171';
  const gradientId = netWorthChange.value >= 0 ? 'positiveGradient' : 'negativeGradient';

  // Custom tooltip component
  const CustomTooltip = useCallback(({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const date = new Date(data.rawDate);
      const formattedDate = date.toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      return (
        <div className="bg-gray-950/90 backdrop-blur-lg border border-[#33C3F0]/20 text-gray-100 shadow-xl rounded-lg p-2 sm:p-3">
          <p className="text-xs sm:text-sm text-gray-300 mb-0.5 sm:mb-1">{formattedDate}</p>
          <p className="text-sm sm:text-base font-medium">
            {formatAmount(payload[0].value as number)}
          </p>
          {chartData.length > 1 && (
            <div className="mt-1 text-xs text-gray-400">
              {netWorthChange.value >= 0 ? '↑' : '↓'} {Math.abs(netWorthChange.percentage).toFixed(1)}% from start
            </div>
          )}
        </div>
      );
    }
    return null;
  }, [formatAmount, chartData.length, netWorthChange]);

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          {chartData.length >= 2 && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="text-xs sm:text-sm text-muted-foreground">Change:</div>
              <div className={cn(
                "flex items-center gap-1 text-xs sm:text-sm font-medium",
                netWorthChange.value >= 0 ? "text-green-400" : "text-red-400"
              )}>
                {formatAmount(netWorthChange.value)}
                <span className="text-[10px] sm:text-xs">
                  ({netWorthChange.value >= 0 ? "+" : ""}{netWorthChange.percentage.toFixed(1)}%)
                </span>
              </div>
            </div>
          )}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-[#1A1F2C] border-[#33C3F0]/20 text-white hover:bg-[#272D3D] h-8 sm:h-9 text-xs sm:text-sm"
            >
              {getTimeRangeLabel(timePeriod)}
              <ChevronDown className="ml-1.5 sm:ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#33C3F0]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48 sm:w-56 bg-[#1A1F2C] border-[#33C3F0]/20">
            {["1M", "3M", "6M", "1Y", "ALL"].map((period) => (
              <DropdownMenuItem 
                key={period}
                onClick={() => setTimePeriod(period as TimePeriod)}
                className={cn(
                  "cursor-pointer hover:bg-[#272D3D] focus:bg-[#272D3D] text-xs sm:text-sm py-1.5 sm:py-2",
                  timePeriod === period && "bg-[#33C3F0]/20 text-[#33C3F0]"
                )}
              >
                {getTimeRangeLabel(period as TimePeriod)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {chartData.length >= 2 ? (
        <div className="h-[300px] sm:h-[400px] mt-4 sm:mt-6 luxury-shadow rounded-lg overflow-hidden">
          <div className="w-full h-full bg-gradient-to-b from-[#121825]/80 to-[#0A0C14]/95 border border-[#1A1F2C]/50 rounded-lg p-2 sm:p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={trendColor} stopOpacity={0.5} />
                    <stop offset="95%" stopColor={trendColor} stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="rgba(255, 255, 255, 0.4)"
                  axisLine={{ stroke: 'rgba(255, 255, 255, 0.4)' }}
                  tickLine={{ stroke: 'rgba(255, 255, 255, 0.4)' }}
                  tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: '10px' }}
                  dy={10}
                  minTickGap={30}
                  interval="preserveStartEnd"
                />
                <YAxis
                  stroke="rgba(255, 255, 255, 0.4)"
                  axisLine={{ stroke: 'rgba(255, 255, 255, 0.4)' }}
                  tickLine={{ stroke: 'rgba(255, 255, 255, 0.4)' }}
                  tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: '10px' }}
                  tickFormatter={formatAmount}
                  domain={['auto', 'auto']}
                  width={80}
                />
                <Tooltip
                  cursor={{ stroke: trendColor, strokeWidth: 1.5, strokeDasharray: '4 4' }}
                  content={CustomTooltip}
                />
                <Area
                  type="monotone"
                  dataKey="netWorth"
                  stroke={trendColor}
                  strokeWidth={2}
                  fill={`url(#${gradientId})`}
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="h-[300px] sm:h-[400px] mt-4 sm:mt-6 luxury-shadow rounded-lg overflow-hidden">
          <div className="w-full h-full bg-gradient-to-b from-[#121825]/80 to-[#0A0C14]/95 border border-[#1A1F2C]/50 rounded-lg flex items-center justify-center">
            <p className="text-sm sm:text-base text-muted-foreground">
              {dates.length === 0
                ? "No data available yet. Add assets or liabilities to see your net worth history."
                : "Add more data points to see historical trends."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
