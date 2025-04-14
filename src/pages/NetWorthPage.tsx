import { NetWorthChart } from "@/components/NetWorthChart";
import { AllocationCharts } from "@/components/AllocationCharts";
import { NetWorthSummary } from "@/components/NetWorthSummary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFinancial } from "@/context/FinancialContext";
import { useCurrency } from "@/context/CurrencyContext";

const NetWorthPage = () => {
  const { getHistoricalNetWorth, getHistoricalDates, isPremium, setIsPremium } = useFinancial();
  const { formatAmount } = useCurrency();
  
  const netWorthHistory = getHistoricalNetWorth();
  const dates = getHistoricalDates();
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Calculate change between two data points
  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return { value: current, percent: 0 };
    
    const change = current - previous;
    const percent = (change / Math.abs(previous)) * 100;
    
    return { value: change, percent };
  };
  
  // Handle premium upgrade
  const handleUpgradeToPremium = () => {
    setIsPremium(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Net Worth Analysis</h1>
      </div>
      
      <NetWorthSummary />
      <NetWorthChart />
      
      <div>
        <h2 className="text-xl font-medium mb-4">Historical Data</h2>
        {dates.length > 1 ? (
          <Card className="bg-card/50 backdrop-blur-sm border-white/10">
            <CardHeader>
              <CardTitle className="text-lg">Net Worth History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-2 px-4">Date</th>
                      <th className="text-right py-2 px-4">Net Worth</th>
                      <th className="text-right py-2 px-4">Change</th>
                      <th className="text-right py-2 px-4">Change %</th>
                    </tr>
                  </thead>
                  <tbody>
                    {netWorthHistory.map((item, index) => {
                      // Calculate change from previous period
                      const previousValue = index > 0 ? netWorthHistory[index - 1].netWorth : 0;
                      const change = calculateChange(item.netWorth, previousValue);
                      
                      return (
                        <tr key={item.date} className="border-b border-white/5">
                          <td className="py-2 px-4">{formatDate(item.date)}</td>
                          <td className="text-right py-2 px-4">{formatAmount(item.netWorth)}</td>
                          <td className={`text-right py-2 px-4 ${change.value >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {index === 0 ? '—' : formatAmount(change.value)}
                          </td>
                          <td className={`text-right py-2 px-4 ${change.value >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {index === 0 ? '—' : `${change.percent.toFixed(1)}%`}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-card/50 backdrop-blur-sm border-white/10">
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                {dates.length === 0
                  ? "No data available yet. Add assets or liabilities to see your net worth history."
                  : "Add more data points to see historical trends."}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      
      <AllocationCharts />
      
      {!isPremium && dates.length >= 3 && (
        <Card className="bg-primary/10 border border-primary/30 mb-8">
          <CardContent className="py-6">
            <div className="text-center">
              <h3 className="font-medium text-lg mb-2">
                Premium Feature Locked
              </h3>
              <p className="text-muted-foreground mb-4">
                You've reached the limit of 3 historical data points in the free version. 
                Upgrade to premium for unlimited historical data tracking.
              </p>
              <Button onClick={handleUpgradeToPremium} className="bg-primary hover:bg-primary/90 text-[#081924] font-semibold">
                Upgrade to Premium - $19.99
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NetWorthPage;
