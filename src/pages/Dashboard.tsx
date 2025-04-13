
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { NetWorthSummary } from "@/components/NetWorthSummary";
import { NetWorthChart } from "@/components/NetWorthChart";
import { AllocationCharts } from "@/components/AllocationCharts";
import { AccountsList } from "@/components/AccountsList";
import { UpdateBalancesModal } from "@/components/UpdateBalancesModal";
import { RefreshCw } from "lucide-react";

const Dashboard = () => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <Button
          onClick={() => setIsUpdateModalOpen(true)}
          className="bg-primary hover:bg-primary/90 text-white"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Update Balances
        </Button>
      </div>
      
      <NetWorthSummary />
      <NetWorthChart />
      <AllocationCharts />
      <AccountsList />
      
      <UpdateBalancesModal 
        isOpen={isUpdateModalOpen} 
        onClose={() => setIsUpdateModalOpen(false)} 
      />
    </div>
  );
};

export default Dashboard;
