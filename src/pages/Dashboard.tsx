import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NetWorthSummary } from "@/components/NetWorthSummary";
import { NetWorthChart } from "@/components/NetWorthChart";
import { AllocationCharts } from "@/components/AllocationCharts";
import { AccountsList } from "@/components/AccountsList";
import { UpdateBalancesModal } from "@/components/UpdateBalancesModal";
import { EnhancedRecapSection } from "@/components/EnhancedRecapSection";
import { RefreshCw, ChevronDown, ChevronUp, TrendingUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useFinancial } from "@/context/FinancialContext";
import { useCurrency } from "@/context/CurrencyContext";

const Dashboard = () => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isRecapOpen, setIsRecapOpen] = useState(false);
  const { getNetWorth } = useFinancial();
  const { formatAmount } = useCurrency();
  const netWorth = getNetWorth();
  
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10">
      {/* Main Net Worth Hero Section with Depth */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#131620]/80 to-[#0A0C14] p-8 border border-[#1A1F2C]/50 shadow-lg">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC4yIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-30 mix-blend-overlay"></div>
        <div className="relative flex flex-col items-center text-center mb-4">
          <h2 className="text-lg font-medium text-[#7A7F92]">Your Net Worth</h2>
          <div className="mt-2 text-5xl sm:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#33C3F0] to-[#66EACE]">
            {formatAmount(netWorth)}
          </div>
          <p className="mt-2 text-[#7A7F92]">Track, analyze, and grow your wealth</p>
          <Button
            onClick={() => setIsUpdateModalOpen(true)}
            className="mt-4 bg-[#1A1F2C]/80 hover:bg-[#272D3D] text-white border border-[#33C3F0]/20 backdrop-blur-sm shadow-md"
          >
            <RefreshCw className="mr-2 h-4 w-4 text-[#33C3F0]" />
            Update Balances
          </Button>
        </div>
      </div>
      
      {/* Summary Cards with Shadow Depth */}
      <div className="mb-8">
        <NetWorthSummary />
      </div>
      
      {/* 1. Net Worth Trend - Enhanced for visual appeal and interaction */}
      <div className="bg-[#131620]/90 border border-[#1A1F2C]/40 rounded-xl p-6 shadow-lg backdrop-blur-sm mb-8">
        <h3 className="text-xl font-medium mb-4 text-[#E2E8F0]">Net Worth Trend</h3>
        <div className="relative">
          <NetWorthChart />
        </div>
      </div>
      
      {/* 2. Portfolio Allocation - Side by side donuts */}
      <div className="mb-8">
        <h3 className="text-xl font-medium mb-4 text-[#E2E8F0]">Portfolio Allocation</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#131620]/90 border border-[#1A1F2C]/40 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all backdrop-blur-sm">
            <AllocationCharts displayType="assets" />
          </div>
          <div className="bg-[#131620]/90 border border-[#1A1F2C]/40 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all backdrop-blur-sm">
            <AllocationCharts displayType="liabilities" />
          </div>
        </div>
      </div>
      
      {/* 3. Account Summary - Assets and Liabilities side by side */}
      <div className="mb-8">
        <h3 className="text-xl font-medium mb-4 text-[#E2E8F0]">Accounts Summary</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#131620]/90 border border-[#1A1F2C]/40 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all backdrop-blur-sm">
            <h4 className="text-lg font-medium mb-3 text-[#33C3F0]">Assets</h4>
            <AccountsList />
          </div>
          <div className="bg-[#131620]/90 border border-[#1A1F2C]/40 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all backdrop-blur-sm">
            <h4 className="text-lg font-medium mb-3 text-red-400">Liabilities</h4>
            <AccountsList />
          </div>
        </div>
      </div>
      
      {/* 4. Recap Section */}
      <Collapsible
        open={isRecapOpen}
        onOpenChange={setIsRecapOpen}
        className="rounded-xl border border-[#1A1F2C]/40 bg-[#131620]/90 shadow-lg hover:shadow-xl transition-all backdrop-blur-sm"
      >
        <div className="flex items-center justify-between p-6 border-b border-[#1A1F2C]/30">
          <div className="flex items-center">
            <TrendingUp className="h-5 w-5 text-[#33C3F0] mr-2" />
            <h2 className="text-xl font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#33C3F0] to-[#66EACE]">
              Recap & Historical Analysis
            </h2>
          </div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="hover:bg-[#1A1F2C]/50">
              {isRecapOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="p-6 animate-slide-down">
          <EnhancedRecapSection />
        </CollapsibleContent>
      </Collapsible>
      
      <UpdateBalancesModal 
        isOpen={isUpdateModalOpen} 
        onClose={() => setIsUpdateModalOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;
