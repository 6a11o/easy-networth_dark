import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AddAccountForm } from "@/components/AddAccountForm";
import { NetWorthSummary } from "@/components/NetWorthSummary";
import { useFinancial } from "@/context/FinancialContext";
import { useCurrency, availableCurrencies } from "@/context/CurrencyContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { PlusCircle, TrendingUp, RefreshCw, CheckCircle, DollarSign, InfoIcon } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface OnboardingFlowProps {
  onComplete: () => void;
}

export const OnboardingFlow = ({ onComplete }: OnboardingFlowProps) => {
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
    onComplete();
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
          <Card className="bg-card/50 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome to Easy NetWorth!</CardTitle>
              <CardDescription className="text-base">
                Let's get started by setting up your preferred currency
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="bg-[#33C3F0]/10 p-4 rounded-lg border border-[#33C3F0]/20">
                  <div className="flex gap-3">
                    <InfoIcon className="h-5 w-5 text-[#33C3F0] flex-shrink-0 mt-0.5" />
                    <div className="space-y-2 text-sm text-gray-300">
                      <p>This will be the main currency used to display all your financial information across the dashboard.</p>
                      <p>Don't worry - you can always change this later in your settings if needed.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="currency-select" className="text-sm font-medium">
                    Select Your Currency
                  </Label>
                  <Select
                    value={currency.code}
                    onValueChange={handleCurrencyChange}
                  >
                    <SelectTrigger id="currency-select" className="w-full">
                      <SelectValue placeholder="Select a currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCurrencies.map((curr) => (
                        <SelectItem 
                          key={curr.code} 
                          value={curr.code}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center justify-between w-full">
                            <span>{curr.name}</span>
                            <span className="text-[#33C3F0] font-bold ml-2">{curr.symbol}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={() => setStep(2)} className="w-full">
                  Continue
                </Button>
              </div>
            </CardContent>
          </Card>
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
              <div className="flex items-center justify-center mb-6">
                <div className="bg-[#33C3F0]/20 p-4 rounded-full">
                  <PlusCircle className="h-12 w-12 text-[#33C3F0]" />
                </div>
              </div>
              <AddAccountForm />
            </div>
            <DialogFooter className="flex flex-col gap-2">
              <Button
                onClick={() => setStep(3)}
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
                <div className="bg-[#33C3F0]/20 p-4 rounded-full">
                  <TrendingUp className="h-12 w-12 text-[#33C3F0]" />
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
                <div className="bg-[#33C3F0]/20 p-4 rounded-full">
                  <RefreshCw className="h-12 w-12 text-[#33C3F0]" />
                </div>
              </div>
              <div className="space-y-4 text-center">
                <p className="text-sm text-gray-300">
                  Use the "Update Balances" button on your dashboard to keep your data current.
                </p>
                <p className="text-sm text-gray-300">
                  Regular updates help you track your financial progress and make better decisions.
                </p>
              </div>
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
              <div className="space-y-4 text-center">
                <p className="text-sm text-gray-300">
                  Your dashboard is now set up and ready to help you track your financial journey.
                </p>
                <p className="text-sm text-gray-300">
                  Explore your dashboard to see your net worth details, allocation charts, and more.
                </p>
              </div>
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
