
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AddAccountForm } from "@/components/AddAccountForm";
import { NetWorthSummary } from "@/components/NetWorthSummary";
import { useFinancial } from "@/context/FinancialContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { PlusCircle, TrendingUp, RefreshCw, CheckCircle } from "lucide-react";

export const OnboardingFlow = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { assets, liabilities } = useFinancial();
  
  const hasAccounts = assets.length > 0 || liabilities.length > 0;
  
  const handleComplete = () => {
    setIsOpen(false);
    localStorage.setItem('onboardingComplete', 'true');
    navigate('/dashboard');
  };
  
  const nextStep = () => {
    setStep(prev => prev + 1);
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Welcome to Easy Net Worth!</DialogTitle>
              <DialogDescription className="text-base">
                Let's get started by adding your financial accounts.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-[#33C3F0]/20 p-4 rounded-full">
                  <PlusCircle className="h-12 w-12 text-[#33C3F0]" />
                </div>
              </div>
              <p className="text-center mb-4">
                Start by adding your assets (what you own) and liabilities (what you owe).
              </p>
            </div>
            <DialogFooter>
              <Button onClick={nextStep} className="w-full">
                Let's Add Accounts
              </Button>
            </DialogFooter>
          </>
        );
      
      case 2:
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Add Your Accounts</DialogTitle>
              <DialogDescription className="text-base">
                Enter your assets and liabilities to calculate your net worth.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <AddAccountForm />
            </div>
            <DialogFooter className="flex flex-col gap-2">
              <Button 
                onClick={nextStep} 
                className="w-full"
                disabled={!hasAccounts}
              >
                {hasAccounts ? "Continue" : "Add at least one account to continue"}
              </Button>
              {!hasAccounts && (
                <p className="text-sm text-muted-foreground text-center">
                  You need to add at least one asset or liability to continue.
                </p>
              )}
            </DialogFooter>
          </>
        );
        
      case 3:
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Your Net Worth</DialogTitle>
              <DialogDescription className="text-base">
                Here's a summary of your financial standing.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-[#9b87f5]/20 p-4 rounded-full">
                  <TrendingUp className="h-12 w-12 text-[#9b87f5]" />
                </div>
              </div>
              <NetWorthSummary />
            </div>
            <DialogFooter>
              <Button onClick={nextStep} className="w-full">
                Continue
              </Button>
            </DialogFooter>
          </>
        );
        
      case 4:
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Track Your Progress</DialogTitle>
              <DialogDescription className="text-base">
                Regularly update your balances to track your financial growth.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-[#F97316]/20 p-4 rounded-full">
                  <RefreshCw className="h-12 w-12 text-[#F97316]" />
                </div>
              </div>
              <p className="text-center mb-4">
                Use the "Update Balances" button on your dashboard to keep your data current.
              </p>
            </div>
            <DialogFooter>
              <Button onClick={nextStep} className="w-full">
                Continue
              </Button>
            </DialogFooter>
          </>
        );
        
      case 5:
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">You're All Set!</DialogTitle>
              <DialogDescription className="text-base">
                Your Easy Net Worth dashboard is ready.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-green-400/20 p-4 rounded-full">
                  <CheckCircle className="h-12 w-12 text-green-400" />
                </div>
              </div>
              <p className="text-center mb-4">
                Explore your dashboard to see your net worth details, allocation charts, and more.
              </p>
            </div>
            <DialogFooter>
              <Button onClick={handleComplete} className="w-full">
                Go to Dashboard
              </Button>
            </DialogFooter>
          </>
        );
        
      default:
        return null;
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
};
