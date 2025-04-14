import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFinancial } from "@/context/FinancialContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from "recharts";
import { assetCategoryColors, liabilityCategoryColors, assetCategoryLabels, liabilityCategoryLabels } from "@/types";
import { useState } from "react";

interface AllocationChartsProps {
  displayType?: 'assets' | 'liabilities' | 'both';
}

export const AllocationCharts = ({ displayType = 'both' }: AllocationChartsProps) => {
  const { assets, liabilities } = useFinancial();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  
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
        color: assetCategoryColors[category as keyof typeof assetCategoryColors] || "#cccccc",
    }));
  
  const liabilityChartData = Object.entries(liabilitiesByCategory)
    .filter(([_, value]) => value > 0)
    .map(([category, value]) => ({
        name: liabilityCategoryLabels[category as keyof typeof liabilityCategoryLabels] || category,
        value,
        color: liabilityCategoryColors[category as keyof typeof liabilityCategoryColors] || "#cccccc",
    }));
  
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
  
  // Enhanced label rendering inside the donut
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }: any) => {
    // Hide labels for very small slices to avoid clutter
    if (percent < 0.05) return null;

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        // Use black fill for better contrast on lighter colors, white shadow helps on dark
        fill="black"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-[10px] font-semibold pointer-events-none"
        // White shadow for readability on dark segments
        style={{ paintOrder: 'stroke', stroke: 'white', strokeWidth: '2px', strokeLinejoin: 'round' }}
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Custom active shape for hover effect
  const renderActiveShape = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 5) * cos; // Slightly larger radius on hover
    const sy = cy + (outerRadius + 5) * sin;
    const mx = cx + (outerRadius + 15) * cos;
    const my = cy + (outerRadius + 15) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 12;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';

    return (
      <g className="transition-transform duration-300 ease-out transform scale-105 filter drop-shadow-lg">
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius + 3} // Slightly pop out the active sector
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
          stroke={fill} // Use fill color for stroke for a solid look
          strokeWidth={2}
        />
        {/* Optional: Line connecting to label (can be removed if too cluttered) */}
        {/* <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" /> */}
        <text x={ex + (cos >= 0 ? 1 : -1) * 6} y={ey} textAnchor={textAnchor} fill="#ccc" className="text-xs">
          {payload.name}
        </text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 6} y={ey} dy={14} textAnchor={textAnchor} fill="#eee" className="text-sm font-semibold">
          {`${(percent * 100).toFixed(1)}%`}
        </text>
      </g>
    );
  };

  // Tooltip remains similar but could potentially be removed if active shape is sufficient
  const CustomTooltip = ({ active, payload, totalValue }: { active?: boolean, payload?: any[], totalValue: number }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-950/80 backdrop-blur-md border border-white/10 p-3 rounded-lg shadow-xl">
          <p className="text-sm font-semibold text-gray-100 mb-1">{data.name}</p>
          <p className="text-xs text-gray-300 mb-1">{formatCurrency(data.value)}</p>
          <p className="text-xs text-gray-400">{formatPercentage(data.value, totalValue)} of Total</p>
        </div>
      );
    }
    return null;
  };

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(null);
  };

  // Shared Pie Chart props
  const commonPieProps = {
    cx: "50%",
    cy: "50%",
    labelLine: false,
    label: renderCustomizedLabel,
    outerRadius: 110,
    innerRadius: 70, // Increase inner radius for a thinner donut
    paddingAngle: 2, // Add padding between segments
    dataKey: "value",
    strokeWidth: 0, // Remove stroke between segments
    animationDuration: 800,
    activeIndex: activeIndex,
    activeShape: renderActiveShape,
    onMouseEnter: onPieEnter,
    onMouseLeave: onPieLeave,
  };

  const renderAssetsChart = () => (
    <div className="h-full flex flex-col">
      {/* Title for the chart area - Align color with primary */}
      <div className="mb-4 text-center">
        {/* Use primary color defined in CSS variables */}
        <span className="h-3 w-3 rounded-full bg-primary inline-block mr-2 shadow-sm"></span>
        <span className="text-lg font-semibold text-gray-100">Asset Allocation</span>
      </div>
      {assetChartData.length > 0 ? (
        <div className="flex-grow h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                {...commonPieProps}
                data={assetChartData}
              >
                {assetChartData.map((entry, index) => (
                  <Cell
                    key={`cell-asset-${index}`}
                    fill={entry.color}
                    // Add slight brightness/saturation variation on hover if needed
                    // style={{ filter: activeIndex === index ? 'brightness(1.1) saturate(1.1)' : 'none', transition: 'filter 0.3s' }}
                  />
                ))}
              </Pie>
              {/* Tooltip is now optional if activeShape provides enough info */}
              <Tooltip content={<CustomTooltip totalValue={getTotalAssets()} />} />
              {/* <Legend
                // Consider removing legend if chart labels/activeShape are clear enough
                layout="vertical"
                verticalAlign="middle"
                align="right"
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: '12px', lineHeight: '1.5' }}
                formatter={(value, entry) => <span className="text-gray-300">{value}</span>}
              /> */}
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        // Enhanced empty state message
        <div className="flex flex-col flex-grow h-[300px] items-center justify-center bg-gray-900/30 border border-dashed border-gray-700/80 rounded-lg p-6 text-center">
          <div className="text-gray-400 mb-4">No assets added yet.</div>
          <p className="text-sm text-gray-500 mb-4">Add some assets on the Accounts page to see your allocation breakdown here.</p>
          <Button
            onClick={() => window.location.href="/accounts"}
            variant="outline"
            size="sm"
            className="border-primary/50 bg-primary/10 hover:bg-primary/20 text-primary"
          >
            Go to Accounts
          </Button>
        </div>
      )}
    </div>
  );

  const renderLiabilitiesChart = () => (
    <div className="h-full flex flex-col">
      {/* Title for the chart area - Align color with destructive */}
      <div className="mb-4 text-center">
        {/* Use destructive color defined in CSS variables */}
        <span className="h-3 w-3 rounded-full bg-destructive inline-block mr-2 shadow-sm"></span>
        <span className="text-lg font-semibold text-gray-100">Liability Allocation</span>
      </div>
      {liabilityChartData.length > 0 ? (
        <div className="flex-grow h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                {...commonPieProps}
                data={liabilityChartData}
              >
                {liabilityChartData.map((entry, index) => (
                  <Cell
                    key={`cell-liability-${index}`}
                    fill={entry.color}
                    // style={{ filter: activeIndex === index ? 'brightness(1.1) saturate(1.1)' : 'none', transition: 'filter 0.3s' }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip totalValue={getTotalLiabilities()} />} />
              {/* <Legend /> */}
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="flex flex-col flex-grow h-[300px] items-center justify-center bg-gray-900/30 border border-dashed border-gray-700/80 rounded-lg p-6 text-center">
          <div className="text-gray-400 mb-4">No liabilities added yet.</div>
          <p className="text-sm text-gray-500 mb-4">Add liabilities on the Accounts page to see your debt breakdown.</p>
          <Button
            onClick={() => window.location.href="/accounts"}
            variant="outline"
            size="sm"
            className="border-destructive/50 bg-destructive/10 hover:bg-destructive/20 text-destructive"
          >
            Go to Accounts
          </Button>
        </div>
      )}
    </div>
  );

  return (
    <Card className="bg-gray-950/80 backdrop-blur-lg border border-white/10 shadow-xl rounded-xl overflow-hidden">
      <CardContent className="p-5">
        {displayType === 'both' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {renderAssetsChart()}
            {renderLiabilitiesChart()}
          </div>
        )}
        {displayType === 'assets' && renderAssetsChart()}
        {displayType === 'liabilities' && renderLiabilitiesChart()}
      </CardContent>
    </Card>
  );
};
