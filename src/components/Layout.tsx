
import { ReactNode } from "react";
import { TopBar } from "./TopBar";
import { useAuth } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

interface LayoutProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export const Layout = ({ children, requireAuth = true }: LayoutProps) => {
  const { isAuthenticated } = useAuth();
  
  // Redirect to login if authentication is required but user isn't authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // Basic layout for auth pages
  if (!requireAuth) {
    return (
      <div className="min-h-screen bg-[#0F1119] flex items-center justify-center p-4 bg-gradient-to-b from-[#0F1119] to-[#070911]">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    );
  }
  
  // Dashboard layout with top bar and improved depth
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#0F1119] overflow-x-hidden relative">
      {/* Background patterns for depth */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC4xIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIiBvcGFjaXR5PSIwLjA1Ii8+PC9zdmc+')] opacity-20 mix-blend-overlay pointer-events-none"></div>
      
      <TopBar />
      <div className="flex-1 overflow-auto pt-20 px-4 sm:px-6 lg:px-8 pb-8 relative z-10">
        <div className="max-w-screen-2xl mx-auto">
          {children}
        </div>
      </div>
      
      {/* Subtle gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#131620]/20 to-transparent pointer-events-none z-0"></div>
    </div>
  );
};
