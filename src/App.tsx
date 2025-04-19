import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { FinancialProvider } from "@/context/FinancialContext";
import { CurrencyProvider } from "@/context/CurrencyContext";
import { Layout } from "@/components/Layout";
import Dashboard from "@/pages/Dashboard";
import AccountsPage from "@/pages/AccountsPage";
import SettingsPage from "@/pages/SettingsPage";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import NotFound from "@/pages/NotFound";
import LandingPage from "@/pages/LandingPage";
import Index from "@/pages/Index";
import Onboarding from "@/pages/Onboarding";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <FinancialProvider>
          <CurrencyProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/dashboard" element={
                  <Layout>
                    <Dashboard />
                  </Layout>
                } />
                <Route path="/accounts" element={
                  <Layout>
                    <AccountsPage />
                  </Layout>
                } />
                <Route path="/settings" element={
                  <Layout>
                    <SettingsPage />
                  </Layout>
                } />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/onboarding" element={<Onboarding />} />
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </BrowserRouter>
          </CurrencyProvider>
        </FinancialProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
