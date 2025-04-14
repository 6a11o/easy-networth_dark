
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
      <div className="min-h-screen bg-[#0F1119] flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    );
  }
  
  // Dashboard layout with top bar
  return (
    <div className="flex min-h-screen w-full flex-col bg-[#0F1119]">
      <TopBar />
      <div className="flex-1 overflow-auto pt-20 p-4 sm:p-6 overflow-x-hidden">
        <div className="max-w-screen-2xl mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
};
