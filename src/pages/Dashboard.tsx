
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <Button
          onClick={() => setIsUpdateModalOpen(true)}
          className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Update Balances
        </Button>
      </div>
      
      <NetWorthSummary />
      <NetWorthChart />
      <AllocationCharts />
      <AccountsList />
      
      <Collapsible
        open={isRecapOpen}
        onOpenChange={setIsRecapOpen}
        className="border border-white/10 rounded-lg p-4 bg-[#1D2235]"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Recap & Historical Analysis</h2>
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
        <CollapsibleContent className="pt-4">
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
