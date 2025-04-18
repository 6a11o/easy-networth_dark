import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, ChartBar, Lock, PieChart, Shield, TrendingUp, ArrowUp, Wallet, BarChart3 } from "lucide-react";

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
    <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl border border-[#33C3F0]/30 bg-[#131620]/90 backdrop-blur-xl transform hover:scale-[1.01] transition-all duration-500 max-w-5xl mx-auto p-6 space-y-8">
      
      {/* Floating particles & Glow Effects (copied from original) */}
      {[...Array(10)].map((_, i) => (
        <div 
          key={`particle-${i}`}
          className="absolute rounded-full bg-[#33C3F0]/10"
          style={{ width: `${Math.random() * 4 + 2}px`, height: `${Math.random() * 4 + 2}px`, left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%`, filter: 'blur(1px)', opacity: Math.random() * 0.5 + 0.1, animationDelay: `${Math.random() * 5}s`, animation: `float ${Math.random() * 10 + 15}s linear infinite` }}
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
                <span className="flex items-center text-green-400"> {/* Placeholder: show as decrease */}
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
    <div className="min-h-screen bg-[#0F1119] text-white relative overflow-hidden">
      {/* Enhanced layered background patterns for depth */}
      <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC4xNSIvPjwvcGF0dGVybjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] mix-blend-multiply"></div>
      <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxjaXJjbGUgc3Ryb2tlPSIjMzNDM0YwIiBzdHJva2Utb3BhY2l0eT0iMC4xIiBjeD0iMjAiIGN5PSIyMCIgcj0iMiIvPjwvZz48L3N2Zz4=')] mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#131620]/60 to-[#0A0C14]/90"></div>
      
      {/* Animated light streaks for premium effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -rotate-45 -left-1/4 top-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-[#33C3F0]/20 to-transparent animate-[sweep_8s_ease-in-out_infinite]"></div>
        <div className="absolute -rotate-45 -left-1/4 top-2/4 w-3/4 h-px bg-gradient-to-r from-transparent via-[#66EACE]/10 to-transparent animate-[sweep_15s_ease-in-out_infinite_1s]"></div>
      </div>
      
      {/* Enhanced 3D depth with subtle particles */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-[#33C3F0]/10"
            style={{
              width: `${Math.random() * 4 + 1}px`,
              height: `${Math.random() * 4 + 1}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(1px)',
              opacity: Math.random() * 0.5 + 0.1,
              animationDelay: `${Math.random() * 5}s`,
              animation: `float ${Math.random() * 10 + 15}s linear infinite`
            }}
          />
        ))}
      </div>
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="flex flex-col items-center text-center">
          <div className="mb-8 flex items-center">
            <img src="/logo.svg" alt="EASY NET WORTH Logo" className="h-20 w-20 mr-4" />
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#33C3F0] to-[#66EACE]">
              EASY NET WORTH
            </h1>
          </div>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl text-gray-300 leading-relaxed">
            Finally! Track your net worth easily, without linking bank accounts.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-[#33C3F0] to-[#66EACE] hover:from-[#33C3F0]/90 hover:to-[#66EACE]/90 text-black font-medium text-lg px-8 py-6 rounded-lg shadow-lg shadow-[#33C3F0]/20 transition-all">
                Start Tracking (Free)
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="border-[#33C3F0]/30 hover:bg-[#33C3F0]/10 text-white font-medium text-lg px-8 py-6 rounded-lg">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Dashboard Preview Section */}
      <div className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-clip-text text-transparent bg-gradient-to-r from-[#33C3F0] to-[#66EACE]">
            Your Dashboard: All Your Money Info in One Place
          </h2>
          <DashboardPreview />
        </div>
      </div>
      
      {/* Features Section */}
      <div className="py-20 relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-[#33C3F0] to-[#66EACE]">
            Simple Tracking, Big Picture
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
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
      </div>

      {/* How It Works Section */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-[#33C3F0] to-[#66EACE]">
          Get Started in 3 Steps
        </h2>
        
        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
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

      {/* Pricing Section */}
      <div id="pricing" className="container mx-auto px-4 py-20 relative z-10 scroll-mt-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-[#33C3F0] to-[#66EACE]">
          Choose Your Plan
        </h2>
        
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 items-stretch">
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
      
      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-[#33C3F0] to-[#66EACE]">
          Quick Questions
        </h2>
        
        <div className="max-w-4xl mx-auto space-y-6">
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
      
      {/* CTA */}
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#131620] to-[#1A1F2C] rounded-2xl border border-[#33C3F0]/20 p-12 text-center relative overflow-hidden">
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
      
      {/* Footer */}
      <footer className="relative z-10 border-t border-[#1A1F2C]/50 py-12">
        <div className="container mx-auto px-4">
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
  );
};

export default LandingPage;
