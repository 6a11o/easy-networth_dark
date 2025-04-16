import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { useFinancial } from "@/context/FinancialContext";
import { useState } from "react";
import { toast } from "sonner";

// Get API base URL based on environment
const getApiBaseUrl = () => {
  const env = process.env.NODE_ENV;
  if (env === 'production') {
    return 'https://api.easynetworth.com';
  } else if (env === 'test') {
    return 'https://test-api.easynetworth.com';
  }
  return 'https://dev-api.easynetworth.com';
};

const SettingsPage = () => {
  const { user } = useAuth();
  const { isPremium, setIsPremium } = useFinancial();
  
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.token) {
      toast.error("You must be logged in");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`${getApiBaseUrl()}/user/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({ email }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }
      
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.token) {
      toast.error("You must be logged in");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`${getApiBaseUrl()}/user/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to change password');
      }
      
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleUpgradeToPremium = async () => {
    if (!user?.token) {
      toast.error("You must be logged in");
      return;
    }
    
    setIsLoading(true);
    
    try {
      // This would typically redirect to a payment processor
      // For now, let's simulate an API call
      const response = await fetch(`${getApiBaseUrl()}/user/subscription/upgrade`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to upgrade subscription');
      }
      
      setIsPremium(true);
      toast.success("Upgraded to premium successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancelPremium = async () => {
    if (!user?.token) {
      toast.error("You must be logged in");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`${getApiBaseUrl()}/user/subscription/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to cancel subscription');
      }
      
      setIsPremium(false);
      toast.success("Premium subscription cancelled");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
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
              
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
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
              
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Changing..." : "Change Password"}
              </Button>
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
                <Button 
                  variant="outline" 
                  onClick={handleCancelPremium} 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Cancel Pro Subscription"}
                </Button>
              ) : (
                <Button 
                  onClick={handleUpgradeToPremium} 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Upgrade to Pro - $19.99"}
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
