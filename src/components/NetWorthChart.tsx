
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFinancial } from "@/context/FinancialContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TimePeriod } from "@/types";
import { cn } from "@/lib/utils";

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
  
  return (
    <Card className="mt-6 bg-card/50 backdrop-blur-sm border-white/10">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">Net Worth Trend</CardTitle>
          <div className="flex space-x-1">
            {periods.map((period) => (
              <Button
                key={period}
                variant="ghost"
                size="sm"
                onClick={() => setTimePeriod(period)}
                className={cn(
                  "text-xs px-2 py-1 h-auto",
                  timePeriod === period && "bg-primary text-primary-foreground"
                )}
              >
                {period}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {chartData.length >= 2 ? (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
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
                <Tooltip 
                  formatter={(value: number) => [formatTooltipValue(value), "Net Worth"]} 
                  labelFormatter={(label) => `Date: ${label}`}
                  contentStyle={{ 
                    backgroundColor: 'rgba(17, 17, 27, 0.9)', 
                    border: '1px solid rgba(255,255,255,0.2)'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="netWorth" 
                  stroke="hsl(250, 91%, 67%)" 
                  strokeWidth={2}
                  dot={{ 
                    stroke: 'hsl(250, 91%, 67%)', 
                    fill: 'hsl(240, 10%, 3.9%)' 
                  }}
                  activeDot={{ r: 6, stroke: 'hsl(250, 91%, 85%)', strokeWidth: 1 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            Add at least two balance updates to see your net worth trend.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
