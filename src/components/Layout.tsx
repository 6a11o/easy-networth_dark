
import { ReactNode } from "react";
import { SidebarNav } from "./SidebarNav";
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
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        {children}
      </div>
    );
  }
  
  // Dashboard layout with sidebar
  return (
    <div className="flex h-screen">
      <SidebarNav />
      <div className="flex-1 overflow-auto p-6">
        {children}
      </div>
    </div>
  );
};
