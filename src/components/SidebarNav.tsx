
import { Home, BarChart3, PlusCircle, Settings, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export const SidebarNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  
  const navItems = [
    { icon: Home, label: "Dashboard", path: "/" },
    { icon: BarChart3, label: "Net Worth", path: "/networth" },
    { icon: PlusCircle, label: "Add Accounts", path: "/accounts" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];
  
  return (
    <div className="h-screen bg-sidebar p-4 border-r border-border flex flex-col">
      <div className="mb-6 flex items-center justify-center">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-300">
          EasyNetWorth
        </h1>
      </div>
      
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={cn(
              "flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors",
              location.pathname === item.path
                ? "bg-primary text-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.label}
          </button>
        ))}
      </nav>
      
      <div className="mt-auto pb-4">
        <button
          onClick={() => logout()}
          className="flex items-center w-full px-3 py-2 text-sm font-medium rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Log Out
        </button>
      </div>
    </div>
  );
};
