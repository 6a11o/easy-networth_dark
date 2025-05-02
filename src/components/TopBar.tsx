import {
  LayoutDashboard,
  Wallet,
  PlusCircle,
  Settings,
  LogOut,
  Menu,
} from "lucide-react";
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export const TopBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    {
      icon: LayoutDashboard,
      label: "Dashboard",
      path: "/dashboard",
      description: "Overview of your finances",
    },
    {
      icon: PlusCircle,
      label: "Add Accounts",
      path: "/accounts",
      description: "Manage your assets & liabilities",
    },
    {
      icon: Settings,
      label: "Settings",
      path: "/settings",
      description: "Customize your experience",
    },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#1A1F2C]/40 bg-[#0F1119]/90 backdrop-blur-md shadow-md">
      <div className="flex h-14 sm:h-16 items-center justify-between px-2 sm:px-4 md:px-8 max-w-7xl mx-auto">
        {/* Logo - updated with new logo and transition effects */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center group transition-all duration-300 hover:opacity-80">
            <img 
              src="/logo.svg" 
              alt="EasyNetWorth Logo" 
              className="h-8 w-8 sm:h-9 sm:w-9 transition-transform duration-300 group-hover:scale-110" 
            />
            <h1 className="ml-2 sm:ml-3 text-sm sm:text-base font-semibold text-gradient animate-text-shine bg-gradient-to-r from-[#33C3F0] via-white to-[#66EACE] bg-clip-text text-transparent">
              EASY NET WORTH
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-2">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "flex h-8 sm:h-9 items-center gap-1.5 sm:gap-2 px-3 sm:px-4 rounded-md transition-all text-sm",
                location.pathname === item.path
                  ? "bg-[#1A1F2C] text-[#33C3F0] shadow-inner border border-[#33C3F0]/20"
                  : "text-gray-300 hover:bg-[#1A1F2C]/30 hover:text-white"
              )}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span className="hidden lg:inline">{item.label}</span>
            </Button>
          ))}
        </nav>

        {/* User Menu (Desktop) */}
        <div className="hidden md:flex md:items-center md:space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full h-8 w-8 sm:h-9 sm:w-9 border border-[#1A1F2C] bg-[#0F1119] hover:bg-[#1A1F2C]/50 hover:border-[#33C3F0]/20"
              >
                <span className="sr-only">User menu</span>
                <div className="size-6 sm:size-7 rounded-full bg-gradient-to-br from-[#33C3F0] to-[#66EACE] flex items-center justify-center text-white text-sm sm:text-base font-medium">
                  U
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#0F1119]/95 backdrop-blur-md border border-[#1A1F2C]">
              <DropdownMenuItem
                className="cursor-pointer hover:bg-[#1A1F2C] text-sm"
                onClick={() => navigate("/settings")}
              >
                <Settings className="mr-2 h-3.5 w-3.5 text-[#33C3F0]" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#1A1F2C]/50" />
              <DropdownMenuItem
                className="cursor-pointer text-red-400 hover:bg-[#1A1F2C] hover:text-red-400 text-sm"
                onClick={() => logout()}
              >
                <LogOut className="mr-2 h-3.5 w-3.5" />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Menu Trigger */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 sm:h-9 sm:w-9 hover:bg-[#1A1F2C]/30"
            >
              <Menu className="h-4 w-4 sm:h-5 sm:w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[240px] sm:w-[280px] bg-[#0F1119]/95 backdrop-blur-md border-l border-[#1A1F2C] p-4">
            <div className="flex flex-col h-full">
              <div className="flex-1 space-y-1 py-4">
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-sm",
                      location.pathname === item.path
                        ? "bg-[#1A1F2C]/70 text-[#33C3F0] border-l-2 border-[#33C3F0]"
                        : "text-gray-300 hover:bg-[#1A1F2C]/30 hover:text-white"
                    )}
                    onClick={() => navigate(item.path)}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                ))}
              </div>
              <Button
                variant="ghost"
                className="mt-auto justify-start text-red-400 hover:bg-[#1A1F2C] hover:text-red-400 text-sm"
                onClick={() => logout()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log Out
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};
