
import { 
  LayoutDashboard,
  Wallet,
  PlusCircle, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
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
        "h-screen bg-gradient-to-b from-[#1A1F2C] to-[#1D2235] border-r border-white/10 flex flex-col transition-all duration-300 relative",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo section */}
      <div className={cn(
        "py-6 flex items-center justify-center border-b border-white/10",
        collapsed ? "px-2" : "px-6"
      )}>
        {collapsed ? (
          <div className="bg-gradient-to-r from-[#9b87f5] to-[#33C3F0] rounded-full p-2">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
        ) : (
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#9b87f5] to-[#33C3F0]">
            EasyNetWorth
          </h1>
        )}
      </div>
      
      {/* Collapse button - now more visible */}
      <Button
        onClick={() => setCollapsed(!collapsed)}
        variant="ghost"
        size="sm"
        className="absolute -right-4 top-24 h-8 w-8 rounded-full bg-[#1A1F2C] border border-white/10 flex items-center justify-center z-50 shadow-lg hover:bg-[#2A2F3C]"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4 text-white" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-white" />
        )}
      </Button>
      
      {/* Navigation items */}
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {navItems.map((item) => (
          <Tooltip key={item.path}>
            <TooltipTrigger asChild>
              <button
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex items-center w-full px-3 py-3 text-sm font-medium rounded-lg transition-all",
                  location.pathname === item.path
                    ? "bg-gradient-to-r from-[#9b87f5]/80 to-[#33C3F0]/80 text-white shadow-md"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5",
                  collapsed ? "mx-auto" : "mr-3"
                )} />
                {!collapsed && (
                  <div>
                    <div>{item.label}</div>
                    <div className="text-xs text-gray-400 font-normal">{item.description}</div>
                  </div>
                )}
              </button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right" className="bg-[#1D2235] border border-white/10">
                <div className="flex flex-col">
                  <span>{item.label}</span>
                  <span className="text-xs text-gray-400">{item.description}</span>
                </div>
              </TooltipContent>
            )}
          </Tooltip>
        ))}
      </nav>
      
      {/* Footer with logout */}
      <div className="mt-auto pb-4 px-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => logout()}
              className={cn(
                "flex items-center w-full px-3 py-3 text-sm font-medium rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-all",
                collapsed ? "justify-center" : ""
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
            <TooltipContent side="right" className="bg-[#1D2235] border border-white/10">
              Log Out
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </div>
  );
};
