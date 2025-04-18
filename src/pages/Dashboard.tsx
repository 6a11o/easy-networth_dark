import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { NetWorthSummary } from "@/components/NetWorthSummary";
import { NetWorthChart } from "@/components/NetWorthChart";
import { AllocationCharts } from "@/components/AllocationCharts";
import { AccountsList } from "@/components/AccountsList";
import { UpdateBalancesModal } from "@/components/UpdateBalancesModal";
import { EnhancedRecapSection } from "@/components/EnhancedRecapSection";
import { RefreshCw, ChevronDown, ChevronUp, TrendingUp, ArrowUp, PlusCircle, Rewind } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useFinancial } from "@/context/FinancialContext";
import { useCurrency } from "@/context/CurrencyContext";

// Animation helper component for floating particles
const FloatingParticle = ({ index }: { index: number }) => {
  const size = Math.random() * 4 + 2;
  const left = `${Math.random() * 100}%`;
  const top = `${Math.random() * 100}%`;
  const opacity = Math.random() * 0.5 + 0.1;
  const animationDuration = Math.random() * 10 + 15;
  const animationDelay = Math.random() * 5;
  
  return (
    <div 
      className="absolute rounded-full bg-[#33C3F0]/10"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        left,
        top,
        filter: 'blur(1px)',
        opacity,
        animationDelay: `${animationDelay}s`,
        animation: `float ${animationDuration}s linear infinite`
      }}
    />
  );
};

