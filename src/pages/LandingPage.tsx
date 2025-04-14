
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, ChartBar, Lock, PieChart, Shield } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0F1119] text-white relative overflow-hidden">
      {/* Background pattern for depth */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC4xNSIvPjwvcGF0dGVybjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-30 mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#131620]/50 to-[#0A0C14]/80"></div>
      
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
          <div className="flex gap-5 flex-col sm:flex-row">
            <Button
              asChild
              size="lg"
              className="text-lg px-8 py-7 bg-[#33C3F0] hover:bg-[#33C3F0]/90 text-white shadow-lg shadow-[#33C3F0]/20"
            >
              <Link to="/signup">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-8 py-7 border-[#33C3F0]/40 text-[#33C3F0] hover:bg-[#33C3F0]/10 shadow-md"
            >
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
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
      <div className="py-24 relative z-10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-[#33C3F0] to-[#66EACE]">
            Simple Pricing
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="glass-panel rounded-xl p-8 glass-panel-hover">
              <h3 className="text-2xl font-bold mb-2 text-white">Free</h3>
              <p className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#33C3F0] to-[#66EACE]">$0</p>
              <p className="text-gray-300 mb-8">Perfect for getting started</p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-[#33C3F0]/20 flex items-center justify-center mr-3">
                    <span className="text-[#33C3F0]">✓</span>
                  </div>
                  Track unlimited accounts
                </li>
                <li className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-[#33C3F0]/20 flex items-center justify-center mr-3">
                    <span className="text-[#33C3F0]">✓</span>
                  </div>
                  Basic dashboard analytics
                </li>
                <li className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-[#33C3F0]/20 flex items-center justify-center mr-3">
                    <span className="text-[#33C3F0]">✓</span>
                  </div>
                  Up to 3 historical data points
                </li>
              </ul>
              <Button className="w-full bg-[#1A1F2C] hover:bg-[#272D3D] border border-[#33C3F0]/20 text-white">
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>
            
            <div className="glass-panel rounded-xl p-8 relative border-2 border-[#33C3F0]/40 glass-panel-hover shadow-xl">
              <div className="absolute -top-4 -right-4 bg-gradient-to-r from-[#33C3F0] to-[#66EACE] text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                RECOMMENDED
              </div>
              <h3 className="text-2xl font-bold mb-2 text-white">Premium</h3>
              <p className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-[#33C3F0] to-[#66EACE]">$19.99</p>
              <p className="text-gray-300 mb-8">One-time payment</p>
              <ul className="space-y-4 mb-10">
                <li className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-[#33C3F0]/20 flex items-center justify-center mr-3">
                    <span className="text-[#33C3F0]">✓</span>
                  </div>
                  Everything in Free
                </li>
                <li className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-[#33C3F0]/20 flex items-center justify-center mr-3">
                    <span className="text-[#33C3F0]">✓</span>
                  </div>
                  Unlimited historical data points
                </li>
                <li className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-[#33C3F0]/20 flex items-center justify-center mr-3">
                    <span className="text-[#33C3F0]">✓</span>
                  </div>
                  Advanced analytics and reporting
                </li>
              </ul>
              <Button className="w-full bg-[#33C3F0] hover:bg-[#33C3F0]/90 text-white shadow-md shadow-[#33C3F0]/20">
                <Link to="/signup">Upgrade Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-10 border-t border-[#1A1F2C]/40 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <img src="/logo.svg" alt="EASY NET WORTH Logo" className="h-6 w-6 mr-2" />
            <p className="text-gray-400">© 2025 EASY NET WORTH. All rights reserved.</p>
          </div>
          <div className="flex gap-6">
            <Link to="#" className="text-gray-400 hover:text-[#33C3F0] transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-gray-400 hover:text-[#33C3F0] transition-colors">Terms of Service</Link>
            <Link to="#" className="text-gray-400 hover:text-[#33C3F0] transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
