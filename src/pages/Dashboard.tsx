
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NetWorthSummary } from "@/components/NetWorthSummary";
import { NetWorthChart } from "@/components/NetWorthChart";
import { AllocationCharts } from "@/components/AllocationCharts";
import { AccountsList } from "@/components/AccountsList";
import { UpdateBalancesModal } from "@/components/UpdateBalancesModal";
import { RecapSection } from "@/components/RecapSection";
import { RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const Dashboard = () => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isRecapOpen, setIsRecapOpen] = useState(false);
  
  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#9b87f5] to-[#33C3F0]">Financial Dashboard</h1>
          <p className="text-gray-400 mt-1">Track, analyze, and grow your net worth</p>
        </div>
        <Button
          onClick={() => setIsUpdateModalOpen(true)}
          className="bg-gradient-to-r from-[#9b87f5] to-[#33C3F0] hover:opacity-90 text-white self-end"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Update Balances
        </Button>
      </div>
      
      <NetWorthSummary />
      <NetWorthChart />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AllocationCharts />
        <AccountsList />
      </div>
      
      <Collapsible
        open={isRecapOpen}
        onOpenChange={setIsRecapOpen}
        className="border border-white/10 rounded-lg p-4 bg-[#1D2235]/50 backdrop-blur-sm"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#9b87f5] to-[#33C3F0]">
            Recap & Historical Analysis
          </h2>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="hover:bg-white/10">
              {isRecapOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="pt-4 animate-slide-down">
          <RecapSection />
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
