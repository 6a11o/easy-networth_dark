import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, ChartBar, Lock, PieChart, Shield, TrendingUp, ArrowUp, Wallet, BarChart3 } from "lucide-react";
import { Layout } from "@/components/Layout";

// Dashboard Preview component - Updated Structure
const DashboardPreview = () => {
  const formatAmount = (amount: number) => {
    // Simple Euro formatter for preview
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  const netWorth = 93000;
  const totalAssets = 115000;
  const totalLiabilities = 22000;
  const percentChange = 5.2; // Placeholder

  const assetsPercent = totalAssets + totalLiabilities > 0 ? Math.round((totalAssets / (totalAssets + totalLiabilities)) * 100) : 0;
  const liabilitiesPercent = totalAssets + totalLiabilities > 0 ? Math.round((totalLiabilities / (totalAssets + totalLiabilities)) * 100) : 0;
  
  // Placeholder allocation percentages
  const stockPercent = 50;
  const realEstatePercent = 35;
  const cashPercent = 15;

  // Calculate strokeDasharray for donut chart (circumference = 2 * PI * r = 2 * 3.14159 * 45 = 282.7)
  const stockDash = (stockPercent / 100) * 282.7;
  const realEstateDash = (realEstatePercent / 100) * 282.7;
  const cashDash = (cashPercent / 100) * 282.7;
  const remainingDash = 282.7; // Total circumference

  return (
    <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl border border-[#33C3F0]/30 bg-[#131620]/90 backdrop-blur-xl transform hover:scale-[1.01] transition-all duration-500 w-full max-w-6xl mx-auto p-6 space-y-8">
      
      {/* Floating particles & Glow Effects */}
      {[...Array(10)].map((_, i) => (
        <div 
          key={`particle-${i}`}
          className="absolute rounded-full bg-[#33C3F0]/10"
          style={{ 
            width: `${Math.random() * 4 + 2}px`, 
            height: `${Math.random() * 4 + 2}px`, 
            left: `${Math.random() * 100}%`, 
            top: `${Math.random() * 100}%`, 
            filter: 'blur(1px)', 
            opacity: Math.random() * 0.5 + 0.1, 
            animationDelay: `${Math.random() * 5}s`, 
            animation: `float ${Math.random() * 10 + 15}s linear infinite` 
          }}
        />
      ))}
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-[#33C3F0]/10 to-[#66EACE]/5 blur-3xl animate-[pulse_4s_ease-in-out_infinite]"></div>
      <div className="absolute -left-10 top-1/4 w-20 h-60 bg-[#33C3F0]/10 rounded-full blur-3xl"></div>
      <div className="absolute -right-10 bottom-1/4 w-20 h-60 bg-[#66EACE]/10 rounded-full blur-3xl"></div>

      {/* SECTION 1: My Money Today */}
      <div id="what-i-have-preview">
        <div className="flex flex-col items-center mb-4">
          <div className="bg-[#1A1F2C]/80 p-2 rounded-lg mb-2 shadow-md">
            <Wallet className="h-5 w-5 text-[#66EACE]" />
          </div>
          <h2 className="text-xl font-semibold text-center text-[#E2E8F0]">
            My Money Today
          </h2>
        </div>
        
        <div className="relative overflow-hidden rounded-lg bg-gradient-to-br from-[#1A1F2C]/50 to-[#131620]/70 p-6 border border-[#33C3F0]/20 shadow-inner backdrop-blur-sm">
          <div className="relative flex flex-col items-center text-center mb-4">
            <h3 className="text-md font-medium text-[#7A7F92]">What I Have</h3>
            <div className="mt-1 text-4xl sm:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#33C3F0] to-[#66EACE]">
              {formatAmount(netWorth)}
            </div>
            <div className="flex items-center mt-2 text-sm text-green-400">
              <ArrowUp className="h-4 w-4 mr-1" />
              <span>+{percentChange.toFixed(1)}% from last month</span>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
            <div className="bg-[#1A1F2C]/80 rounded-lg p-3 border border-[#33C3F0]/10 shadow-md">
              <h4 className="text-sm text-[#7A7F92] mb-1">Assets</h4>
              <div className="text-xl font-bold text-green-400">{formatAmount(totalAssets)}</div>
              <div className="flex items-center justify-between mt-1 text-xs text-[#7A7F92]">
                <span>{assetsPercent}% of total</span>
                <span className="flex items-center text-green-400">
                  <ArrowUp className="h-3 w-3 mr-0.5" /> +{percentChange.toFixed(1)}%
                </span>
              </div>
            </div>
            
            <div className="bg-[#1A1F2C]/80 rounded-lg p-3 border border-[#33C3F0]/10 shadow-md">
              <h4 className="text-sm text-[#7A7F92] mb-1">Liabilities</h4>
              <div className="text-xl font-bold text-red-400">{formatAmount(totalLiabilities)}</div>
              <div className="flex items-center justify-between mt-1 text-xs text-[#7A7F92]">
                <span>{liabilitiesPercent}% of total</span>
                <span className="flex items-center text-green-400">
                  <ArrowUp className="h-3 w-3 mr-0.5 rotate-180 text-red-400" /> -2.1%
                </span>
              </div>
            </div>
            
            <div className="col-span-2 md:col-span-1 bg-[#1A1F2C]/80 rounded-lg p-3 border border-[#33C3F0]/10 shadow-md">
              <h4 className="text-sm text-[#7A7F92] mb-1">Growth Rate</h4>
              <div className="text-xl font-bold text-[#66EACE]">+{percentChange.toFixed(1)}%</div>
              <div className="flex items-center mt-1 text-xs text-[#7A7F92]">
                <TrendingUp className="h-3 w-3 mr-1 text-[#66EACE]" />
                <span>This Month</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* SECTION 2: My Money Info */}
      <div id="financial-info-wrapper-preview">
        <div className="flex flex-col items-center mb-4">
           <div className="bg-[#1A1F2C]/80 p-2 rounded-lg mb-2 shadow-md">
              <BarChart3 className="h-5 w-5 text-[#66EACE]" />
            </div>
          <h2 className="text-xl font-semibold text-center text-[#E2E8F0]">
            My Money Info
          </h2>
        </div>

        {/* Placeholder: My Money over Time (Using original SVG Chart) */}
        <div id="money-over-time-preview" className="bg-[#131620]/90 border border-[#33C3F0]/20 rounded-xl p-4 shadow-xl backdrop-blur-xl mb-6">
          <h3 className="text-lg font-semibold text-[#CBD5E1] mb-3">My Money over Time</h3>
          <div className="h-[180px] mt-4 relative"> {/* Adjusted height */}
            <svg viewBox="0 0 600 200" className="w-full h-full overflow-visible">
              {/* Grid Lines */}
              <line x1="0" y1="0" x2="600" y2="0" className="stroke-[#272D3D] stroke-1" />
              <line x1="0" y1="50" x2="600" y2="50" className="stroke-[#272D3D] stroke-1" />
              <line x1="0" y1="100" x2="600" y2="100" className="stroke-[#272D3D] stroke-1" />
              <line x1="0" y1="150" x2="600" y2="150" className="stroke-[#272D3D] stroke-1" />
              <line x1="0" y1="200" x2="600" y2="200" className="stroke-[#272D3D] stroke-1" />
              {/* Chart Line */}
              <defs>
                <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#33C3F0" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#33C3F0" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Area Under Chart */}
              <path d="M0,180 L100,160 L200,150 L300,120 L400,80 L500,50 L600,40 L600,200 L0,200 Z" fill="url(#chartGradient)" className="opacity-60"/>
              {/* Line */}
              <path d="M0,180 L100,160 L200,150 L300,120 L400,80 L500,50 L600,40" fill="none" stroke="#33C3F0" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              {/* Data Points */}
              <circle cx="0" cy="180" r="4" fill="#0A0C14" stroke="#33C3F0" strokeWidth="2" />
              <circle cx="100" cy="160" r="4" fill="#0A0C14" stroke="#33C3F0" strokeWidth="2" />
              <circle cx="200" cy="150" r="4" fill="#0A0C14" stroke="#33C3F0" strokeWidth="2" />
              <circle cx="300" cy="120" r="4" fill="#0A0C14" stroke="#33C3F0" strokeWidth="2" />
              <circle cx="400" cy="80" r="4" fill="#0A0C14" stroke="#33C3F0" strokeWidth="2" />
              <circle cx="500" cy="50" r="4" fill="#0A0C14" stroke="#33C3F0" strokeWidth="2" />
              <circle cx="600" cy="40" r="6" fill="#0A0C14" stroke="#33C3F0" strokeWidth="2" className="animate-pulse" />
            </svg>
            {/* X Axis Labels */}
            <div className="flex justify-between text-xs text-[#7A7F92] mt-2">
              <div>Feb</div> <div>Mar</div> <div>Apr</div> <div>May</div> <div>Jun</div> <div>Jul</div> <div>Aug</div>
            </div>
          </div>
        </div>
        
        {/* Placeholder: Where I Have it (Using original Allocation/Accounts) */}
        <div id="where-i-have-it-preview" className="bg-[#131620]/90 border border-[#33C3F0]/20 rounded-xl p-4 shadow-xl backdrop-blur-xl">
            <h3 className="text-lg font-semibold text-[#CBD5E1] mb-4">Where I Have it</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Allocation Chart */}
              <div className="bg-[#1A1F2C]/60 border border-[#33C3F0]/10 rounded-lg p-4 relative">
                <h4 className="text-md font-medium mb-3 text-[#E2E8F0]">Asset Allocation</h4>
                <div className="flex items-center justify-center">
                  <div className="relative w-40 h-40"> {/* Adjusted size */}
                    <svg viewBox="0 0 100 100" className="w-full h-full" style={{ transform: "rotate(-90deg)" }}>
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#272D3D" strokeWidth="10" />
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#33C3F0" strokeWidth="10" strokeDasharray={`${stockDash} ${remainingDash}`} />
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#66EACE" strokeWidth="10" strokeDasharray={`${realEstateDash} ${remainingDash}`} strokeDashoffset={-stockDash} />
                      <circle cx="50" cy="50" r="45" fill="none" stroke="#4ade80" strokeWidth="10" strokeDasharray={`${cashDash} ${remainingDash}`} strokeDashoffset={-(stockDash + realEstateDash)} />
                      <circle cx="50" cy="50" r="35" fill="#1A1F2C" /> {/* Inner circle */}
                    </svg>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3 text-sm">
                  <div className="flex items-center"><div className="w-2.5 h-2.5 rounded-full bg-[#33C3F0] mr-2"></div><span>Stocks ({stockPercent}%)</span></div>
                  <div className="flex items-center"><div className="w-2.5 h-2.5 rounded-full bg-[#66EACE] mr-2"></div><span>Real Estate ({realEstatePercent}%)</span></div>
                  <div className="flex items-center"><div className="w-2.5 h-2.5 rounded-full bg-[#4ade80] mr-2"></div><span>Cash ({cashPercent}%)</span></div>
                </div>
              </div>
              
              {/* Top Accounts List */}
               <div className="bg-[#1A1F2C]/60 border border-[#33C3F0]/10 rounded-lg p-4">
                <h4 className="text-md font-medium mb-3 text-[#E2E8F0]">Top Accounts</h4>
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center p-1.5 bg-[#272D3D]/50 rounded">
                    <div className="flex items-center"><div className="w-1.5 h-6 bg-[#33C3F0] rounded-sm mr-2"></div><div><h5 className="text-sm font-medium">Stock Portfolio</h5><p className="text-xs text-[#7A7F92]">Stocks</p></div></div>
                    <div className="text-sm text-green-400 font-medium">{formatAmount(50000)}</div>
                  </div>
                  <div className="flex justify-between items-center p-1.5 bg-[#272D3D]/50 rounded">
                     <div className="flex items-center"><div className="w-1.5 h-6 bg-[#66EACE] rounded-sm mr-2"></div><div><h5 className="text-sm font-medium">Rental Property</h5><p className="text-xs text-[#7A7F92]">Real Estate</p></div></div>
                    <div className="text-sm text-green-400 font-medium">{formatAmount(45000)}</div>
                  </div>
                   <div className="flex justify-between items-center p-1.5 bg-[#272D3D]/50 rounded">
                    <div className="flex items-center"><div className="w-1.5 h-6 bg-[#4ade80] rounded-sm mr-2"></div><div><h5 className="text-sm font-medium">Savings Account</h5><p className="text-xs text-[#7A7F92]">Cash</p></div></div>
                    <div className="text-sm text-green-400 font-medium">{formatAmount(20000)}</div>
                  </div>
                   <div className="flex justify-between items-center p-1.5 bg-[#272D3D]/50 rounded">
                    <div className="flex items-center"><div className="w-1.5 h-6 bg-red-400 rounded-sm mr-2"></div><div><h5 className="text-sm font-medium">Mortgage</h5><p className="text-xs text-[#7A7F92]">Loan</p></div></div>
                    <div className="text-sm text-red-400 font-medium">{formatAmount(-22000)}</div>
                  </div>
                </div>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

const LandingPage = () => {
  return (
    <Layout requireAuth={false}>
      <div className="w-full">
        {/* Hero Section */}
        <section className="w-full min-h-screen py-24 lg:py-32 relative overflow-hidden flex items-center">
          {/* Abstract Minimalist Background */}
          <div className="absolute inset-0 bg-[#0a0d14]">
            {/* Grid Lines */}
            <div className="absolute inset-0 grid grid-cols-6 opacity-10">
              {[...Array(7)].map((_, i) => (
                <div key={`grid-v-${i}`} className="border-r border-[#33C3F0]/20 h-full"></div>
              ))}
            </div>
            <div className="absolute inset-0 grid grid-rows-6 opacity-10">
              {[...Array(7)].map((_, i) => (
                <div key={`grid-h-${i}`} className="border-b border-[#33C3F0]/20 w-full"></div>
              ))}
            </div>
            
            {/* Abstract Visual Elements */}
            <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-gradient-to-bl from-[#33C3F0]/30 to-transparent blur-3xl"></div>
            <div className="absolute -left-20 bottom-1/3 h-64 w-64 rounded-full bg-gradient-to-tr from-[#66EACE]/20 to-transparent blur-3xl"></div>
            
            {/* Animated Plus Symbols (Representing Assets) */}
            {[...Array(6)].map((_, i) => (
              <div
                key={`plus-${i}`}
                className="absolute text-[#33C3F0]/10 text-7xl font-thin"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  transform: `rotate(${Math.random() * 45}deg)`,
                  animationDelay: `${Math.random() * 8}s`,
                  animation: `float ${10 + Math.random() * 20}s ease-in-out infinite`
                }}
              >
                +
              </div>
            ))}
            
            {/* Animated Minus Symbols (Representing Liabilities) */}
            {[...Array(3)].map((_, i) => (
              <div
                key={`minus-${i}`}
                className="absolute text-red-400/10 text-7xl font-thin"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animation: `float ${10 + Math.random() * 15}s ease-in-out infinite`
                }}
              >
                −
              </div>
            ))}
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              {/* Left Column: Text Content */}
              <div className="flex flex-col text-left space-y-8">
                {/* Clean Logo and Brand Name */}
                <div className="mb-8 flex items-center">
                  <div className="relative mr-4">
                    <img src="/logo.svg" alt="EASY NET WORTH Logo" className="h-12 w-12 drop-shadow-[0_0_3px_rgba(51,195,240,0.3)]" />
                    <div className="absolute -inset-0.5 bg-gradient-to-br from-[#33C3F0]/10 to-transparent rounded-full blur-sm -z-10"></div>
                  </div>
                  
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                    <span className="text-white">EASY</span>
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#33C3F0] to-[#66EACE] ml-2">NET WORTH</span>
                  </h1>
                </div>
                
                <h2 className="text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight">
                  <span className="block">See what</span>
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#33C3F0] to-[#66EACE]">
                    you're worth.
                  </span>
                </h2>
                
                <p className="text-xl text-gray-300 leading-relaxed max-w-lg">
                  One clear view of what you own, what you owe, and how it's changing. No fluff. No need to link your bank accounts. Just the number that matters.
                </p>
                
                <div className="flex flex-wrap gap-4 pt-4">
                  <Link to="/signup">
                    <Button className="bg-gradient-to-r from-[#33C3F0] to-[#66EACE] hover:from-[#33C3F0]/90 hover:to-[#66EACE]/90 text-black font-semibold text-lg px-8 py-5 rounded-lg shadow-lg shadow-[#33C3F0]/20 transition-all transform hover:translate-y-[-2px]">
                      Try it now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline" className="border-[#33C3F0]/40 hover:bg-[#33C3F0]/10 text-white font-medium text-lg px-8 py-5 rounded-lg transition-all">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
              
              {/* Right Column: Conceptual Visualization */}
              <div className="relative w-full mt-8 lg:mt-0">
                <div className="md:hidden flex flex-col items-center mb-8">
                  {/* Mobile Simplified Visualization */}
                  <div className="relative w-full max-w-[340px] bg-[#0d1117] border border-[#33C3F0]/20 rounded-xl p-5 shadow-lg">
                    <div className="absolute -inset-1 bg-gradient-to-br from-[#33C3F0]/5 to-[#66EACE]/5 rounded-xl blur-md opacity-50"></div>
                    {/* Adding decorative elements for mobile */}
                    <div className="absolute top-3 left-3 text-[10px] text-[#33C3F0]/30 font-mono">01</div>
                    <div className="absolute bottom-3 right-3 text-[10px] text-[#33C3F0]/30 font-mono">02</div>
                    {/* Tech Decoration for mobile */}
                    <div className="absolute top-1/2 right-2 h-16 flex flex-col items-end justify-center opacity-30 space-y-1">
                      <div className="h-0.5 w-2 bg-[#33C3F0]"></div>
                      <div className="h-0.5 w-3 bg-[#33C3F0]"></div>
                      <div className="h-0.5 w-2 bg-[#33C3F0]"></div>
                    </div>
                    <div className="relative">
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-sm font-medium uppercase tracking-wider text-[#7A7F92]">Net Worth</div>
                        <div className="flex items-center text-xs text-green-400 bg-green-400/10 rounded-full px-2 py-0.5">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          <span>5.2%</span>
                        </div>
                      </div>
                      <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#33C3F0] to-[#66EACE] mb-4">€93,000</div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="border border-[#33C3F0]/10 rounded-lg p-3">
                          <div className="text-xs text-[#7A7F92] uppercase tracking-wider mb-1">Assets</div>
                          <div className="text-xl font-semibold text-green-400">€115,000</div>
                        </div>
                        <div className="border border-[#33C3F0]/10 rounded-lg p-3">
                          <div className="text-xs text-[#7A7F92] uppercase tracking-wider mb-1">Liabilities</div>
                          <div className="text-xl font-semibold text-red-400">€22,000</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="hidden md:flex items-center justify-center">
                  {/* ULTRA EXPLOSIVE Futuristic Balance Visualization */}
                  <div className="relative w-full max-w-3xl p-8 space-y-10 transform transition-all duration-500 group" style={{ perspective: '1000px' }}>
                    {/* Floating Particles Layer */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      {[...Array(15)].map((_, i) => (
                        <div 
                          key={`particle-${i}`} 
                          className="absolute w-1.5 h-1.5 rounded-full bg-[#33C3F0]/60 blur-[1px]" 
                          style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDuration: `${8 + Math.random() * 15}s`,
                            animationDelay: `${Math.random() * 5}s`
                          }}
                        />
                      ))}
                      {[...Array(10)].map((_, i) => (
                        <div 
                          key={`particle-sm-${i}`} 
                          className="absolute w-0.5 h-0.5 rounded-full bg-[#66EACE]/70" 
                          style={{
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                            animationDuration: `${5 + Math.random() * 10}s`,
                            animationDelay: `${Math.random() * 5}s`
                          }}
                        />
                      ))}
                    </div>
                    
                    {/* Circuit Pattern Layer */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div className="absolute bottom-[15%] right-[10%] w-[120px] h-[80px]">
                        <svg viewBox="0 0 120 80" className="w-full h-full opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                          <path d="M0,40 L30,40 L40,30 L80,30 L90,20 L120,20" 
                                fill="none" 
                                stroke="#33C3F0" 
                                strokeWidth="0.5" 
                                className="animate-draw-line" />
                          <path d="M0,60 L20,60 L30,50 L60,50 L70,60 L120,60" 
                                fill="none" 
                                stroke="#33C3F0" 
                                strokeWidth="0.5" 
                                className="animate-draw-line animation-delay-150" />
                          <circle cx="40" cy="30" r="2" fill="#33C3F0" className="animate-pulse-slow" />
                          <circle cx="90" cy="20" r="2" fill="#33C3F0" className="animate-pulse-slow animation-delay-300" />
                          <circle cx="30" cy="50" r="2" fill="#33C3F0" className="animate-pulse-slow animation-delay-150" />
                          <circle cx="70" cy="60" r="2" fill="#33C3F0" className="animate-pulse-slow animation-delay-450" />
                        </svg>
                      </div>
                      <div className="absolute top-[15%] left-[10%] w-[120px] h-[80px]">
                        <svg viewBox="0 0 120 80" className="w-full h-full opacity-20 group-hover:opacity-40 transition-opacity duration-500">
                          <path d="M120,40 L90,40 L80,30 L40,30 L30,20 L0,20" 
                                fill="none" 
                                stroke="#33C3F0" 
                                strokeWidth="0.5" 
                                className="animate-draw-line animation-delay-300" />
                          <path d="M120,60 L100,60 L90,50 L60,50 L50,60 L0,60" 
                                fill="none" 
                                stroke="#33C3F0" 
                                strokeWidth="0.5" 
                                className="animate-draw-line animation-delay-450" />
                          <circle cx="80" cy="30" r="2" fill="#33C3F0" className="animate-pulse-slow animation-delay-450" />
                          <circle cx="30" cy="20" r="2" fill="#33C3F0" className="animate-pulse-slow animation-delay-600" />
                          <circle cx="90" cy="50" r="2" fill="#33C3F0" className="animate-pulse-slow animation-delay-300" />
                          <circle cx="50" cy="60" r="2" fill="#33C3F0" className="animate-pulse-slow animation-delay-150" />
                        </svg>
                      </div>
                    </div>

                    {/* Holographic Overlay Effect */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#33C3F0]/5 via-transparent to-[#66EACE]/5 opacity-0 group-hover:opacity-20 transition-opacity duration-500 rounded-xl pointer-events-none holographic-noise"></div>
                    
                    {/* Corner Brackets (Enhanced Animation) */}
                    <div className="absolute -top-2 -left-2 w-8 h-8 border-l-2 border-t-2 border-[#33C3F0]/40 rounded-tl-lg transition-all duration-300 group-hover:border-[#33C3F0]/80 group-hover:scale-110 animate-corner-pulse"></div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 border-r-2 border-t-2 border-[#33C3F0]/40 rounded-tr-lg transition-all duration-300 group-hover:border-[#33C3F0]/80 group-hover:scale-110 animate-corner-pulse animation-delay-200"></div>
                    <div className="absolute -bottom-2 -left-2 w-8 h-8 border-l-2 border-b-2 border-[#33C3F0]/40 rounded-bl-lg transition-all duration-300 group-hover:border-[#33C3F0]/80 group-hover:scale-110 animate-corner-pulse animation-delay-400"></div>
                    <div className="absolute -bottom-2 -right-2 w-8 h-8 border-r-2 border-b-2 border-[#33C3F0]/40 rounded-br-lg transition-all duration-300 group-hover:border-[#33C3F0]/80 group-hover:scale-110 animate-corner-pulse animation-delay-600"></div>
                    
                    {/* Tech Grid Background (Interactive) */}
                    <div className="absolute inset-0 overflow-hidden rounded-xl z-0">
                      <div className="absolute inset-0 grid grid-cols-32 grid-rows-32 opacity-5 group-hover:opacity-10 transition-opacity duration-300">
                        {[...Array(33)].map((_, i) => ( <div key={`tech-grid-v-${i}`} className="border-r border-[#33C3F0]/15 border-dashed h-full"></div> ))}
                        {[...Array(33)].map((_, i) => ( <div key={`tech-grid-h-${i}`} className="border-b border-[#33C3F0]/15 border-dashed w-full"></div> ))}
                      </div>
                      {/* Ambient Glow (Animated) */}
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial from-[#33C3F0]/15 via-transparent to-transparent blur-3xl opacity-40 group-hover:opacity-60 transition-opacity duration-500 animate-pulse-slow"></div>
                    </div>

                    {/* Data Stream Animation */}
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-30">
                      <div className="absolute h-full w-0.5 bg-gradient-to-b from-transparent via-[#33C3F0]/30 to-transparent left-[30%] animate-data-stream"></div>
                      <div className="absolute h-full w-0.5 bg-gradient-to-b from-transparent via-[#33C3F0]/30 to-transparent left-[70%] animate-data-stream animation-delay-450"></div>
                      <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-[#33C3F0]/30 to-transparent top-[25%] animate-data-stream-horizontal animation-delay-300"></div>
                      <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-[#33C3F0]/30 to-transparent top-[75%] animate-data-stream-horizontal animation-delay-600"></div>
                    </div>

                    {/* Main Display Elements */}
                    <div className="relative z-10 flex flex-col items-center space-y-6 transition-transform duration-500 group-hover:[transform:rotateX(5deg)]" 
                         style={{ transformStyle: 'preserve-3d' }}>
                      {/* Top Section: Net Worth Result (Interactive Tilt & Scan Line) */}
                      <div className="relative w-[320px] transition-transform duration-300 group-hover:-translate-y-1">
                        <div className="absolute -inset-3 bg-gradient-to-br from-[#33C3F0]/20 to-[#66EACE]/15 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 group-hover:blur-2xl transition-all duration-500 animate-pulse-slow"></div>
                        <div className="relative bg-[#0A0D14]/80 border border-[#33C3F0]/40 rounded-xl p-6 shadow-xl backdrop-blur-lg transition-all duration-300 group-hover:border-[#33C3F0]/60 group-hover:shadow-cyan-glow overflow-hidden hover:scale-105 card-hologram">
                          {/* Scanning Line */}
                          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                             <div className="absolute top-0 left-0 w-0.5 h-full bg-[#66EACE] shadow-[0_0_15px_rgba(102,234,206,0.7)] animate-scan-line"></div>
                          </div>

                          {/* Reactive Pulse Elements */}
                          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                            <div className="absolute top-0 left-0 w-full h-full bg-[#33C3F0]/1 opacity-0 hover:opacity-100 transition-opacity duration-200 reactive-pulse"></div>
                          </div>

                          <div className="relative z-10"> {/* Content above scan line */}
                            <div className="flex justify-between items-center mb-2">
                              <div className="text-xs font-semibold uppercase tracking-widest text-[#7A7F92] group-hover:text-[#33C3F0]/80 transition-colors duration-300">Net Worth</div>
                              <div className="flex items-center text-[11px] text-green-400 bg-green-400/10 rounded-full px-1.5 py-0.5 hover:bg-green-400/20 transition-colors duration-300">
                                <ArrowUp className="h-2.5 w-2.5 mr-0.5" />
                                <span>5.2%</span>
                              </div>
                            </div>
                            <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#66EACE] to-[#33C3F0] mb-2 animate-text-shine relative">
                              €93,000
                              <span className="absolute -bottom-px left-0 w-full h-px bg-gradient-to-r from-[#66EACE]/30 to-[#33C3F0]/30"></span>
                            </div>
                            {/* Data Visualization Line (with Pulsing Endpoints) */}
                            <div className="h-1 w-full bg-[#1A1F2C]/70 rounded-full mt-3 relative flex items-center overflow-hidden">
                              <div className="h-full bg-gradient-to-r from-green-500 to-green-400 w-[84%] rounded-l-full relative">
                                {/* Pulsing dot for Assets end */} 
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2 h-2 rounded-full bg-green-300 shadow-[0_0_8px_rgba(74,222,128,0.8)] animate-ping-slow"></div>
                              </div>
                              <div className="h-full bg-gradient-to-r from-red-400 to-red-500 w-[16%] rounded-r-full relative">
                                {/* Pulsing dot for Liabilities start */}
                                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-red-300 shadow-[0_0_8px_rgba(248,113,113,0.8)] animate-ping-slow animation-delay-300"></div>
                              </div>
                              {/* Shimmer Effect */}
                              <div className="absolute top-0 left-0 h-full w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer rounded-full"></div>
                            </div>
                            <div className="flex justify-between mt-1.5 text-[10px] text-[#7A7F92]">
                              <span>Assets 84%</span>
                              <span>Liabilities 16%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Connecting Graphic Elements */}
                      <div className="h-10 flex flex-col items-center justify-center space-y-1 opacity-50 group-hover:opacity-80 transition-opacity duration-300">
                         <div className="w-px h-4 bg-gradient-to-b from-[#33C3F0]/0 via-[#33C3F0]/50 to-[#33C3F0]/0 animate-drip-pulse"></div>
                         <div className="w-1 h-1 rounded-full bg-[#33C3F0]/70 animate-ping-slow animation-delay-150"></div>
                         <div className="w-px h-4 bg-gradient-to-b from-[#33C3F0]/0 via-[#33C3F0]/50 to-[#33C3F0]/0 animate-drip-pulse animation-delay-300"></div>
                      </div>

                      {/* Bottom Section: Assets & Liabilities (Interactive Tilt) */}
                      <div className="w-full flex justify-between items-start space-x-6">
                        {/* Assets Display */}
                        <div className="w-1/2 relative transition-transform duration-500 group-hover:translate-x-1 group-hover:[transform:rotateY(-5deg)]" 
                             style={{ transformStyle: 'preserve-3d' }}>
                          <div className="absolute -inset-2 rounded-xl bg-gradient-to-br from-green-400/20 to-transparent blur-lg opacity-60 group-hover:opacity-90 group-hover:blur-xl transition-all duration-500"></div>
                          <div className="relative bg-[#0A0D14]/70 border border-[#33C3F0]/20 rounded-xl p-5 transition-all duration-300 group-hover:border-green-400/50 group-hover:shadow-green-glow card-hologram" style={{ transformStyle: 'preserve-3d' }}>
                            <div className="flex items-start justify-between mb-2">
                              <div className="text-[11px] text-[#7A7F92] uppercase tracking-wider font-medium group-hover:text-green-400/80 transition-colors duration-300">Assets</div>
                              <div className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.7)]"></div>
                            </div>
                            <div className="text-2xl font-semibold text-green-400 mb-1.5 relative">
                              €115,000
                              <div className="absolute -bottom-0.5 left-0 w-full h-px bg-gradient-to-r from-green-400/40 to-transparent"></div>
                            </div>
                            <div className="w-full h-0.5 bg-gradient-to-r from-green-400/50 to-green-400/20 rounded-full overflow-hidden">
                              <div className="w-1/3 h-full bg-green-300/30 animate-shimmer"></div>
                            </div>
                          </div>
                        </div>

                        {/* Liabilities Display */}
                        <div className="w-1/2 relative transition-transform duration-500 group-hover:-translate-x-1 group-hover:[transform:rotateY(5deg)]" 
                             style={{ transformStyle: 'preserve-3d' }}>
                          <div className="absolute -inset-2 rounded-xl bg-gradient-to-bl from-red-400/20 to-transparent blur-lg opacity-60 group-hover:opacity-90 group-hover:blur-xl transition-all duration-500"></div>
                          <div className="relative bg-[#0A0D14]/70 border border-[#33C3F0]/20 rounded-xl p-5 transition-all duration-300 group-hover:border-red-400/50 group-hover:shadow-red-glow card-hologram" style={{ transformStyle: 'preserve-3d' }}>
                            <div className="flex items-start justify-between mb-2">
                              <div className="text-[11px] text-[#7A7F92] uppercase tracking-wider font-medium group-hover:text-red-400/80 transition-colors duration-300">Liabilities</div>
                              <div className="w-1.5 h-1.5 rounded-full bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.7)]"></div>
                            </div>
                            <div className="text-2xl font-semibold text-red-400 mb-1.5 relative">
                              €22,000
                              <div className="absolute -bottom-0.5 left-0 w-full h-px bg-gradient-to-r from-red-400/40 to-transparent"></div>
                            </div>
                            <div className="w-full h-0.5 bg-gradient-to-r from-red-400/50 to-red-400/20 rounded-full overflow-hidden">
                              <div className="w-1/3 h-full bg-red-300/30 animate-shimmer animation-delay-300"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Data Flow Particles - Small Bits Moving Between Elements */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#33C3F0] animate-data-bit"></div>
                      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#66EACE] animate-data-bit animation-delay-300"></div>
                      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-green-400 animate-data-bit animation-delay-600"></div>
                      <div className="absolute top-[40%] left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-red-400 animate-data-bit animation-delay-900"></div>
                    </div>

                    {/* Tech Decoration Elements (Even Subtler) */}
                    <div className="absolute top-4 left-4 text-[9px] text-[#33C3F0]/15 font-mono z-0">01</div>
                    <div className="absolute bottom-4 right-4 text-[9px] text-[#33C3F0]/15 font-mono z-0">02</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Dashboard Preview Section */}
        <section className="w-full py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-[#33C3F0] to-[#66EACE]">
              Your Dashboard: All Your Money Info in One Place
            </h2>
            <DashboardPreview />
          </div>
        </section>
        
        {/* Features Section */}
        <section className="w-full py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-[#33C3F0] to-[#66EACE]">
              Simple Tracking, Big Picture
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              <div className="glass-panel rounded-xl p-8 glass-panel-hover">
                <div className="bg-[#33C3F0]/20 p-4 rounded-full w-fit mb-6 shadow-inner">
                  <Shield className="h-8 w-8 text-[#33C3F0]" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Keep Your Data Private</h3>
                <p className="text-gray-300 leading-relaxed">
                  No bank logins needed. You enter your balances manually, keeping your sensitive info safe and offline.
                </p>
              </div>
              
              <div className="glass-panel rounded-xl p-8 glass-panel-hover">
                <div className="bg-[#33C3F0]/20 p-4 rounded-full w-fit mb-6 shadow-inner">
                  <PieChart className="h-8 w-8 text-[#33C3F0]" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">See Your Finances Clearly</h3>
                <p className="text-gray-300 leading-relaxed">
                  Simple charts show where your money is and how it's changing. No confusing jargon.
                </p>
              </div>
              
              <div className="glass-panel rounded-xl p-8 glass-panel-hover">
                <div className="bg-[#33C3F0]/20 p-4 rounded-full w-fit mb-6 shadow-inner">
                  <ChartBar className="h-8 w-8 text-[#33C3F0]" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">Watch Your Money Grow</h3>
                <p className="text-gray-300 leading-relaxed">
                  See your net worth change each time you update. Stay motivated and track your progress easily.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="w-full py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-[#33C3F0] to-[#66EACE]">
              Get Started in 3 Steps
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
              <div className="text-center">
                <div className="bg-[#1A1F2C] h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#33C3F0]/20 shadow-md shadow-[#33C3F0]/5">
                  <span className="text-4xl font-bold text-[#33C3F0]">1</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">List What You Own & Owe</h3>
                <p className="text-gray-300">
                  Quickly add things like savings accounts, investments (assets), and loans or credit cards (liabilities).
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-[#1A1F2C] h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#33C3F0]/20 shadow-md shadow-[#33C3F0]/5">
                  <span className="text-4xl font-bold text-[#33C3F0]">2</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">Enter Current Balances</h3>
                <p className="text-gray-300">
                  Type in the latest amounts for each item whenever you want (we suggest monthly!).
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-[#1A1F2C] h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#33C3F0]/20 shadow-md shadow-[#33C3F0]/5">
                  <span className="text-4xl font-bold text-[#33C3F0]">3</span>
                </div>
                <h3 className="text-2xl font-bold mb-3 text-white">See Your Net Worth</h3>
                <p className="text-gray-300">
                  Instantly see your total net worth (what you own minus what you owe) and how it's changing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-16 lg:py-24 scroll-mt-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-[#33C3F0] to-[#66EACE]">
              Choose Your Plan
            </h2>
            
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8 items-stretch">
              {/* Option 1: Free */}
              <div className="glass-panel rounded-xl p-8 flex flex-col border border-[#33C3F0]/20 hover:border-[#33C3F0]/40 transition-all duration-300 hover:shadow-lg hover:shadow-[#33C3F0]/10 transform hover:-translate-y-1 bg-gradient-to-br from-[#131620]/80 to-[#1A1F2C]/90 backdrop-blur-lg">
                <h3 className="text-2xl font-bold mb-4 text-center text-[#AEB4C8]">Free Plan</h3>
                <p className="text-center text-gray-400 mb-8">Get started with the basics, forever free.</p>
                <ul className="space-y-4 mb-10 flex-grow text-gray-300">
                  <li className="flex items-center">
                    <div className="h-5 w-5 mr-3 text-[#33C3F0]/70 rounded-full bg-[#33C3F0]/10 flex items-center justify-center font-bold text-sm">✓</div>
                    Track 3 Assets (e.g., savings, car)
                  </li>
                  <li className="flex items-center">
                    <div className="h-5 w-5 mr-3 text-[#33C3F0]/70 rounded-full bg-[#33C3F0]/10 flex items-center justify-center font-bold text-sm">✓</div>
                    Track 2 Liabilities (e.g., credit card, loan)
                  </li>
                  <li className="flex items-center">
                    <div className="h-5 w-5 mr-3 text-[#33C3F0]/70 rounded-full bg-[#33C3F0]/10 flex items-center justify-center font-bold text-sm">✓</div>
                    See your net worth snapshot
                  </li>
                  <li className="flex items-center">
                    <div className="h-5 w-5 mr-3 text-[#33C3F0]/70 rounded-full bg-[#33C3F0]/10 flex items-center justify-center font-bold text-sm">✓</div>
                    Keep the last 3 balance updates
                  </li>
                </ul>
                
                <Link to="/signup" className="mt-auto">
                  <Button variant="outline" className="w-full border-[#33C3F0]/30 hover:bg-[#33C3F0]/10 text-white py-3 rounded-lg text-lg transition-colors duration-300 font-medium">
                    Start with Free
                  </Button>
                </Link>
              </div>

              {/* Option 2: Lifetime */}
              <div className="glass-panel rounded-xl p-8 flex flex-col relative overflow-hidden border border-[#66EACE]/30 premium-card shadow-lg shadow-[#66EACE]/10 transform hover:-translate-y-1 transition-all duration-300">
                 <div className="absolute top-3 -right-10 bg-[#66EACE] text-black font-bold py-1 px-10 uppercase text-xs tracking-wider transform rotate-45 shadow-md">
                  Best Value
                </div>
                <h3 className="text-2xl font-bold mb-4 text-center text-white">Lifetime Access</h3>
                 <p className="text-center text-[#66EACE] mb-2 font-medium">Pay once, use forever. All features included.</p>
                <div className="text-center mb-6">
                  <span className="text-5xl font-bold text-white">€39.99</span>
                  <span className="text-lg text-[#7A7F92]"> one time</span>
                </div>
                
                <ul className="space-y-3 mb-8 flex-grow text-gray-300">
                  <li className="flex items-center">
                    <div className="h-5 w-5 mr-3 text-[#66EACE] rounded-full bg-[#66EACE]/20 flex items-center justify-center text-xs">✓</div>
                    Track Unlimited Items
                  </li>
                  <li className="flex items-center">
                    <div className="h-5 w-5 mr-3 text-[#66EACE] rounded-full bg-[#66EACE]/20 flex items-center justify-center text-xs">✓</div>
                    Detailed Charts & History
                  </li>
                  <li className="flex items-center">
                    <div className="h-5 w-5 mr-3 text-[#66EACE] rounded-full bg-[#66EACE]/20 flex items-center justify-center text-xs">✓</div>
                    Keep All Balance Updates
                  </li>
                  <li className="flex items-center">
                    <div className="h-5 w-5 mr-3 text-[#66EACE] rounded-full bg-[#66EACE]/20 flex items-center justify-center text-xs">✓</div>
                    Export Your Data (CSV)
                  </li>
                   <li className="flex items-center">
                    <div className="h-5 w-5 mr-3 text-[#66EACE] rounded-full bg-[#66EACE]/20 flex items-center justify-center text-xs">✓</div>
                    Get All Future Features
                  </li>
                </ul>
                
                <Link to="/signup?pro=true" className="mt-auto"> 
                  <Button className="w-full bg-gradient-to-r from-[#33C3F0] to-[#66EACE] hover:from-[#33C3F0]/90 hover:to-[#66EACE]/90 text-black font-bold py-3 rounded-lg text-lg shadow-lg shadow-[#33C3F0]/20 transition-all duration-300">
                    Get Lifetime Access
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="w-full py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-[#33C3F0] to-[#66EACE]">
              Quick Questions
            </h2>
            
            <div className="max-w-6xl mx-auto space-y-6">
              {/* New FAQ 1 */}
              <div className="bg-[#131620] border border-[#1A1F2C] rounded-xl p-6">
                <h3 className="text-xl font-bold mb-2 text-white">Why Easy Net Worth?</h3>
                <p className="text-gray-300">
                  Because most money apps do too much. We focus on one thing only: showing your net worth simply and clearly.
                </p>
              </div>

              {/* Existing FAQ 1 (was Is my money info safe?) */}
              <div className="bg-[#131620] border border-[#1A1F2C] rounded-xl p-6">
                <h3 className="text-xl font-bold mb-2 text-white">Is my money info safe?</h3>
                <p className="text-gray-300">
                  Yes! We never ask for bank logins. You only enter balances. Your info stays on your device or our secure servers (encrypted, of course).
                </p>
              </div>
              
              <div className="bg-[#131620] border border-[#1A1F2C] rounded-xl p-6">
                <h3 className="text-xl font-bold mb-2 text-white">Can I get my data out?</h3>
                <p className="text-gray-300">
                  Sure can. With the Lifetime plan, you can download your history as a simple CSV file anytime.
                </p>
              </div>
              
              <div className="bg-[#131620] border border-[#1A1F2C] rounded-xl p-6">
                <h3 className="text-xl font-bold mb-2 text-white">How often do I update?</h3>
                <p className="text-gray-300">
                  Up to you! Once a month is great for seeing trends. But you can update whenever you like.
                </p>
              </div>
              
              <div className="bg-[#131620] border border-[#1A1F2C] rounded-xl p-6">
                <h3 className="text-xl font-bold mb-2 text-white">What's "Net Worth"?</h3>
                <p className="text-gray-300">
                  It's just what you own (Assets like savings, investments) minus what you owe (Liabilities like loans, credit card debt). It's a simple way to see your overall financial health.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="w-full py-16 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto bg-gradient-to-br from-[#131620] to-[#1A1F2C] rounded-2xl border border-[#33C3F0]/20 p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-30">
                <div className="absolute -left-10 top-1/4 w-40 h-40 bg-[#33C3F0]/20 rounded-full blur-3xl"></div>
                <div className="absolute -right-10 bottom-1/4 w-40 h-40 bg-[#66EACE]/20 rounded-full blur-3xl"></div>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold mb-6 relative">
                Ready to See Your Net Worth?
              </h2>
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto relative">
                Stop guessing. Start tracking simply. It's free to try!
              </p>
              <div className="relative">
                <Link to="/signup">
                  <Button className="bg-gradient-to-r from-[#33C3F0] to-[#66EACE] hover:from-[#33C3F0]/90 hover:to-[#66EACE]/90 text-black font-medium text-lg px-10 py-6 rounded-lg shadow-lg shadow-[#33C3F0]/20 transition-all">
                    Sign Up Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="w-full py-12 border-t border-[#1A1F2C]/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-6 md:mb-0">
                <img src="/logo.svg" alt="EASY NET WORTH Logo" className="h-8 w-8 mr-2" />
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#33C3F0] to-[#66EACE]">
                  EASY NET WORTH
                </span>
              </div>
              
              <div className="text-[#7A7F92] text-sm">
                © {new Date().getFullYear()} Easy Net Worth. All rights reserved. 
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Layout>
  );
};

export default LandingPage;
