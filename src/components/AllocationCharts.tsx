import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFinancial } from "@/context/FinancialContext";
import { useCurrency } from "@/context/CurrencyContext";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, Sector } from "recharts";
import { assetCategoryColors, liabilityCategoryColors, assetCategoryLabels, liabilityCategoryLabels } from "@/types";
import { useState } from "react";

interface AllocationChartsProps {
  displayType?: 'assets' | 'liabilities' | 'both';
}

export const AllocationCharts = ({ displayType = 'both' }: AllocationChartsProps) => {
  const { assets, liabilities } = useFinancial();
  const { formatAmount, currency } = useCurrency();
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
  
  // Get total values
  const totalAssets = Object.values(assetsByCategory).reduce((sum, value) => sum + value, 0);
  const totalLiabilities = Object.values(liabilitiesByCategory).reduce((sum, value) => sum + value, 0);
  
  // Convert to chart data format with percentages
  const assetChartData = Object.entries(assetsByCategory)
    .filter(([_, value]) => value > 0)
    .map(([category, value]) => {
      const percent = totalAssets > 0 ? (value / totalAssets) * 100 : 0;
      return {
        name: assetCategoryLabels[category as keyof typeof assetCategoryLabels] || category,
        value,
        percent,
        color: assetCategoryColors[category as keyof typeof assetCategoryColors] || "#cccccc",
      };
    });
  
  // If no data, add a placeholder that will show a full circle
  if (assetChartData.length === 0) {
    assetChartData.push({
      name: "No Data",
      value: 1,
      percent: 100,
      color: "#1A1F2C"
    });
  }
  
  const liabilityChartData = Object.entries(liabilitiesByCategory)
    .filter(([_, value]) => value > 0)
    .map(([category, value]) => {
      const percent = totalLiabilities > 0 ? (value / totalLiabilities) * 100 : 0;
      return {
        name: liabilityCategoryLabels[category as keyof typeof liabilityCategoryLabels] || category,
        value,
        percent,
        color: liabilityCategoryColors[category as keyof typeof liabilityCategoryColors] || "#cccccc",
      };
    });
  
  // If no data, add a placeholder that will show a full circle
  if (liabilityChartData.length === 0) {
    liabilityChartData.push({
      name: "No Data",
      value: 1,
      percent: 100,
      color: "#1A1F2C"
    });
  }
  
  // Add percentage to the tooltip
  const formatPercentage = (value: number, total: number) => {
    return `${((value / total) * 100).toFixed(1)}%`;
  };
  
  const getTotalAssets = () => {
    return totalAssets;
  };
  
  const getTotalLiabilities = () => {
    return totalLiabilities;
  };
  
  // Enhanced label rendering inside the donut
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }: any) => {
    // Hide labels for very small slices to avoid clutter
    if (percent < 0.05 || name === "No Data") return null;

    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        // Use white fill for better contrast on darker colors
        fill="white"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-[10px] font-semibold pointer-events-none"
        // Shadow for readability
        style={{ textShadow: '0px 0px 2px rgba(0,0,0,0.8)' }}
      >
        {`${(percent).toFixed(0)}%`}
      </text>
    );
  };

  // Custom active shape for hover effect
  const renderActiveShape = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    
    // Don't show active shape for the placeholder "No Data" item
    if (payload.name === "No Data") return null;
    
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
        <text x={ex + (cos >= 0 ? 1 : -1) * 6} y={ey} textAnchor={textAnchor} fill="#ccc" className="text-xs">
          {payload.name}
        </text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 6} y={ey} dy={14} textAnchor={textAnchor} fill="#eee" className="text-sm font-semibold">
          {`${(percent * 100).toFixed(1)}%`}
        </text>
        <text x={ex + (cos >= 0 ? 1 : -1) * 6} y={ey} dy={32} textAnchor={textAnchor} fill="#ccc" className="text-xs">
          {formatAmount(value)}
        </text>
      </g>
    );
  };

  // Tooltip remains similar but could potentially be removed if active shape is sufficient
  const CustomTooltip = ({ active, payload, totalValue }: { active?: boolean, payload?: any[], totalValue: number }) => {
    if (active && payload && payload.length && payload[0].payload.name !== "No Data") {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-950/80 backdrop-blur-md border border-[#33C3F0]/20 p-3 rounded-lg shadow-xl">
          <p className="text-sm font-semibold text-gray-100 mb-1">{data.name}</p>
          <p className="text-xs text-gray-300 mb-1">{formatAmount(data.value)}</p>
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
    outerRadius: 90,
    innerRadius: 60, // Increase inner radius for a thinner donut
    paddingAngle: 2, // Add padding between segments
    dataKey: "value",
    strokeWidth: 0, // Remove stroke between segments
    animationDuration: 800,
    activeIndex: activeIndex,
    activeShape: renderActiveShape,
    onMouseEnter: onPieEnter,
    onMouseLeave: onPieLeave,
    startAngle: 90,
    endAngle: -270,
  };

  // Render asset labels list for the landing page style
  const renderAssetLabels = () => {
    if (assetChartData.length === 0 || (assetChartData.length === 1 && assetChartData[0].name === "No Data")) {
      return null;
    }
    
    return (
      <div className="grid grid-cols-2 gap-2 mt-4">
        {assetChartData.map((entry, index) => (
          entry.name !== "No Data" && (
            <div key={index} className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
              <span className="text-sm">{entry.name} ({entry.percent.toFixed(0)}%)</span>
            </div>
          )
        ))}
      </div>
    );
  };

  // Render liability labels list
  const renderLiabilityLabels = () => {
    if (liabilityChartData.length === 0 || (liabilityChartData.length === 1 && liabilityChartData[0].name === "No Data")) {
      return null;
    }
    
    return (
      <div className="grid grid-cols-2 gap-2 mt-4">
        {liabilityChartData.map((entry, index) => (
          entry.name !== "No Data" && (
            <div key={index} className="flex items-center">
              <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
              <span className="text-sm">{entry.name} ({entry.percent.toFixed(0)}%)</span>
            </div>
          )
        ))}
      </div>
    );
  };

  const renderAssetsChart = () => (
    <div className="h-full flex flex-col">
      <div className="mb-4 text-center">
        <span className="text-lg font-medium text-[#E2E8F0]">Asset Allocation</span>
      </div>
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="relative w-48 h-48 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              {/* Background circle to ensure we have a full donut */}
              <Pie
                data={[{ name: "background", value: 1 }]}
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={60}
                fill="#1A1F2C"
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              />
              <Pie
                {...commonPieProps}
                data={assetChartData}
              >
                {assetChartData.map((entry, index) => (
                  <Cell
                    key={`cell-asset-${index}`}
                    fill={entry.color}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip totalValue={getTotalAssets()} />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {renderAssetLabels()}
      </div>
    </div>
  );

  const renderLiabilitiesChart = () => (
    <div className="h-full flex flex-col">
      <div className="mb-4 text-center">
        <span className="text-lg font-medium text-[#E2E8F0]">Liability Allocation</span>
      </div>
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="relative w-48 h-48 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              {/* Background circle to ensure we have a full donut */}
              <Pie
                data={[{ name: "background", value: 1 }]}
                cx="50%"
                cy="50%"
                outerRadius={90}
                innerRadius={60}
                fill="#1A1F2C"
                dataKey="value"
                startAngle={90}
                endAngle={-270}
              />
              <Pie
                {...commonPieProps}
                data={liabilityChartData}
              >
                {liabilityChartData.map((entry, index) => (
                  <Cell
                    key={`cell-liability-${index}`}
                    fill={entry.color}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip totalValue={getTotalLiabilities()} />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        {renderLiabilityLabels()}
      </div>
    </div>
  );

  return (
    <>
      {displayType === 'both' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {renderAssetsChart()}
          {renderLiabilitiesChart()}
        </div>
      )}
      {displayType === 'assets' && renderAssetsChart()}
      {displayType === 'liabilities' && renderLiabilitiesChart()}
    </>
  );
};
