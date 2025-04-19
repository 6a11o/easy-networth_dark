import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useFinancial } from "@/context/FinancialContext";
import { useState } from "react";
import { toast } from "sonner";
import { Download } from "lucide-react";

const SettingsPage = () => {
  const { user } = useAuth();
  const { isPremium, setIsPremium, getHistoricalNetWorth } = useFinancial();
  
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
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
      </div>
      
      <div className="grid gap-6">
        {/* Profile Settings */}
        <Card className="bg-card/50 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>
              Update your account information
            </CardDescription>
          </CardHeader>
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
        </Card>
        
        {/* Data Export */}
        <Card className="bg-card/50 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle>Data Export</CardTitle>
            <CardDescription>
              Export your financial history data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Download your historical net worth data as a CSV file for backup or analysis in other tools.
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
        </Card>
        
        {/* Change Password */}
        <Card className="bg-card/50 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>
              Update your password
            </CardDescription>
          </CardHeader>
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
        </Card>
        
        {/* Subscription */}
        <Card className="bg-card/50 backdrop-blur-sm border-white/10">
          <CardHeader>
            <CardTitle>Subscription</CardTitle>
            <CardDescription>
              Manage your subscription
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="bg-secondary/30 p-4 rounded-md">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">
                      {isPremium ? "Pro Plan" : "Free Trial"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {isPremium
                        ? "Unlimited accounts and historical data tracking"
                        : "Limited to 3 asset accounts, 2 liability accounts, and 3 historical data points"}
                    </p>
                  </div>
                  <div>
                    <span className={isPremium ? "text-primary" : "text-muted-foreground"}>
                      {isPremium ? "$19.99 (one-time)" : "Free"}
                    </span>
                  </div>
                </div>
              </div>
              
              {isPremium ? (
                <Button variant="outline" onClick={handleCancelPremium} className="w-full">
                  Cancel Pro Subscription
                </Button>
              ) : (
                <Button onClick={handleUpgradeToPremium} className="w-full">
                  Upgrade to Pro
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
