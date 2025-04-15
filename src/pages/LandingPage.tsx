import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, ChartBar, Lock, PieChart, Shield, TrendingUp, ArrowUp } from "lucide-react";

// Dashboard Preview component
const DashboardPreview = () => {
  return (
    <div className="relative z-10 rounded-xl overflow-hidden shadow-2xl border border-[#33C3F0]/30 bg-[#131620]/90 backdrop-blur-xl transform hover:scale-[1.01] transition-all duration-500 max-w-5xl mx-auto">
      {/* Floating particles */}
      {[...Array(10)].map((_, i) => (
        <div 
          key={i}
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
      
      {/* Premium visual element */}
      <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-[#33C3F0]/10 to-[#66EACE]/5 blur-3xl animate-[pulse_4s_ease-in-out_infinite]"></div>
      
      {/* Net Worth Hero */}
      <div className="p-8 relative">
        <div className="flex flex-col items-center text-center mb-6">
          <h2 className="text-lg font-medium text-[#7A7F92]">Your Net Worth</h2>
          <div className="mt-2 text-5xl sm:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#33C3F0] to-[#66EACE]">
            $83,000
          </div>
          <div className="flex items-center mt-2 text-green-400">
            <ArrowUp className="h-4 w-4 mr-1" />
            <span>+5.2% from last month</span>
          </div>
        </div>
      </div>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-8 pb-6">
        <div className="bg-[#1A1F2C]/80 rounded-lg p-4 border border-[#33C3F0]/10">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-[#7A7F92]">Assets</h3>
          </div>
          <div className="text-2xl font-bold text-green-400">$124,000</div>
          <div className="h-1 w-full bg-[#272D3D] rounded-full mt-2">
            <div className="h-1 bg-gradient-to-r from-green-400 to-green-600 rounded-full" style={{ width: "60%" }}></div>
          </div>
        </div>
        
        <div className="bg-[#1A1F2C]/80 rounded-lg p-4 border border-[#33C3F0]/10">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-[#7A7F92]">Liabilities</h3>
          </div>
          <div className="text-2xl font-bold text-red-400">$41,000</div>
          <div className="h-1 w-full bg-[#272D3D] rounded-full mt-2">
            <div className="h-1 bg-gradient-to-r from-red-400 to-red-600 rounded-full" style={{ width: "20%" }}></div>
          </div>
        </div>
        
        <div className="col-span-2 md:col-span-1 bg-[#1A1F2C]/80 rounded-lg p-4 border border-[#33C3F0]/10">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-[#7A7F92]">Growth Rate</h3>
          </div>
          <div className="text-2xl font-bold text-[#66EACE]">18.4% YTD</div>
          <div className="flex items-center mt-1 text-xs text-[#7A7F92]">
            <TrendingUp className="h-3 w-3 mr-1 text-[#66EACE]" />
            <span>Outperforming S&P 500</span>
          </div>
        </div>
      </div>
      
      {/* Chart */}
      <div className="px-8 pb-8">
        <div className="bg-[#131620] rounded-lg p-6 relative overflow-hidden border border-[#1A1F2C]">
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-medium text-[#E2E8F0]">Net Worth Trend</h3>
            <div className="text-sm text-[#7A7F92] bg-[#1A1F2C] px-3 py-1 rounded-full">Last 6 Months</div>
          </div>
          
          {/* SVG Chart */}
          <div className="h-[200px] mt-6 relative">
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
              <path 
                d="M0,180 L100,160 L200,150 L300,120 L400,80 L500,50 L600,40 L600,200 L0,200 Z" 
                fill="url(#chartGradient)" 
                className="opacity-60"
              />
              
              {/* Line */}
              <path 
                d="M0,180 L100,160 L200,150 L300,120 L400,80 L500,50 L600,40" 
                fill="none" 
                stroke="#33C3F0" 
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
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
              <div>Feb</div>
              <div>Mar</div>
              <div>Apr</div>
              <div>May</div>
              <div>Jun</div>
              <div>Jul</div>
              <div>Aug</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Asset Allocation */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-8 pb-8">
        <div className="bg-[#131620] border border-[#1A1F2C] rounded-lg p-6 relative">
          <h3 className="text-lg font-medium mb-4 text-[#E2E8F0]">Asset Allocation</h3>
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48">
              {/* Donut chart SVG */}
              <svg viewBox="0 0 100 100" className="w-full h-full" style={{ transform: "rotate(-90deg)" }}>
                <circle cx="50" cy="50" r="45" fill="none" stroke="#1A1F2C" strokeWidth="10" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#33C3F0" strokeWidth="10" strokeDasharray="73.4 283" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#66EACE" strokeWidth="10" strokeDasharray="30.2 283" strokeDashoffset="-73.4" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#4ade80" strokeWidth="10" strokeDasharray="45.3 283" strokeDashoffset="-103.6" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#8b5cf6" strokeWidth="10" strokeDasharray="18.9 283" strokeDashoffset="-148.9" />
                <circle cx="50" cy="50" r="35" fill="#131620" />
              </svg>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#33C3F0] mr-2"></div>
              <span className="text-sm">Stocks (45%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#66EACE] mr-2"></div>
              <span className="text-sm">Real Estate (26%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#4ade80] mr-2"></div>
              <span className="text-sm">Cash (16%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-[#8b5cf6] mr-2"></div>
              <span className="text-sm">Crypto (13%)</span>
            </div>
          </div>
        </div>
        
        <div className="bg-[#131620] border border-[#1A1F2C] rounded-lg p-6">
          <h3 className="text-lg font-bold mb-4 text-[#E2E8F0]">Top Accounts</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-2 bg-[#1A1F2C]/60 rounded">
              <div className="flex items-center">
                <div className="w-2 h-8 bg-[#33C3F0] rounded-sm mr-3"></div>
                <div>
                  <h4 className="font-medium">Stock Portfolio</h4>
                  <p className="text-xs text-[#7A7F92]">Stocks</p>
                </div>
              </div>
              <div className="text-green-400 font-medium">$56,000</div>
            </div>
            
            <div className="flex justify-between items-center p-2 bg-[#1A1F2C]/60 rounded">
              <div className="flex items-center">
                <div className="w-2 h-8 bg-[#66EACE] rounded-sm mr-3"></div>
                <div>
                  <h4 className="font-medium">Rental Property</h4>
                  <p className="text-xs text-[#7A7F92]">Real Estate</p>
                </div>
              </div>
              <div className="text-green-400 font-medium">$32,000</div>
            </div>
            
            <div className="flex justify-between items-center p-2 bg-[#1A1F2C]/60 rounded">
              <div className="flex items-center">
                <div className="w-2 h-8 bg-[#4ade80] rounded-sm mr-3"></div>
                <div>
                  <h4 className="font-medium">Savings Account</h4>
                  <p className="text-xs text-[#7A7F92]">Cash</p>
                </div>
              </div>
              <div className="text-green-400 font-medium">$20,000</div>
            </div>
            
            <div className="flex justify-between items-center p-2 bg-[#1A1F2C]/60 rounded">
              <div className="flex items-center">
                <div className="w-2 h-8 bg-red-400 rounded-sm mr-3"></div>
                <div>
                  <h4 className="font-medium">Mortgage</h4>
                  <p className="text-xs text-[#7A7F92]">Loan</p>
                </div>
              </div>
              <div className="text-red-400 font-medium">-$41,000</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Overlay glow effects */}
      <div className="absolute -left-10 top-1/4 w-20 h-60 bg-[#33C3F0]/10 rounded-full blur-3xl"></div>
      <div className="absolute -right-10 bottom-1/4 w-20 h-60 bg-[#66EACE]/10 rounded-full blur-3xl"></div>
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
            The simplest way to track your financial growth without sharing your bank credentials.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-[#33C3F0] to-[#66EACE] hover:from-[#33C3F0]/90 hover:to-[#66EACE]/90 text-black font-medium text-lg px-8 py-6 rounded-lg shadow-lg shadow-[#33C3F0]/20 transition-all">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" className="border-[#33C3F0]/30 hover:bg-[#33C3F0]/10 text-white font-medium text-lg px-8 py-6 rounded-lg">
                Log In
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Dashboard Preview Section */}
      <div className="py-12 mb-12 relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-10 bg-clip-text text-transparent bg-gradient-to-r from-[#33C3F0] to-[#66EACE]">
            See Your Wealth At A Glance
          </h2>
          <DashboardPreview />
        </div>
      </div>
      
      {/* Features Section - Enhanced with Glass Effect */}
      <div className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-[#33C3F0] to-[#66EACE]">
            Why Choose EASY NET WORTH?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="glass-panel rounded-xl p-8 glass-panel-hover">
              <div className="bg-[#33C3F0]/20 p-4 rounded-full w-fit mb-6 shadow-inner">
                <Shield className="h-8 w-8 text-[#33C3F0]" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">100% Private</h3>
              <p className="text-gray-300 leading-relaxed">
                Manual entry means your bank login details are never shared or stored. Your financial data stays private.
              </p>
            </div>
            
            <div className="glass-panel rounded-xl p-8 glass-panel-hover">
              <div className="bg-[#33C3F0]/20 p-4 rounded-full w-fit mb-6 shadow-inner">
                <PieChart className="h-8 w-8 text-[#33C3F0]" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Clear Visualizations</h3>
              <p className="text-gray-300 leading-relaxed">
                Intuitive charts and graphs that help you understand your financial standing at a glance.
              </p>
            </div>
            
            <div className="glass-panel rounded-xl p-8 glass-panel-hover">
              <div className="bg-[#33C3F0]/20 p-4 rounded-full w-fit mb-6 shadow-inner">
                <ChartBar className="h-8 w-8 text-[#33C3F0]" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-white">Track Your Growth</h3>
              <p className="text-gray-300 leading-relaxed">
                Monitor your net worth over time and see your financial progress with interactive charts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="container mx-auto px-4 py-24 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-[#33C3F0] to-[#66EACE]">
          How It Works
        </h2>
        
        <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="bg-[#1A1F2C] h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#33C3F0]/20 shadow-md shadow-[#33C3F0]/5">
              <span className="text-4xl font-bold text-[#33C3F0]">1</span>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Add Your Accounts</h3>
            <p className="text-gray-300">
              Manually add your assets and liabilities with simple forms.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-[#1A1F2C] h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#33C3F0]/20 shadow-md shadow-[#33C3F0]/5">
              <span className="text-4xl font-bold text-[#33C3F0]">2</span>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Update Balances</h3>
            <p className="text-gray-300">
              Regularly update your account balances to keep your data current.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-[#1A1F2C] h-24 w-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#33C3F0]/20 shadow-md shadow-[#33C3F0]/5">
              <span className="text-4xl font-bold text-[#33C3F0]">3</span>
            </div>
            <h3 className="text-2xl font-bold mb-3 text-white">Track Your Progress</h3>
            <p className="text-gray-300">
              Watch your net worth grow over time with detailed analytics.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="container mx-auto px-4 py-24 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-[#33C3F0] to-[#66EACE]">
          Simple Pricing
        </h2>
        
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-r from-[#131620] to-[#1A1F2C] rounded-2xl border border-[#33C3F0]/20 p-8 md:p-12 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-[#33C3F0] text-black font-bold py-2 px-8 uppercase text-sm transform translate-x-8 translate-y-4 rotate-45">
              Best Value
            </div>
            
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="text-3xl font-bold mb-4 text-white">Pro Plan</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-5xl font-bold text-[#33C3F0]">$19.99</span>
                  <span className="text-xl text-[#7A7F92] ml-2">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-300">
                    <div className="h-5 w-5 mr-3 text-[#33C3F0] rounded-full bg-[#33C3F0]/20 flex items-center justify-center">✓</div>
                    Unlimited assets and liabilities
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="h-5 w-5 mr-3 text-[#33C3F0] rounded-full bg-[#33C3F0]/20 flex items-center justify-center">✓</div>
                    Advanced charts and analytics
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="h-5 w-5 mr-3 text-[#33C3F0] rounded-full bg-[#33C3F0]/20 flex items-center justify-center">✓</div>
                    Export data in CSV format
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="h-5 w-5 mr-3 text-[#33C3F0] rounded-full bg-[#33C3F0]/20 flex items-center justify-center">✓</div>
                    Goal setting and tracking
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="h-5 w-5 mr-3 text-[#33C3F0] rounded-full bg-[#33C3F0]/20 flex items-center justify-center">✓</div>
                    Custom categories
                  </li>
                </ul>
                
                <Link to="/signup">
                  <Button className="w-full bg-gradient-to-r from-[#33C3F0] to-[#66EACE] text-black font-medium py-6 rounded-lg shadow-lg transition-all">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
              
              <div>
                <h3 className="text-3xl font-bold mb-4 text-white">Free Trial</h3>
                <div className="flex items-baseline mb-6">
                  <span className="text-5xl font-bold text-[#7A7F92]">$0</span>
                  <span className="text-xl text-[#7A7F92] ml-2">/forever</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center text-gray-300">
                    <div className="h-5 w-5 mr-3 text-[#7A7F92] rounded-full bg-[#7A7F92]/20 flex items-center justify-center">✓</div>
                    Up to 3 assets
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="h-5 w-5 mr-3 text-[#7A7F92] rounded-full bg-[#7A7F92]/20 flex items-center justify-center">✓</div>
                    Up to 2 liabilities
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="h-5 w-5 mr-3 text-[#7A7F92] rounded-full bg-[#7A7F92]/20 flex items-center justify-center">✓</div>
                    Basic charts
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="h-5 w-5 mr-3 text-[#7A7F92] rounded-full bg-[#7A7F92]/20 flex items-center justify-center">✓</div>
                    Manual data entry
                  </li>
                  <li className="flex items-center text-gray-300">
                    <div className="h-5 w-5 mr-3 text-[#7A7F92]/20 rounded-full bg-[#7A7F92]/10 flex items-center justify-center">✕</div>
                    <span className="line-through">Advanced features</span>
                  </li>
                </ul>
                
                <Link to="/signup">
                  <Button variant="outline" className="w-full border-[#7A7F92] hover:bg-[#7A7F92]/10 text-white py-6 rounded-lg">
                    Start Free
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* FAQ Section */}
      <div className="container mx-auto px-4 py-24 relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-[#33C3F0] to-[#66EACE]">
          Frequently Asked Questions
        </h2>
        
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-[#131620] border border-[#1A1F2C] rounded-xl p-6">
            <h3 className="text-xl font-bold mb-2 text-white">Is my financial data secure?</h3>
            <p className="text-gray-300">
              Absolutely. Since you manually enter your data, we never connect to your bank accounts or store your login credentials. Your data is encrypted and stored securely.
            </p>
          </div>
          
          <div className="bg-[#131620] border border-[#1A1F2C] rounded-xl p-6">
            <h3 className="text-xl font-bold mb-2 text-white">Can I export my data?</h3>
            <p className="text-gray-300">
              Yes, Pro plan users can export their data as CSV files for further analysis or record-keeping.
            </p>
          </div>
          
          <div className="bg-[#131620] border border-[#1A1F2C] rounded-xl p-6">
            <h3 className="text-xl font-bold mb-2 text-white">How often should I update my balances?</h3>
            <p className="text-gray-300">
              For best results, we recommend updating your account balances at least once a month. This provides enough data points to track your progress effectively.
            </p>
          </div>
          
          <div className="bg-[#131620] border border-[#1A1F2C] rounded-xl p-6">
            <h3 className="text-xl font-bold mb-2 text-white">Can I cancel my subscription anytime?</h3>
            <p className="text-gray-300">
              Yes, you can cancel your Pro subscription at any time. You'll continue to have access until the end of your billing period, after which you'll be switched to the Free plan.
            </p>
          </div>
        </div>
      </div>
      
      {/* CTA */}
      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-[#131620] to-[#1A1F2C] rounded-2xl border border-[#33C3F0]/20 p-12 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute -left-10 top-1/4 w-40 h-40 bg-[#33C3F0]/20 rounded-full blur-3xl"></div>
            <div className="absolute -right-10 bottom-1/4 w-40 h-40 bg-[#66EACE]/20 rounded-full blur-3xl"></div>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative">
            Start Tracking Your Wealth Today
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto relative">
            Join thousands of users who are taking control of their financial future with EASY NET WORTH.
          </p>
          <div className="relative">
            <Link to="/signup">
              <Button className="bg-gradient-to-r from-[#33C3F0] to-[#66EACE] hover:from-[#33C3F0]/90 hover:to-[#66EACE]/90 text-black font-medium text-lg px-10 py-6 rounded-lg shadow-lg shadow-[#33C3F0]/20 transition-all">
                Get Started For Free
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
              © {new Date().getFullYear()} Easy Net Worth. All rights reserved. <a href="#" className="underline hover:text-[#33C3F0]">Privacy Policy</a> | <a href="#" className="underline hover:text-[#33C3F0]">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
