import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFinancial } from "@/context/FinancialContext";
import { useCurrency } from "@/context/CurrencyContext";
import { assetCategoryColors, liabilityCategoryColors, assetCategoryLabels, liabilityCategoryLabels } from "@/types";
import { useState } from "react";

interface AllocationChartsProps {
  displayType?: 'assets' | 'liabilities' | 'both';
}

export const AllocationCharts = ({ displayType = 'both' }: AllocationChartsProps) => {
  const { assets, liabilities } = useFinancial();
  const { formatAmount, currency } = useCurrency();
  
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
    })
    .sort((a, b) => b.value - a.value);
  
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
    })
    .sort((a, b) => b.value - a.value);
  
  // If no data, add a placeholder that will show a full circle
  if (liabilityChartData.length === 0) {
    liabilityChartData.push({
      name: "No Data",
      value: 1,
      percent: 100,
      color: "#1A1F2C"
    });
  }

  // Function to render the SVG Donut Chart
  const renderDonutSVG = (chartData: typeof assetChartData) => {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeWidth = 10;
    let accumulatedOffset = 0;

    const backgroundCircle = (
      <circle
        key="background"
        cx="50"
        cy="50"
        r={radius}
        fill="none"
        stroke="#1A1F2C" // Darker background for the track
        strokeWidth={strokeWidth}
      />
    );

    const segments = chartData.map((entry, index) => {
      if (entry.name === "No Data") {
        // Render the background color fully if no data
        return (
          <circle
            key={index}
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={entry.color} // Should be #1A1F2C
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={0}
            style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
          />
        );
      }
      
      const dashArray = (entry.percent / 100) * circumference;
      // Prevent tiny gaps for very small percentages due to floating point inaccuracies
      const safeDashArray = Math.max(dashArray, 0.1);
      const strokeDasharray = `${safeDashArray} ${circumference}`;
      const strokeDashoffset = -accumulatedOffset;
      accumulatedOffset += safeDashArray; // Use safeDashArray here too

      return (
        <circle
          key={index}
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={entry.color}
          strokeWidth={strokeWidth}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%" }}
        >
          <title>{`${entry.name}: ${formatAmount(entry.value)} (${entry.percent.toFixed(1)}%)`}</title> 
        </circle>
      );
    });

    // Increased size and removed mx-auto for flex control
    return (
      <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex-shrink-0"> 
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {backgroundCircle} 
          {segments}
        </svg>
      </div>
    );
  };

  // Render asset labels list - adjusted layout and removed truncation
  const renderAssetLabels = () => {
    if (assetChartData.length === 0 || (assetChartData.length === 1 && assetChartData[0].name === "No Data")) {
      return <p className="text-center text-sm text-muted-foreground mt-4 sm:mt-0 sm:ml-4 flex-1">No asset data available.</p>;
    }
    
    // Use flex column for labels
    return (
      <div className="mt-4 sm:mt-0 sm:ml-8 flex-1 space-y-2 self-start pt-1"> 
        {assetChartData.map((entry, index) => (
          entry.name !== "No Data" && (
            <div key={index} className="flex items-center justify-between"> 
              <div className="flex items-center mr-2">
                <div className="w-3 h-3 rounded-full mr-2 flex-shrink-0" style={{ backgroundColor: entry.color }}></div>
                <span className="text-sm mr-1">{entry.name}</span> 
                <span className="text-xs text-muted-foreground">({entry.percent.toFixed(0)}%)</span>
              </div>
              <span className="text-sm font-medium text-right">{formatAmount(entry.value)}</span>
            </div>
          )
        ))}
      </div>
    );
  };

  // Render liability labels list - adjusted layout and removed truncation
  const renderLiabilityLabels = () => {
     if (liabilityChartData.length === 0 || (liabilityChartData.length === 1 && liabilityChartData[0].name === "No Data")) {
       return <p className="text-center text-sm text-muted-foreground mt-4 sm:mt-0 sm:ml-4 flex-1">No liability data available.</p>;
     }
    
    // Use flex column for labels
    return (
      <div className="mt-4 sm:mt-0 sm:ml-8 flex-1 space-y-2 self-start pt-1"> 
        {liabilityChartData.map((entry, index) => (
          entry.name !== "No Data" && (
            <div key={index} className="flex items-center justify-between"> 
              <div className="flex items-center mr-2">
                <div className="w-3 h-3 rounded-full mr-2 flex-shrink-0" style={{ backgroundColor: entry.color }}></div>
                <span className="text-sm mr-1">{entry.name}</span> 
                <span className="text-xs text-muted-foreground">({entry.percent.toFixed(0)}%)</span>
              </div>
              <span className="text-sm font-medium text-right">{formatAmount(entry.value)}</span>
            </div>
          )
        ))}
      </div>
    );
  };

  // Render function for Assets Chart - Removed Card wrapper and Header
  const renderAssetsChartContent = () => (
    <>
      {/* <CardHeader className="pt-4 pb-2 px-0"> REMOVED THIS HEADER
        <CardTitle className="text-lg font-medium">Asset Allocation</CardTitle>
      </CardHeader> */}
      {/* Use items-start for top alignment */}
      <CardContent className="p-0 pt-2 flex flex-col sm:flex-row items-start"> 
         {/* Container for chart and labels */}
        <div className="flex flex-col sm:flex-row items-start w-full"> 
           {renderDonutSVG(assetChartData)}
           {renderAssetLabels()}
        </div>
      </CardContent>
    </>
  );

  // Render function for Liabilities Card - Removed Card wrapper and Header
  const renderLiabilitiesChartContent = () => (
    <>
      {/* <CardHeader className="pt-4 pb-2 px-0"> REMOVED THIS HEADER
        <CardTitle className="text-lg font-medium">Liability Allocation</CardTitle>
      </CardHeader> */}
      {/* Use items-start for top alignment */}
       <CardContent className="p-0 pt-2 flex flex-col sm:flex-row items-start"> 
         {/* Container for chart and labels */}
         <div className="flex flex-col sm:flex-row items-start w-full"> 
           {renderDonutSVG(liabilityChartData)}
           {renderLiabilityLabels()}
         </div>
      </CardContent>
    </>
  );

  // Main component render logic
  if (displayType === 'assets') {
    return (
      <Card className="bg-transparent border-none shadow-none"> {/* Use transparent card if only one type */}
        {renderAssetsChartContent()}
      </Card>
    );
  }

  if (displayType === 'liabilities') {
    return (
      <Card className="bg-transparent border-none shadow-none"> {/* Use transparent card if only one type */}
        {renderLiabilitiesChartContent()}
      </Card>
    );
  }

  // Default: displayType === 'both' - Render side-by-side in a grid
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-6"> {/* Use grid for side-by-side */}
      <div> {/* Column for Assets */}
        {renderAssetsChartContent()}
      </div>
      <div> {/* Column for Liabilities */}
        {renderLiabilitiesChartContent()}
      </div>
    </div>
  );
};
