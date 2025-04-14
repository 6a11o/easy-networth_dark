
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, ChartBar, Lock, PieChart, Shield } from "lucide-react";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#1A1F2C] text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center text-center">
          <div className="mb-6 flex items-center">
            <img src="/logo.svg" alt="EasyNetWorth Logo" className="h-16 w-16 mr-4" />
            <h1 className="text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#33C3F0] to-[#66EACE]">
              NetWorth
            </h1>
          </div>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl text-gray-300">
            The simplest way to track your financial growth without sharing your bank credentials.
          </p>
          <div className="flex gap-4 flex-col sm:flex-row">
            <Button
              asChild
              className="text-lg px-8 py-6 bg-[#33C3F0] hover:bg-[#33C3F0]/80 text-white"
            >
              <Link to="/signup">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="text-lg px-8 py-6 border-[#33C3F0] text-[#33C3F0] hover:bg-[#33C3F0]/10"
            >
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-[#1D2235] py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Why Choose NetWorth?</h2>
          
          <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <div className="bg-[#2A2F42] p-6 rounded-xl">
              <div className="bg-[#33C3F0]/20 p-3 rounded-full w-fit mb-4">
                <Shield className="h-8 w-8 text-[#33C3F0]" />
              </div>
              <h3 className="text-xl font-bold mb-2">100% Private</h3>
              <p className="text-gray-300">
                Manual entry means your bank login details are never shared or stored. Your financial data stays private.
              </p>
            </div>
            
            <div className="bg-[#2A2F42] p-6 rounded-xl">
              <div className="bg-[#33C3F0]/20 p-3 rounded-full w-fit mb-4">
                <PieChart className="h-8 w-8 text-[#33C3F0]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Clear Visualizations</h3>
              <p className="text-gray-300">
                Intuitive charts and graphs that help you understand your financial standing at a glance.
              </p>
            </div>
            
            <div className="bg-[#2A2F42] p-6 rounded-xl">
              <div className="bg-[#33C3F0]/20 p-3 rounded-full w-fit mb-4">
                <ChartBar className="h-8 w-8 text-[#33C3F0]" />
              </div>
              <h3 className="text-xl font-bold mb-2">Track Your Growth</h3>
              <p className="text-gray-300">
                Monitor your net worth over time and see your financial progress with interactive charts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="container mx-auto px-4 py-20">
        <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="bg-[#2A2F42] h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-[#33C3F0]">1</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Add Your Accounts</h3>
            <p className="text-gray-300">
              Manually add your assets and liabilities with simple forms.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-[#2A2F42] h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-[#33C3F0]">2</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Update Balances</h3>
            <p className="text-gray-300">
              Regularly update your account balances to keep your data current.
            </p>
          </div>
          
          <div className="text-center">
            <div className="bg-[#2A2F42] h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl font-bold text-[#33C3F0]">3</span>
            </div>
            <h3 className="text-xl font-bold mb-2">Track Your Progress</h3>
            <p className="text-gray-300">
              Watch your net worth grow over time with detailed analytics.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-[#1D2235] py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-16">Simple Pricing</h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-[#2A2F42] p-8 rounded-xl border border-transparent">
              <h3 className="text-xl font-bold mb-2">Free</h3>
              <p className="text-3xl font-bold mb-4">$0</p>
              <p className="text-gray-300 mb-6">Perfect for getting started</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Track unlimited accounts
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Basic dashboard analytics
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Up to 3 historical data points
                </li>
              </ul>
              <Button className="w-full bg-[#33C3F0] hover:bg-[#33C3F0]/80">
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>
            
            <div className="bg-[#2A2F42] p-8 rounded-xl border-2 border-[#33C3F0] relative">
              <div className="absolute top-0 right-0 bg-[#33C3F0] text-white px-4 py-1 rounded-bl-lg rounded-tr-lg text-sm font-bold">
                RECOMMENDED
              </div>
              <h3 className="text-xl font-bold mb-2">Premium</h3>
              <p className="text-3xl font-bold mb-4">$19.99</p>
              <p className="text-gray-300 mb-6">One-time payment</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Everything in Free
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Unlimited historical data points
                </li>
                <li className="flex items-center">
                  <span className="text-green-400 mr-2">✓</span>
                  Advanced analytics and reporting
                </li>
              </ul>
              <Button className="w-full bg-[#33C3F0] hover:bg-[#33C3F0]/80">
                <Link to="/signup">Upgrade Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <img src="/logo.svg" alt="NetWorth Logo" className="h-6 w-6 mr-2" />
            <p className="text-gray-400">© 2025 NetWorth. All rights reserved.</p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-gray-400 hover:text-[#33C3F0]">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-[#33C3F0]">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-[#33C3F0]">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
