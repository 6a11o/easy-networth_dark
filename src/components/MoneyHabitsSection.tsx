import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Target, Wallet, Clock, AlertTriangle } from "lucide-react";
import { useFinancial } from "@/context/FinancialContext";
import { useCurrency } from "@/context/CurrencyContext";
import { cn } from "@/lib/utils";

type TimeRange = "1m" | "3m" | "6m" | "1y" | "all";
type Insight = {
  type: "positive" | "negative" | "neutral";
  title: string;
  description: string;
  metric?: string;
  change?: number;
};

export const MoneyHabitsSection = () => {
  const { getHistoricalNetWorth, getTotalAssets, getTotalLiabilities, assets, liabilities } = useFinancial();
  const { formatAmount } = useCurrency();
  const [timeRange, setTimeRange] = useState<TimeRange>("3m");
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    const historicalData = getHistoricalNetWorth();
    if (historicalData.length < 2) return;

    const currentNetWorth = historicalData[historicalData.length - 1].netWorth;
    const previousNetWorth = historicalData[historicalData.length - 2].netWorth;
    const totalAssets = getTotalAssets();
    const totalLiabilities = getTotalLiabilities();
    
    // Calculate key metrics
    const netWorthChange = currentNetWorth - previousNetWorth;
    const netWorthChangePercent = previousNetWorth !== 0 ? (netWorthChange / Math.abs(previousNetWorth)) * 100 : 0;
    const savingsRate = totalAssets > 0 ? (netWorthChange / totalAssets) * 100 : 0;
    const debtToAssetRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;
    
    // Generate insights based on the data
    const newInsights: Insight[] = [];

    // Net Worth Trend
    if (netWorthChangePercent > 0) {
      newInsights.push({
        type: "positive",
        title: "Positive Net Worth Growth",
        description: `Your net worth has increased by ${netWorthChangePercent.toFixed(1)}% since last update`,
        metric: formatAmount(netWorthChange),
        change: netWorthChangePercent
      });
    } else if (netWorthChangePercent < 0) {
      newInsights.push({
        type: "negative",
        title: "Net Worth Decline",
        description: "Your net worth has decreased since last update. Consider reviewing your expenses.",
        metric: formatAmount(netWorthChange),
        change: netWorthChangePercent
      });
    }

    // Savings Rate
    if (savingsRate > 10) {
      newInsights.push({
        type: "positive",
        title: "Strong Savings Rate",
        description: `You're saving ${savingsRate.toFixed(1)}% of your assets, which is above the recommended 10%`,
        metric: `${savingsRate.toFixed(1)}%`
      });
    } else if (savingsRate < 0) {
      newInsights.push({
        type: "negative",
        title: "Negative Savings Rate",
        description: "You're currently spending more than you're saving",
        metric: `${savingsRate.toFixed(1)}%`
      });
    }

    // Debt-to-Asset Ratio
    if (debtToAssetRatio > 80) {
      newInsights.push({
        type: "negative",
        title: "High Debt Ratio",
        description: "Your debt-to-asset ratio is above recommended levels",
        metric: `${debtToAssetRatio.toFixed(1)}%`
      });
    } else if (debtToAssetRatio < 40) {
      newInsights.push({
        type: "positive",
        title: "Healthy Debt Ratio",
        description: "Your debt-to-asset ratio is within healthy levels",
        metric: `${debtToAssetRatio.toFixed(1)}%`
      });
    }

    // Asset Diversification
    const assetCategories = new Set(assets.map(a => a.category));
    if (assetCategories.size >= 3) {
      newInsights.push({
        type: "positive",
        title: "Well-Diversified Portfolio",
        description: `Your assets are spread across ${assetCategories.size} different categories`,
      });
    } else if (assets.length > 0 && assetCategories.size < 2) {
      newInsights.push({
        type: "neutral",
        title: "Limited Diversification",
        description: "Consider diversifying your assets across more categories",
      });
    }

    setInsights(newInsights);
  }, [timeRange, getHistoricalNetWorth, getTotalAssets, getTotalLiabilities, assets, formatAmount]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#CBD5E1]">Money Habits</h3>
        <Select value={timeRange} onValueChange={(value) => setTimeRange(value as TimeRange)}>
          <SelectTrigger className="w-32 h-8 text-xs bg-[#1A1F2C] border-[#33C3F0]/20">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1m">Last month</SelectItem>
            <SelectItem value="3m">Last 3 months</SelectItem>
            <SelectItem value="6m">Last 6 months</SelectItem>
            <SelectItem value="1y">Last year</SelectItem>
            <SelectItem value="all">All time</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, index) => (
          <Card key={index} className={cn(
            "bg-[#1A1F2C]/80 border-[#33C3F0]/20 hover:shadow-lg transition-shadow",
            insight.type === "positive" && "border-l-4 border-l-green-500",
            insight.type === "negative" && "border-l-4 border-l-red-500",
            insight.type === "neutral" && "border-l-4 border-l-yellow-500"
          )}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                {insight.type === "positive" && <TrendingUp className="h-4 w-4 text-green-500" />}
                {insight.type === "negative" && <TrendingDown className="h-4 w-4 text-red-500" />}
                {insight.type === "neutral" && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                {insight.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-400 mb-2">{insight.description}</p>
              {insight.metric && (
                <div className="flex items-center gap-2">
                  <span className={cn(
                    "text-lg font-semibold",
                    insight.type === "positive" && "text-green-500",
                    insight.type === "negative" && "text-red-500",
                    insight.type === "neutral" && "text-yellow-500"
                  )}>
                    {insight.metric}
                  </span>
                  {insight.change && (
                    <span className="flex items-center text-sm">
                      {insight.change >= 0 ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      )}
                      {Math.abs(insight.change).toFixed(1)}%
                    </span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}; 