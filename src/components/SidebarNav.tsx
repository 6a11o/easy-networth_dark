
import { 
  LayoutDashboard,
  Wallet,
  PlusCircle, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  BarChart3, 
  DollarSign
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const SidebarNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const navItems = [
    { 
      icon: LayoutDashboard, 
      label: "Dashboard", 
      path: "/dashboard", 
      description: "Overview of your finances" 
    },
    { 
      icon: PlusCircle, 
      label: "Add Accounts", 
      path: "/accounts", 
      description: "Manage your assets & liabilities" 
    },
    { 
      icon: Settings, 
      label: "Settings", 
      path: "/settings", 
      description: "Customize your experience" 
    },
  ];
  
  return (
    <div 
      className={cn(
        "h-screen bg-[#0F1119] border-r border-[#1A1F2C]/50 flex flex-col transition-all duration-300 relative",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Collapse button - redesigned to be more visible */}
      <div className="absolute -right-3 top-6">
        <Button
          onClick={() => setCollapsed(!collapsed)}
          size="icon"
          variant="outline"
          className="h-6 w-6 rounded-full border border-[#1A1F2C] bg-[#0F1119] shadow-md hover:bg-[#1A1F2C] text-primary"
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </Button>
      </div>
      
      {/* Logo section with new SVG logo */}
      <div className={cn(
        "py-6 flex items-center justify-center border-b border-[#1A1F2C]/50",
        collapsed ? "px-2" : "px-6"
      )}>
        <div className="flex items-center">
          <img src="/logo.svg" alt="EasyNetWorth Logo" className="h-8 w-8" />
          {!collapsed && (
            <h1 className="ml-2 text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#33C3F0] to-[#66EACE]">
              NetWorth
            </h1>
          )}
        </div>
      </div>
      
      {/* Navigation items */}
      <nav className="flex-1 px-2 py-4 overflow-y-auto">
        {navItems.map((item) => (
          <Tooltip key={item.path}>
            <TooltipTrigger asChild>
              <button
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex items-center w-full py-2.5 text-sm font-medium rounded-md transition-all mb-1",
                  collapsed ? "justify-center px-2" : "px-3",
                  location.pathname === item.path
                    ? "bg-[#1A1F2C] text-[#33C3F0]"
                    : "text-gray-300 hover:bg-[#1A1F2C]/50 hover:text-white"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5",
                  collapsed ? "" : "mr-3"
                )} />
                {!collapsed && item.label}
              </button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right" className="bg-[#1A1F2C] border border-[#1A1F2C]/80">
                {item.label}
              </TooltipContent>
            )}
          </Tooltip>
        ))}
      </nav>
      
      {/* Footer with logout */}
      <div className="mt-auto pb-4 px-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => logout()}
              className={cn(
                "flex items-center w-full py-2.5 text-sm font-medium rounded-md text-gray-300 hover:bg-[#1A1F2C]/50 hover:text-white transition-all",
                collapsed ? "justify-center px-2" : "px-3"
              )}
            >
              <LogOut className={cn(
                "h-5 w-5",
                collapsed ? "" : "mr-3"
              )} />
              {!collapsed && "Log Out"}
            </button>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right" className="bg-[#1A1F2C] border border-[#1A1F2C]/80">
              Log Out
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </div>
  );
};
