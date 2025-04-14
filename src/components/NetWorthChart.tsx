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
import { useCurrency } from "@/context/CurrencyContext";

export const NetWorthChart = () => {
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("ALL");
  const { getHistoricalNetWorth } = useFinancial();
  const { currency } = useCurrency();
  
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
    date: new Date(item.date).toLocaleDateString(undefined, {
      month: 'short', 
      day: 'numeric',
      year: timePeriod === '1Y' || timePeriod === 'ALL' ? 'numeric' : undefined
    }),
    netWorth: item.netWorth
  }));
  
  // Time period options
  const periods: TimePeriod[] = ["1M", "3M", "6M", "1Y", "ALL"];
  
  // Format axis/tooltip value WITHOUT currency symbol
  const formatValue = (value: number) => {
    return new Intl.NumberFormat(undefined, {
      maximumFractionDigits: 0
    }).format(value);
  };

  // Format value WITH currency symbol (for change display)
  const formatValueWithCurrency = (value: number) => {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency.code,
      maximumFractionDigits: 0,
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
  
  // Determine trend color and gradient
  const trendColor = netWorthChange.value >= 0 ? '#4ade80' : '#f87171'; // green-400 or red-400
  const gradientId = netWorthChange.value >= 0 ? 'url(#positiveGradient)' : 'url(#negativeGradient)';

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
              {formatValueWithCurrency(netWorthChange.value)}
              <span className="text-xs">
                ({netWorthChange.value >= 0 ? "+" : ""}{netWorthChange.percentage.toFixed(1)}%)
              </span>
            </div>
          </div>
        )}
      </div>
      
      {chartData.length >= 2 ? (
        <div className="mt-6 luxury-shadow rounded-lg overflow-hidden" style={{ height: '400px' }}>
          <div className="w-full h-full bg-gradient-to-b from-[#121825]/80 to-[#0A0C14]/95 border border-[#1A1F2C]/50 rounded-lg p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 20, right: 20, left: 10, bottom: 20 }}>
                <defs>
                  {/* Green gradient for positive trend */}
                  <linearGradient id="positiveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4ade80" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#4ade80" stopOpacity={0.05} />
                  </linearGradient>
                  {/* Red gradient for negative trend */}
                  <linearGradient id="negativeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f87171" stopOpacity={0.5} />
                    <stop offset="95%" stopColor="#f87171" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="rgba(255, 255, 255, 0.4)"
                  axisLine={{ stroke: 'rgba(255, 255, 255, 0.4)' }}
                  tickLine={{ stroke: 'rgba(255, 255, 255, 0.4)' }}
                  tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 11 }}
                  dy={10}
                  minTickGap={50}
                />
                <YAxis
                  stroke="rgba(255, 255, 255, 0.4)"
                  axisLine={{ stroke: 'rgba(255, 255, 255, 0.4)' }}
                  tickLine={{ stroke: 'rgba(255, 255, 255, 0.4)' }}
                  tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 11 }}
                  tickFormatter={formatValue}
                  domain={['auto', 'auto']}
                  width={60}
                />
                <Tooltip
                  cursor={{ stroke: trendColor, strokeWidth: 1.5, strokeDasharray: '4 4' }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-gray-950/90 backdrop-blur-lg border border-[#33C3F0]/20 text-gray-100 shadow-xl rounded-lg p-3">
                          <p className="text-sm text-gray-300 mb-1">Date: {label}</p>
                          <p className="text-base font-medium">
                            Net Worth: {formatValueWithCurrency(payload[0].value as number)}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="netWorth"
                  name="Net Worth"
                  stroke={trendColor}
                  strokeWidth={2.5}
                  fillOpacity={0.6}
                  fill={gradientId}
                  activeDot={{ r: 6, strokeWidth: 1.5, fill: trendColor, stroke: '#fff' }}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
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
