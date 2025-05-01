import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useFinancial } from "@/context/FinancialContext";
import { useCurrency, availableCurrencies } from "@/context/CurrencyContext";
import { useState } from "react";
import { toast } from "sonner";
import { Download, ChevronDown } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const SettingsPage = () => {
  const { user } = useAuth();
  const { isPremium, setIsPremium, getHistoricalNetWorth } = useFinancial();
  const { currency, setCurrency } = useCurrency();
  
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // --- START: CSV Export Logic ---
  const exportToCsv = () => {
    const history = getHistoricalNetWorth();
    if (!history || history.length === 0) {
      toast.error("No historical data to export.");
      return;
    }

    // Define CSV Headers (Corrected - only Date and Net Worth)
    const headers = ["Date", "Net Worth"];
    
    // Prepare CSV Rows (Corrected)
    const rows = history.map(entry => {
      const date = new Date(entry.date).toLocaleDateString(); // Format date nicely
      const netWorthValue = entry.netWorth;
      // Assets and Liabilities not available in history object, so removed
      return [date, netWorthValue].join(","); 
    });

    // Combine headers and rows
    const csvContent = [headers.join(","), ...rows].join("\n");

    // Create blob and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    link.setAttribute("download", `easy-net-worth-history-${timestamp}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success("Historical data exported successfully");
  };
  // --- END: CSV Export Logic ---
  
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock update - in a real app, this would call an API
    toast.success("Profile updated successfully");
  };
  
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    
    // Mock update - in a real app, this would call an API
    toast.success("Password changed successfully");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };
  
  const handleUpgradeToPremium = () => {
    // This would typically integrate with a payment processor
    // For this demo, we'll just toggle the premium status
    setIsPremium(true);
    toast.success("Upgraded to premium successfully");
  };
  
  const handleCancelPremium = () => {
    setIsPremium(false);
    toast.success("Premium subscription cancelled");
  };
  
  const handleCurrencyChange = (currencyCode: string) => {
    const selectedCurrency = availableCurrencies.find(curr => curr.code === currencyCode);
    if (selectedCurrency) {
      setCurrency(selectedCurrency);
      toast.success("Currency updated successfully");
    }
  };
  
  return (
    <div className="container max-w-3xl mx-auto py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>
      
      <Accordion type="single" collapsible className="space-y-4">
        {/* Currency Settings */}
        <AccordionItem value="currency" className="border-none">
          <Card className="bg-card/50 backdrop-blur-sm border-white/10">
            <AccordionTrigger className="w-full">
              <CardHeader className="w-full">
                <div className="flex items-center justify-between w-full">
                  <div>
                    <CardTitle>Currency Settings</CardTitle>
                    <CardDescription>
                      Change your preferred currency
                    </CardDescription>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </CardHeader>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-[#33C3F0]/10 rounded-md text-sm text-gray-300">
                    <p>This is the main currency that will be used to display all your financial information.</p>
                  </div>
                  <RadioGroup 
                    value={currency.code} 
                    onValueChange={handleCurrencyChange}
                    className="space-y-3"
                  >
                    {availableCurrencies.map((curr) => (
                      <div key={curr.code} className="flex items-center space-x-2 border border-[#1A1F2C]/40 rounded-md p-3 bg-[#0F1119]/60 hover:bg-[#1A1F2C]/40 transition-colors">
                        <RadioGroupItem value={curr.code} id={`currency-${curr.code}`} />
                        <Label htmlFor={`currency-${curr.code}`} className="flex flex-1 cursor-pointer">
                          <div className="flex items-center justify-between w-full">
                            <div className="font-medium">{curr.name}</div>
                            <div className="text-[#33C3F0] font-bold">{curr.symbol}</div>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Profile Settings */}
        <AccordionItem value="profile" className="border-none">
          <Card className="bg-card/50 backdrop-blur-sm border-white/10">
            <AccordionTrigger className="w-full">
              <CardHeader className="w-full">
                <div className="flex items-center justify-between w-full">
                  <div>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>
                      Update your account information
                    </CardDescription>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </CardHeader>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <Button type="submit">Save Changes</Button>
                </form>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Security Settings */}
        <AccordionItem value="security" className="border-none">
          <Card className="bg-card/50 backdrop-blur-sm border-white/10">
            <AccordionTrigger className="w-full">
              <CardHeader className="w-full">
                <div className="flex items-center justify-between w-full">
                  <div>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Update your password
                    </CardDescription>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </CardHeader>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                  
                  <Button type="submit">Change Password</Button>
                </form>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Data Export */}
        <AccordionItem value="data" className="border-none">
          <Card className="bg-card/50 backdrop-blur-sm border-white/10">
            <AccordionTrigger className="w-full">
              <CardHeader className="w-full">
                <div className="flex items-center justify-between w-full">
                  <div>
                    <CardTitle>Data Export</CardTitle>
                    <CardDescription>
                      Export your financial history
                    </CardDescription>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </CardHeader>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Download your historical net worth data as a CSV file for backup or analysis.
                  </p>
                  <Button
                    onClick={exportToCsv}
                    className="w-full flex items-center justify-center gap-2"
                    disabled={!getHistoricalNetWorth() || getHistoricalNetWorth().length === 0}
                  >
                    <Download className="h-4 w-4" />
                    Export History
                  </Button>
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>

        {/* Subscription */}
        <AccordionItem value="subscription" className="border-none">
          <Card className="bg-card/50 backdrop-blur-sm border-white/10">
            <AccordionTrigger className="w-full">
              <CardHeader className="w-full">
                <div className="flex items-center justify-between w-full">
                  <div>
                    <CardTitle>Subscription</CardTitle>
                    <CardDescription>
                      Manage your subscription
                    </CardDescription>
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </CardHeader>
            </AccordionTrigger>
            <AccordionContent>
              <CardContent>
                <div className="space-y-4">
                  {isPremium ? (
                    <>
                      <div className="p-3 bg-[#33C3F0]/10 rounded-md">
                        <p className="text-sm text-gray-300">
                          You are currently on the Premium plan. Enjoy all the premium features!
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={handleCancelPremium}
                      >
                        Cancel Premium
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="p-3 bg-[#33C3F0]/10 rounded-md">
                        <p className="text-sm text-gray-300">
                          Upgrade to Premium to unlock advanced features and detailed analytics.
                        </p>
                      </div>
                      <Button
                        className="w-full"
                        onClick={handleUpgradeToPremium}
                      >
                        Upgrade to Premium
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </AccordionContent>
          </Card>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default SettingsPage;
