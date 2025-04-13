
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFinancial } from "@/context/FinancialContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { assetCategoryColors, liabilityCategoryColors, assetCategoryLabels, liabilityCategoryLabels } from "@/types";

export const AllocationCharts = () => {
  const { assets, liabilities } = useFinancial();
  
  // Group assets by category
  const assetsByCategory = assets.reduce((acc, asset) => {
    const category = asset.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += asset.balance;
    return acc;
  }, {} as Record<string, number>);
  
  // Group liabilities by category
  const liabilitiesByCategory = liabilities.reduce((acc, liability) => {
    const category = liability.category;
    if (!acc[category]) {
      acc[category] = 0;
    }
    acc[category] += liability.balance;
    return acc;
  }, {} as Record<string, number>);
  
  // Convert to chart data format with enhanced colors
  const assetChartData = Object.entries(assetsByCategory)
    .filter(([_, value]) => value > 0)
    .map(([category, value]) => {
      const baseColor = assetCategoryColors[category as keyof typeof assetCategoryColors] || "#cccccc";
      // Remove the # and parse the hex color
      const hexColor = baseColor.replace('#', '');
      // Make color more vibrant for better visibility
      return {
        name: assetCategoryLabels[category as keyof typeof assetCategoryLabels] || category,
        value,
        color: baseColor,
        // Add a gradientId for fancy rendering
        gradientId: `asset-${category}-gradient`
      };
    });
  
  const liabilityChartData = Object.entries(liabilitiesByCategory)
    .filter(([_, value]) => value > 0)
    .map(([category, value]) => {
      const baseColor = liabilityCategoryColors[category as keyof typeof liabilityCategoryColors] || "#cccccc";
      return {
        name: liabilityCategoryLabels[category as keyof typeof liabilityCategoryLabels] || category,
        value,
        color: baseColor,
        gradientId: `liability-${category}-gradient`
      };
    });
  
  // Format tooltip values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0 
    }).format(value);
  };
  
  // Add percentage to the tooltip
  const formatPercentage = (value: number, total: number) => {
    return `${((value / total) * 100).toFixed(1)}%`;
  };
  
  const getTotalAssets = () => {
    return Object.values(assetsByCategory).reduce((sum, value) => sum + value, 0);
  };
  
  const getTotalLiabilities = () => {
    return Object.values(liabilitiesByCategory).reduce((sum, value) => sum + value, 0);
  };
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    if (percent < 0.05) return null; // Don't show labels for tiny slices
    
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.7;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text 
        x={x} 
        y={y} 
        fill="#ffffff" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="text-xs font-medium filter drop-shadow-lg"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  const CustomTooltip = ({ active, payload, totalValue }: { active?: boolean, payload?: any[], totalValue: number }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#1D2235]/95 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-xl">
          <p className="text-sm font-medium mb-1">{data.name}</p>
          <p className="text-xs text-gray-300 mb-1">{formatCurrency(data.value)}</p>
          <p className="text-xs text-gray-400">{formatPercentage(data.value, totalValue)}</p>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Portfolio Allocation</h2>
      
      {/* Assets Allocation */}
      <Card className="bg-[#1D2235]/50 backdrop-blur-sm border-white/10 overflow-hidden">
        <CardHeader className="pb-2 border-b border-white/5">
          <CardTitle className="text-lg font-medium flex items-center">
            <span className="h-3 w-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 mr-2"></span>
            Asset Allocation
          </CardTitle>
        </CardHeader>
        <CardContent>
          {assetChartData.length > 0 ? (
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    {assetChartData.map((entry) => (
                      <linearGradient key={entry.gradientId} id={entry.gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                        <stop offset="100%" stopColor={entry.color} stopOpacity={0.7} />
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie
                    data={assetChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    innerRadius={60}
                    dataKey="value"
                    strokeWidth={1}
                    stroke="#1A1F2C"
                    animationDuration={800}
                  >
                    {assetChartData.map((entry) => (
                      <Cell 
                        key={`cell-${entry.name}`} 
                        fill={`url(#${entry.gradientId})`} 
                        className="drop-shadow-lg"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip totalValue={getTotalAssets()} />} />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    formatter={(value) => <span className="text-xs text-gray-300">{value}</span>}
                    iconType="circle"
                    iconSize={8}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-[300px] items-center justify-center bg-gradient-to-b from-transparent to-[#1A1F2C]/10 rounded-lg">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">Add assets to see your allocation.</p>
                <Button 
                  onClick={() => window.location.href="/accounts"} 
                  variant="outline" 
                  size="sm" 
                  className="border-white/10 hover:bg-white/5"
                >
                  Add Assets
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Liabilities Allocation */}
      <Card className="bg-[#1D2235]/50 backdrop-blur-sm border-white/10 overflow-hidden">
        <CardHeader className="pb-2 border-b border-white/5">
          <CardTitle className="text-lg font-medium flex items-center">
            <span className="h-3 w-3 rounded-full bg-gradient-to-r from-red-400 to-pink-500 mr-2"></span>
            Liability Allocation
          </CardTitle>
        </CardHeader>
        <CardContent>
          {liabilityChartData.length > 0 ? (
            <div className="h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <defs>
                    {liabilityChartData.map((entry) => (
                      <linearGradient key={entry.gradientId} id={entry.gradientId} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={entry.color} stopOpacity={1} />
                        <stop offset="100%" stopColor={entry.color} stopOpacity={0.7} />
                      </linearGradient>
                    ))}
                  </defs>
                  <Pie
                    data={liabilityChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={100}
                    innerRadius={60}
                    dataKey="value"
                    strokeWidth={1}
                    stroke="#1A1F2C"
                    animationDuration={800}
                  >
                    {liabilityChartData.map((entry) => (
                      <Cell 
                        key={`cell-${entry.name}`} 
                        fill={`url(#${entry.gradientId})`}
                        className="drop-shadow-lg"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip totalValue={getTotalLiabilities()} />} />
                  <Legend 
                    layout="horizontal" 
                    verticalAlign="bottom" 
                    align="center"
                    formatter={(value) => <span className="text-xs text-gray-300">{value}</span>}
                    iconType="circle"
                    iconSize={8}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-[300px] items-center justify-center bg-gradient-to-b from-transparent to-[#1A1F2C]/10 rounded-lg">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">Add liabilities to see your allocation.</p>
                <Button 
                  onClick={() => window.location.href="/accounts"} 
                  variant="outline" 
                  size="sm" 
                  className="border-white/10 hover:bg-white/5"
                >
                  Add Liabilities
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
