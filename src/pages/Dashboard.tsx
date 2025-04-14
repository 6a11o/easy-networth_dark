
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

const Dashboard = () => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isRecapOpen, setIsRecapOpen] = useState(false);
  
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      {/* Dashboard Header with Gradient */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#1A1F2C]/90 to-[#0F1119] p-6 border border-[#1A1F2C]/50 shadow-lg backdrop-blur-sm">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-20"></div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#33C3F0] to-[#66EACE]">
              Financial Dashboard
            </h1>
            <p className="text-gray-400 mt-1">Track, analyze, and grow your net worth</p>
          </div>
          <Button
            onClick={() => setIsUpdateModalOpen(true)}
            className="bg-[#1A1F2C] hover:bg-[#272D3D] text-white self-end border border-[#33C3F0]/20"
          >
            <RefreshCw className="mr-2 h-4 w-4 text-[#33C3F0]" />
            Update Balances
          </Button>
        </div>
      </div>
      
      {/* Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-[#131620] border border-[#1A1F2C]/40 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all backdrop-blur-sm">
            <NetWorthChart />
          </div>
        </div>
        <div>
          <div className="bg-[#131620] border border-[#1A1F2C]/40 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all backdrop-blur-sm">
            <NetWorthSummary />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#131620] border border-[#1A1F2C]/40 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all backdrop-blur-sm">
          <AllocationCharts />
        </div>
        <div className="bg-[#131620] border border-[#1A1F2C]/40 rounded-xl p-5 shadow-lg hover:shadow-xl transition-all backdrop-blur-sm">
          <AccountsList />
        </div>
      </div>
      
      <Collapsible
        open={isRecapOpen}
        onOpenChange={setIsRecapOpen}
        className="rounded-xl border border-[#1A1F2C]/40 bg-[#131620] shadow-lg hover:shadow-xl transition-all backdrop-blur-sm"
      >
        <div className="flex items-center justify-between p-5 border-b border-[#1A1F2C]/30">
          <div className="flex items-center">
            <TrendingUp className="h-5 w-5 text-[#33C3F0] mr-2" />
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#33C3F0] to-[#66EACE]">
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
        <CollapsibleContent className="p-5 animate-slide-down">
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
