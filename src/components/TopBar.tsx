
import {
  LayoutDashboard,
  Wallet,
  PlusCircle,
  Settings,
  LogOut,
  BarChart3,
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
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-[#1A1F2C]/30 bg-[#0F1119]/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/dashboard" className="flex items-center">
            <img src="/logo.svg" alt="EASY NET WORTH" className="h-8 w-8" />
            <h1 className="ml-3 hidden text-lg font-medium bg-clip-text text-transparent bg-gradient-to-r from-[#33C3F0] to-[#66EACE] sm:block">
              EASY NET WORTH
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:space-x-1">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              className={cn(
                "flex h-9 items-center gap-2 px-3",
                location.pathname === item.path
                  ? "bg-[#1A1F2C]/70 text-[#33C3F0]"
                  : "text-gray-300 hover:bg-[#1A1F2C]/30 hover:text-white"
              )}
              onClick={() => navigate(item.path)}
            >
              <item.icon className="h-4 w-4" />
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
                className="rounded-full h-9 w-9 border border-[#1A1F2C] bg-[#0F1119]"
              >
                <span className="sr-only">User menu</span>
                <div className="size-7 rounded-full bg-gradient-to-br from-[#33C3F0] to-[#66EACE] flex items-center justify-center text-white font-medium">
                  U
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-[#0F1119] border border-[#1A1F2C]">
              <DropdownMenuItem
                className="cursor-pointer hover:bg-[#1A1F2C]"
                onClick={() => navigate("/settings")}
              >
                <Settings className="mr-2 h-4 w-4 text-[#33C3F0]" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#1A1F2C]/50" />
              <DropdownMenuItem
                className="cursor-pointer text-red-400 hover:bg-[#1A1F2C] hover:text-red-400"
                onClick={() => logout()}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Menu Trigger */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[240px] bg-[#0F1119] border-l border-[#1A1F2C]">
            <div className="flex flex-col h-full">
              <div className="flex-1 space-y-1 py-4">
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    variant="ghost"
                    className={cn(
                      "w-full justify-start",
                      location.pathname === item.path
                        ? "bg-[#1A1F2C]/70 text-[#33C3F0]"
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
                className="mt-auto justify-start text-red-400 hover:bg-[#1A1F2C] hover:text-red-400"
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
