
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const { isAuthenticated } = useAuth();
  
  // First thing users see should be the landing page if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/landing" replace />;
  }
  
  // Check if user has completed onboarding
  const onboardingComplete = localStorage.getItem('onboardingComplete');
  
  if (onboardingComplete !== 'true') {
    return <Navigate to="/onboarding" replace />;
  }
  
  // If authenticated and onboarding complete, go to dashboard
  return <Navigate to="/dashboard" replace />;
};

export default Index;
