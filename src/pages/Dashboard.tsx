import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { NetWorthSummary } from "@/components/NetWorthSummary";
import { NetWorthChart } from "@/components/NetWorthChart";
import { AllocationCharts } from "@/components/AllocationCharts";
import { AccountsList } from "@/components/AccountsList";
import { UpdateBalancesModal } from "@/components/UpdateBalancesModal";
import { MoneyHabitsSection } from "@/components/MoneyHabitsSection";
import { HistoricalDataSection } from "@/components/HistoricalDataSection";
import { 
  RefreshCw, 
  ChevronDown, 
  ChevronUp, 
  TrendingUp, 
  ArrowUp, 
  PlusCircle, 
  Rewind,
  Wallet,
  BarChart3,
  Clock,
  Download,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  CalendarIcon,
  Repeat
} from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useFinancial } from "@/context/FinancialContext";
import { useCurrency } from "@/context/CurrencyContext";
import { Sidebar } from "@/components/Sidebar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { OnboardingFlow } from '@/components/OnboardingFlow';

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
  const [isMobile, setIsMobile] = useState(false);
  const { getNetWorth, getTotalAssets, getTotalLiabilities, getHistoricalNetWorth, createSnapshot, snapshots } = useFinancial();
  const { formatAmount } = useCurrency();
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);
    
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
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
  
  // Use the overall change as a simplified indicator for assets and liabilities
  const percentChangeAssets = percentChange;
  const percentChangeLiabilities = -percentChange; // Invert for liabilities (decrease is positive)
  
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

  useEffect(() => {
    if (totalAssets === 0 && totalLiabilities === 0) {
      setShowOnboarding(true);
    }
  }, [getTotalAssets, getTotalLiabilities]);

  if (showOnboarding) {
    return <OnboardingFlow onComplete={() => setShowOnboarding(false)} />;
  }
  
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 max-w-7xl mx-auto pb-10 relative px-3 sm:px-4 md:px-6 md:pl-24 lg:pl-28 xl:px-8">
        {/* Background effects - lighter for mobile */}
        <div className="fixed inset-0 -z-10 pointer-events-none opacity-50 md:opacity-100">
          <div className="absolute inset-0 opacity-15 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC4xNSIvPjwvcGF0dGVybjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] mix-blend-overlay"></div>
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgc3Ryb2tlPSIjMzNDM0YwIiBzdHJva2Utb3BhY2l0eT0iMC4xIiBjeD0iMjAiIGN5PSIyMCIgcj0iMiIvPjwvZz48L3N2Zz4=')] mix-blend-color-dodge"></div>
          
          {/* Animated light streaks - fewer for mobile */}
          <div className="absolute -rotate-45 -left-1/4 top-1/3 w-1/2 h-px bg-gradient-to-r from-transparent via-[#33C3F0]/20 to-transparent animate-[sweep_8s_ease-in-out_infinite] hidden sm:block"></div>
          <div className="absolute -rotate-45 -left-1/4 top-2/3 w-3/4 h-px bg-gradient-to-r from-transparent via-[#66EACE]/10 to-transparent animate-[sweep_15s_ease-in-out_infinite_1s] hidden sm:block"></div>
          
          {/* Floating particles - fewer for mobile */}
          {[...Array(isMobile ? 10 : 20)].map((_, i) => (
            <FloatingParticle key={i} index={i} />
          ))}
        </div>
        
        {/* SECTION 1: What I Have */}
        <div id="what-i-have" className="mb-6 sm:mb-10 mt-5 scroll-mt-20">
          <div className="flex flex-col items-center mb-4 sm:mb-6">
            <div className="bg-[#1A1F2C]/80 p-1.5 sm:p-2 rounded-lg mb-1.5 sm:mb-2 shadow-md">
              <Wallet className="h-5 w-5 sm:h-6 sm:w-6 text-[#66EACE]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#33C3F0] to-[#66EACE]">
              My Money Today
            </h2>
          </div>
          
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-[#131620]/80 to-[#0A0C14] p-4 sm:p-8 border border-[#33C3F0]/30 shadow-2xl backdrop-blur-xl transform hover:scale-[1.005] transition-all duration-500">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC4yIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-30 mix-blend-overlay"></div>
            
            {/* Premium visual element */}
            <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-[#33C3F0]/10 to-[#66EACE]/5 blur-3xl animate-[pulse_4s_ease-in-out_infinite] hidden sm:block"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-gradient-to-br from-[#33C3F0]/5 to-[#66EACE]/10 blur-3xl animate-[pulse_4s_ease-in-out_infinite_1s] hidden sm:block"></div>
            
            <div className="relative flex flex-col items-center text-center mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-medium text-[#7A7F92]">What I Have</h2>
              <div className="mt-1 sm:mt-2 text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#33C3F0] to-[#66EACE]">
                {formatAmount(netWorth)}
              </div>
              {percentChange !== 0 && (
                <div className="flex items-center mt-1.5 sm:mt-2 text-xs sm:text-sm text-green-400">
                  {percentChange >= 0 ? (
                    <>
                      <ArrowUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span>+{percentChange.toFixed(1)}% from last update</span>
                    </>
                  ) : (
                    <>
                      <ArrowUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1 rotate-180" />
                      <span className="text-red-400">{percentChange.toFixed(1)}% from last update</span>
                    </>
                  )}
                </div>
              )}
              <div className="flex flex-col sm:flex-row gap-2 mt-3 sm:mt-4 w-full sm:w-auto">
                <Button
  onClick={() => setIsUpdateModalOpen(true)}
  className="w-full sm:w-auto bg-[#1A1F2C]/80 hover:bg-[#272D3D] text-white border border-[#33C3F0]/20 backdrop-blur-sm shadow-md text-xs sm:text-sm"
>
  <RefreshCw className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#33C3F0]" />
  Update Balances
</Button>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mt-6 sm:mt-8 px-0 sm:px-4">
              <div className="bg-[#1A1F2C]/80 rounded-lg p-3 sm:p-4 border border-[#33C3F0]/10 shadow-lg">
                <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                  <h3 className="text-[#7A7F92] text-xs sm:text-sm">Assets</h3>
                </div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-green-400">{formatAmount(totalAssets)}</div>
                <div className="flex items-center justify-between mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-[#7A7F92]">
                  <span>{totalAssets > 0 ? `${Math.round((totalAssets / (totalAssets + totalLiabilities)) * 100)}% of portfolio` : "0%"}</span>
                  <span className="flex items-center">
                    <ArrowUp className={`h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 ${percentChangeAssets >= 0 ? 'text-green-400' : 'text-red-400'}`} />
                    <span className={percentChangeAssets >= 0 ? 'text-green-400' : 'text-red-400'}>
                      {percentChangeAssets !== 0 ? `${percentChangeAssets >= 0 ? '+' : ''}${percentChangeAssets.toFixed(1)}%` : '0%'}
                    </span>
                  </span>
                </div>
              </div>
              
              <div className="bg-[#1A1F2C]/80 rounded-lg p-3 sm:p-4 border border-[#33C3F0]/10 shadow-lg">
                <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                  <h3 className="text-[#7A7F92] text-xs sm:text-sm">Liabilities</h3>
                </div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-red-400">{formatAmount(totalLiabilities)}</div>
                <div className="flex items-center justify-between mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-[#7A7F92]">
                  <span>{totalLiabilities > 0 ? `${Math.round((totalLiabilities / (totalAssets + totalLiabilities)) * 100)}% of portfolio` : "0%"}</span>
                  <span className="flex items-center">
                    <ArrowUp className={`h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 ${percentChangeLiabilities <= 0 ? 'text-green-400' : 'text-red-400'}`} />
                    <span className={percentChangeLiabilities <= 0 ? 'text-green-400' : 'text-red-400'}>
                      {percentChangeLiabilities !== 0 ? `${percentChangeLiabilities >= 0 ? '+' : ''}${percentChangeLiabilities.toFixed(1)}%` : '0%'}
                    </span>
                  </span>
                </div>
              </div>
              
              <div className="col-span-1 xs:col-span-2 md:col-span-1 bg-[#1A1F2C]/80 rounded-lg p-3 sm:p-4 border border-[#33C3F0]/10 shadow-lg">
                <div className="flex justify-between items-center mb-1.5 sm:mb-2">
                  <h3 className="text-[#7A7F92] text-xs sm:text-sm">Growth Rate</h3>
                </div>
                <div className="text-lg sm:text-xl md:text-2xl font-bold text-[#66EACE]">
                  {percentChange !== 0 ? `${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(1)}%` : 'N/A'}
                </div>
                <div className="flex items-center mt-1 text-[10px] sm:text-xs text-[#7A7F92]">
                  <TrendingUp className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 text-[#66EACE]" />
                  <span>Since last update</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* SECTION 2: Financial Info */}
        <div id="financial-info-wrapper" className="mb-6 sm:mb-10 scroll-mt-20">
          <div className="flex flex-col items-center mb-4 sm:mb-6">
            <div className="bg-[#1A1F2C]/80 p-1.5 sm:p-2 rounded-lg mb-1.5 sm:mb-2 shadow-md">
              <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-[#66EACE]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#33C3F0] to-[#66EACE]">
              My Money Info
            </h2>
          </div>
          
          {/* My Money over Time */}
          <div id="money-over-time" className="bg-[#131620]/90 border border-[#33C3F0]/20 rounded-xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl hover:shadow-xl transition-all mb-6 sm:mb-8 transform hover:scale-[1.005] duration-500 scroll-mt-20">
            <h3 className="text-lg sm:text-xl font-semibold text-[#CBD5E1] mb-3 sm:mb-4">My Money over Time</h3>
            <div className="relative h-[300px] md:h-[400px]">
              <NetWorthChart />
            </div>
          </div>
          
          {/* Where I Have it */}
          <div id="where-i-have-it" className="bg-[#131620]/90 border border-[#33C3F0]/20 rounded-xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl hover:shadow-xl transition-all mb-6 sm:mb-8 transform hover:scale-[1.005] duration-500 scroll-mt-20">
            <h3 className="text-lg sm:text-xl font-semibold text-[#CBD5E1] mb-3 sm:mb-4">Where I Have it</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Combined Assets Box */}
              <div className="bg-[#131620]/90 border border-[#33C3F0]/20 rounded-xl p-4 sm:p-6 shadow-2xl hover:shadow-xl transition-all backdrop-blur-xl transform hover:scale-[1.005] duration-500 space-y-4 sm:space-y-6">
                <h4 className="text-base sm:text-lg font-medium text-center text-[#33C3F0]">Assets</h4>
                <AllocationCharts displayType="assets" />
                <AccountsList type="assets" />
              </div>
              
              {/* Combined Liabilities Box */}
              <div className="bg-[#131620]/90 border border-[#33C3F0]/20 rounded-xl p-4 sm:p-6 shadow-2xl hover:shadow-xl transition-all backdrop-blur-xl transform hover:scale-[1.005] duration-500 space-y-4 sm:space-y-6">
                <h4 className="text-base sm:text-lg font-medium text-center text-red-400">Liabilities</h4>
                <AllocationCharts displayType="liabilities" />
                <AccountsList type="liabilities" />
              </div>
            </div>
          </div>
        </div>
        
        {/* SECTION 3: My Money History */}
        <div id="money-history-wrapper" className="mb-6 sm:mb-10 scroll-mt-20">
          <div className="flex flex-col items-center mb-4 sm:mb-6">
            <div className="bg-[#1A1F2C]/80 p-1.5 sm:p-2 rounded-lg mb-1.5 sm:mb-2 shadow-md">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-[#66EACE]" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#33C3F0] to-[#66EACE]">
              My Money History
            </h2>
          </div>
          
          {/* Historical Data (Historical Comparison) */}
          <div id="historical-data" className="bg-[#131620]/90 border border-[#33C3F0]/20 rounded-xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl hover:shadow-xl transition-all mb-6 sm:mb-8 transform hover:scale-[1.005] duration-500 scroll-mt-20">
            <HistoricalDataSection />
          </div>

          {/* Money Habits (Financial Trends) */}
          <div id="money-habits" className="bg-[#131620]/90 border border-[#33C3F0]/20 rounded-xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl hover:shadow-xl transition-all mb-6 sm:mb-8 transform hover:scale-[1.005] duration-500 scroll-mt-20">
            <MoneyHabitsSection />
          </div>

          {/* What I Did (Activity Log) */}
          <div id="what-i-did" className="bg-[#131620]/90 border border-[#33C3F0]/20 rounded-xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl hover:shadow-xl transition-all transform hover:scale-[1.005] duration-500 scroll-mt-20">
            <h3 className="text-lg sm:text-xl font-semibold text-[#CBD5E1] mb-3 sm:mb-4">What I Did</h3>
            <div className="space-y-4">
              <div className="bg-[#131620]/60 border border-[#33C3F0]/10 rounded-lg shadow-md">
                <div className="p-4 border-b border-[#33C3F0]/10 grid grid-cols-3 gap-4 font-medium text-sm text-[#7A7F92]">
                  <div>Date</div>
                  <div className="text-right">Net Worth</div>
                  <div className="text-right">Change</div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  <div className="grid grid-cols-3 gap-4 p-4 text-sm border-b border-[#1A1F2C]/60 hover:bg-[#1A1F2C]/40 transition-colors duration-150">
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                      Dec 31, 2023
                    </div>
                    <div className="text-right font-medium">{formatAmount(netWorth)}</div>
                    <div className="text-right flex justify-end items-center text-green-500">
                      <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
                      {formatAmount(netWorth - (netWorthHistory[netWorthHistory.length - 2]?.netWorth || netWorth))} ({percentChange.toFixed(1)}%)
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <UpdateBalancesModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
        />
        
        {/* Disclaimer for Export History */}
        <div className="mt-8 text-center text-xs text-muted-foreground pb-4">
          <p>
            Want to export your historical net worth data? 
            <a href="/settings" className="ml-1 text-[#33C3F0] hover:text-[#66EACE] underline">
              Visit Settings
            </a>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