const Dashboard = () => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isRecapOpen, setIsRecapOpen] = useState(false);
  const { getNetWorth, getTotalAssets, getTotalLiabilities, getHistoricalNetWorth } = useFinancial();
  const { formatAmount } = useCurrency();
  
  const netWorth = getNetWorth();
  const totalAssets = getTotalAssets();
  const totalLiabilities = getTotalLiabilities();
  
  // Calculate change percentage
  const netWorthHistory = getHistoricalNetWorth();
  let percentChange = 0;
  
  if (netWorthHistory.length > 1) {
    const current = netWorthHistory[netWorthHistory.length - 1].netWorth;
    const previous = netWorthHistory[netWorthHistory.length - 2].netWorth;
    
    if (previous !== 0) {
      percentChange = ((current - previous) / Math.abs(previous)) * 100;
    }
  }
  
  // Add animation keyframes to document on mount
  useEffect(() => {
    if (!document.getElementById('custom-animations')) {
      const style = document.createElement('style');
      style.id = 'custom-animations';
      style.innerHTML = `
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-10px) translateX(5px); }
          50% { transform: translateY(0) translateX(10px); }
          75% { transform: translateY(10px) translateX(5px); }
        }
        @keyframes sweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);
  
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10 relative">
      {/* Enhanced background texture effects */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0 opacity-15 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC4xNSIvPjwvcGF0dGVybjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] mix-blend-overlay"></div>
        <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgc3Ryb2tlPSIjMzNDM0YwIiBzdHJva2Utb3BhY2l0eT0iMC4xIiBjeD0iMjAiIGN5PSIyMCIgcj0iMiIvPjwvZz48L3N2Zz4=')] mix-blend-color-dodge"></div>
        
        {/* Animated light streaks */}
        <div className="absolute -rotate-45 -left-1/4 top-1/3 w-1/2 h-px bg-gradient-to-r from-transparent via-[#33C3F0]/20 to-transparent animate-[sweep_8s_ease-in-out_infinite]"></div>
        <div className="absolute -rotate-45 -left-1/4 top-2/3 w-3/4 h-px bg-gradient-to-r from-transparent via-[#66EACE]/10 to-transparent animate-[sweep_15s_ease-in-out_infinite_1s]"></div>
        
        {/* Subtle floating particles */}
        {[...Array(20)].map((_, i) => (
          <FloatingParticle key={i} index={i} />
        ))}
      </div>
      
      {/* Main Net Worth Hero Section with Enhanced Depth */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#131620]/80 to-[#0A0C14] p-8 border border-[#33C3F0]/30 shadow-2xl backdrop-blur-xl transform hover:scale-[1.005] transition-all duration-500">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC4yIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-30 mix-blend-overlay"></div>
        
        {/* Premium visual element */}
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-[#33C3F0]/10 to-[#66EACE]/5 blur-3xl animate-[pulse_4s_ease-in-out_infinite]"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-gradient-to-br from-[#33C3F0]/5 to-[#66EACE]/10 blur-3xl animate-[pulse_4s_ease-in-out_infinite_1s]"></div>
        
        <div className="relative flex flex-col items-center text-center mb-4">
          <h2 className="text-lg font-medium text-[#7A7F92]">Your Net Worth</h2>
          <div className="mt-2 text-5xl sm:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#33C3F0] to-[#66EACE]">
            {formatAmount(netWorth)}
          </div>
          {percentChange !== 0 && (
            <div className="flex items-center mt-2 text-green-400">
              {percentChange >= 0 ? (
                <>
                  <ArrowUp className="h-4 w-4 mr-1" />
                  <span>+{percentChange.toFixed(1)}% from last update</span>
                </>
              ) : (
                <>
                  <ArrowUp className="h-4 w-4 mr-1 rotate-180" />
                  <span className="text-red-400">{percentChange.toFixed(1)}% from last update</span>
                </>
              )}
            </div>
          )}
          <p className="mt-2 text-[#7A7F92]">Track, analyze, and grow your wealth</p>
          <Button
            onClick={() => setIsUpdateModalOpen(true)}
            className="mt-4 bg-[#1A1F2C]/80 hover:bg-[#272D3D] text-white border border-[#33C3F0]/20 backdrop-blur-sm shadow-md"
          >
            <RefreshCw className="mr-2 h-4 w-4 text-[#33C3F0]" />
            Update Balances
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8 px-4">
          <div className="bg-[#1A1F2C]/80 rounded-lg p-4 border border-[#33C3F0]/10 shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-[#7A7F92]">Assets</h3>
            </div>
            <div className="text-2xl font-bold text-green-400">{formatAmount(totalAssets)}</div>
            <div className="h-1 w-full bg-[#272D3D] rounded-full mt-2">
              <div className="h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full" 
                style={{ width: totalAssets > 0 ? `${Math.min(100, (totalAssets / (totalAssets + totalLiabilities)) * 100)}%` : "0%" }}>
              </div>
            </div>
          </div>
          
          <div className="bg-[#1A1F2C]/80 rounded-lg p-4 border border-[#33C3F0]/10 shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-[#7A7F92]">Liabilities</h3>
            </div>
            <div className="text-2xl font-bold text-red-400">{formatAmount(totalLiabilities)}</div>
            <div className="h-1 w-full bg-[#272D3D] rounded-full mt-2">
              <div className="h-1 bg-gradient-to-r from-red-400 to-red-600 rounded-full" 
                style={{ width: totalLiabilities > 0 ? `${Math.min(100, (totalLiabilities / (totalAssets + totalLiabilities)) * 100)}%` : "0%" }}>
              </div>
            </div>
          </div>
          
          <div className="col-span-2 md:col-span-1 bg-[#1A1F2C]/80 rounded-lg p-4 border border-[#33C3F0]/10 shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-[#7A7F92]">Growth Rate</h3>
            </div>
            <div className="text-2xl font-bold text-[#66EACE]">
              {percentChange !== 0 ? `${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(1)}%` : 'N/A'}
            </div>
            <div className="flex items-center mt-1 text-xs text-[#7A7F92]">
              <TrendingUp className="h-3 w-3 mr-1 text-[#66EACE]" />
              <span>Since last update</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* 1. Net Worth Trend - Enhanced for visual appeal and interaction */}
      <div className="bg-[#131620]/90 border border-[#33C3F0]/20 rounded-xl p-6 shadow-2xl backdrop-blur-xl hover:shadow-xl transition-all mb-8 transform hover:scale-[1.005] duration-500">
        <h3 className="text-xl font-medium mb-4 text-[#E2E8F0]">Net Worth Trend</h3>
        <div className="relative">
          <NetWorthChart />
        </div>
      </div>
      
      {/* 2. Portfolio Allocation - Single unified box */}
      <div className="mb-8">
        <h3 className="text-xl font-medium mb-4 text-[#E2E8F0]">Portfolio Allocation</h3>
        {/* Render AllocationCharts once, applying container styles here */}
        <div className="bg-[#131620]/90 border border-[#33C3F0]/20 rounded-xl p-6 shadow-2xl hover:shadow-xl transition-all backdrop-blur-xl transform hover:scale-[1.005] duration-500">
          <AllocationCharts displayType="both" />
        </div>
      </div>
      
      {/* 3. Account Summary - Assets and Liabilities side by side */}
      <div className="mb-8">
        <h3 className="text-xl font-medium mb-4 text-[#E2E8F0]">Accounts Summary</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#131620]/90 border border-[#33C3F0]/20 rounded-xl p-6 shadow-2xl hover:shadow-xl transition-all backdrop-blur-xl transform hover:scale-[1.005] duration-500">
            <h4 className="text-lg font-medium mb-3 text-[#33C3F0] flex items-center">
              <div className="h-3 w-3 rounded-full bg-[#33C3F0] mr-2"></div>
              Assets
            </h4>
            <AccountsList type="assets" />
          </div>
          <div className="bg-[#131620]/90 border border-[#33C3F0]/20 rounded-xl p-6 shadow-2xl hover:shadow-xl transition-all backdrop-blur-xl transform hover:scale-[1.005] duration-500">
            <h4 className="text-lg font-medium mb-3 text-red-400 flex items-center">
              <div className="h-3 w-3 rounded-full bg-red-400 mr-2"></div>
              Liabilities
            </h4>
            <AccountsList type="liabilities" />
          </div>
        </div>
      </div>
      
      {/* 4. Recap Section */}
      <div className="mb-8">
        <Collapsible
          open={isRecapOpen}
          onOpenChange={setIsRecapOpen}
          className="w-full space-y-2"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Rewind className="h-5 w-5 text-[#9b87f5]" />
              <h3 className="text-xl font-medium text-[#E2E8F0]">Recap</h3>
            </div>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="w-9 p-0 hover:bg-[#131620]/40">
                {isRecapOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="space-y-2">
            <div className="bg-[#131620]/90 border border-[#33C3F0]/20 rounded-xl p-6 shadow-2xl backdrop-blur-xl">
              <EnhancedRecapSection />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
      
      <UpdateBalancesModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
      />
    </div>
  );
};

export default Dashboard;
