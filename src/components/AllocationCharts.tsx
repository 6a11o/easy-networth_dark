
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  
  // Convert to chart data format
  const assetChartData = Object.entries(assetsByCategory)
    .filter(([_, value]) => value > 0)
    .map(([category, value]) => ({
      name: assetCategoryLabels[category as keyof typeof assetCategoryLabels] || category,
      value,
      color: assetCategoryColors[category as keyof typeof assetCategoryColors] || "#cccccc"
    }));
  
  const liabilityChartData = Object.entries(liabilitiesByCategory)
    .filter(([_, value]) => value > 0)
    .map(([category, value]) => ({
      name: liabilityCategoryLabels[category as keyof typeof liabilityCategoryLabels] || category,
      value,
      color: liabilityCategoryColors[category as keyof typeof liabilityCategoryColors] || "#cccccc"
    }));
  
  // Format tooltip values
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0 
    }).format(value);
  };
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    return (
      <text
        x={x}
        y={y}
        fill="#ffffff"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize={12}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };
  
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background/95 border border-white/10 p-2 rounded shadow-md">
          <p className="label font-medium">{data.name}</p>
          <p className="value">{formatCurrency(data.value)}</p>
        </div>
      );
    }
    
    return null;
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      {/* Assets Allocation */}
      <Card className="bg-card/50 backdrop-blur-sm border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Asset Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          {assetChartData.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {assetChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-[300px] items-center justify-center text-muted-foreground">
              Add assets to see your allocation.
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Liabilities Allocation */}
      <Card className="bg-card/50 backdrop-blur-sm border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Liability Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          {liabilityChartData.length > 0 ? (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={liabilityChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {liabilityChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex h-[300px] items-center justify-center text-muted-foreground">
              Add liabilities to see your allocation.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
