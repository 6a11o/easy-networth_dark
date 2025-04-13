
import { 
  Home, 
  BarChart3, 
  PlusCircle, 
  Settings, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  DollarSign
} from "lucide-react";
import { useState } from "react";
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
  
  const navItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: BarChart3, label: "Net Worth", path: "/networth" },
    { icon: PlusCircle, label: "Add Accounts", path: "/accounts" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];
  
  return (
    <div 
      className={cn(
        "h-screen bg-[#1A1F2C] border-r border-white/10 flex flex-col transition-all duration-300",
        collapsed ? "w-20" : "w-64"
      )}
    >
      <div className={cn(
        "py-6 flex items-center justify-center border-b border-white/10",
        collapsed ? "px-2" : "px-4"
      )}>
        {collapsed ? (
          <div className="bg-[#9b87f5] rounded-full p-2">
            <DollarSign className="h-6 w-6 text-white" />
          </div>
        ) : (
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#9b87f5] to-[#33C3F0]">
            EasyNetWorth
          </h1>
        )}
      </div>
      
      <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
        {navItems.map((item) => (
          <Tooltip key={item.path}>
            <TooltipTrigger asChild>
              <button
                onClick={() => navigate(item.path)}
                className={cn(
                  "flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                  location.pathname === item.path
                    ? "bg-[#9b87f5] text-white"
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                )}
              >
                <item.icon className={cn(
                  "h-5 w-5",
                  collapsed ? "mx-auto" : "mr-3"
                )} />
                {!collapsed && item.label}
              </button>
            </TooltipTrigger>
            {collapsed && (
              <TooltipContent side="right">
                {item.label}
              </TooltipContent>
            )}
          </Tooltip>
        ))}
      </nav>
      
      <div className="mt-auto pb-4 px-4">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => logout()}
              className={cn(
                "flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg text-gray-300 hover:bg-white/10 hover:text-white transition-colors",
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
            <TooltipContent side="right">
              Log Out
            </TooltipContent>
          )}
        </Tooltip>
        
        <Button
          onClick={() => setCollapsed(!collapsed)}
          variant="ghost"
          size="sm"
          className="w-full mt-4 text-gray-400 hover:bg-white/10 hover:text-white"
        >
          {collapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <div className="flex items-center w-full justify-between">
              <span>Collapse</span>
              <ChevronLeft className="h-5 w-5" />
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};
