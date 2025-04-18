import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AddAccountForm } from "@/components/AddAccountForm";
import { NetWorthSummary } from "@/components/NetWorthSummary";
import { useFinancial } from "@/context/FinancialContext";
import { useCurrency, availableCurrencies } from "@/context/CurrencyContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { PlusCircle, TrendingUp, RefreshCw, CheckCircle, DollarSign } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export const OnboardingFlow = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { assets, liabilities } = useFinancial();
  const { currency, setCurrency } = useCurrency();
  
  const hasAccounts = assets.length > 0 || liabilities.length > 0;
  
  const handleComplete = () => {
    setIsOpen(false);
    localStorage.setItem('onboardingComplete', 'true');
    navigate('/dashboard');
  };
  
  const nextStep = () => {
    setStep(prev => prev + 1);
  };
  
  const handleCurrencyChange = (currencyCode: string) => {
    const selectedCurrency = availableCurrencies.find(curr => curr.code === currencyCode);
    if (selectedCurrency) {
      setCurrency(selectedCurrency);
    }
  };
  
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold">Welcome to Easy Net Worth!</DialogTitle>
              <DialogDescription className="text-base">
                Let's start by selecting your preferred currency.
              </DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <div className="flex items-center justify-center mb-6">
                <div className="bg-[#33C3F0]/20 p-4 rounded-full">
                  <DollarSign className="h-12 w-12 text-[#33C3F0]" />
                </div>
              </div>
              <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2">
                <RadioGroup 
                  value={currency.code} 
                  onValueChange={handleCurrencyChange}
                  className="space-y-3"
                >
                  {availableCurrencies.map((curr) => (
                    <div key={curr.code} className="flex items-center space-x-2 border border-[#1A1F2C]/40 rounded-md p-3 bg-[#0F1119]/60 hover:bg-[#1A1F2C]/40 transition-colors">
                      <RadioGroupItem value={curr.code} id={curr.code} />
                      <Label htmlFor={curr.code} className="flex flex-1 cursor-pointer">
                        <div className="flex items-center justify-between w-full">
                          <div className="font-medium">{curr.name}</div>
                          <div className="text-[#33C3F0] font-bold">{curr.symbol}</div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={nextStep} className="w-full">
                Continue
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
                onClick={() => setStep(4)}
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
      <DialogContent className="sm:max-w-md md:max-w-3xl lg:max-w-4xl">
        {renderStepContent()}
      </DialogContent>
    </Dialog>
  );
};
