
import { useState, useEffect } from "react";
import { useFinancial } from "@/context/FinancialContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { ArrowDownRight, ArrowUpRight, TrendingDown, TrendingUp, Clock, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export const EnhancedRecapSection = () => {
  const { 
    getHistoricalDates, 
    getHistoricalNetWorth, 
    getTotalAssets, 
    getTotalLiabilities,
    assets,
    liabilities,
    balanceHistory
  } = useFinancial();
  
  // State for historical analysis
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [comparison, setComparison] = useState<{
    netWorthChange: number;
    netWorthChangePercent: number;
    assetsChange: number;
    assetsChangePercent: number;
    liabilitiesChange: number;
    liabilitiesChangePercent: number;
    accountChanges: {id: string; name: string; type: string; startBalance: number; endBalance: number; change: number; changePercent: number}[];
  }>({
    netWorthChange: 0,
    netWorthChangePercent: 0,
    assetsChange: 0,
    assetsChangePercent: 0,
    liabilitiesChange: 0,
    liabilitiesChangePercent: 0,
    accountChanges: []
  });
  
  // State for financial trends
  const [timeRange, setTimeRange] = useState<string>("all");
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["netWorth"]);
  const [trendData, setTrendData] = useState<any[]>([]);
  
  // Get available dates
  useEffect(() => {
    const dates = getHistoricalDates();
    setAvailableDates(dates);
    
    if (dates.length >= 2) {
      setStartDate(dates[0]);
      setEndDate(dates[dates.length - 1]);
    }
  }, [getHistoricalDates]);
  
  // Calculate comparison when dates change
  useEffect(() => {
    if (startDate && endDate) {
      // Get historical data for the selected date range
      const historicalNetWorth = getHistoricalNetWorth(startDate, endDate);
      
      if (historicalNetWorth.length >= 2) {
        const startData = historicalNetWorth[0];
        const endData = historicalNetWorth[historicalNetWorth.length - 1];
        
        // Calculate net worth changes
        const netWorthStart = startData.netWorth;
        const netWorthEnd = endData.netWorth;
        const netWorthChange = netWorthEnd - netWorthStart;
        const netWorthChangePercent = netWorthStart !== 0 
          ? (netWorthChange / Math.abs(netWorthStart)) * 100 
          : 0;
        
        // Calculate assets and liabilities changes for the specific dates
        let startDateAssets = 0;
        let endDateAssets = 0;
        let startDateLiabilities = 0;
        let endDateLiabilities = 0;
        
        // Calculate account-specific changes
        const accountChanges: {id: string; name: string; type: string; startBalance: number; endBalance: number; change: number; changePercent: number}[] = [];
        
        // Process assets
        assets.forEach(asset => {
          const startEntries = balanceHistory
            .filter(entry => entry.accountId === asset.id && entry.date <= startDate)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          
          const endEntries = balanceHistory
            .filter(entry => entry.accountId === asset.id && entry.date <= endDate)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          
          const startBalance = startEntries.length > 0 ? startEntries[0].balance : 0;
          const endBalance = endEntries.length > 0 ? endEntries[0].balance : 0;
          
          startDateAssets += startBalance;
          endDateAssets += endBalance;
          
          const change = endBalance - startBalance;
          const changePercent = startBalance !== 0 
            ? (change / Math.abs(startBalance)) * 100 
            : 0;
          
          accountChanges.push({
            id: asset.id,
            name: asset.name,
            type: 'asset',
            startBalance,
            endBalance,
            change,
            changePercent
          });
        });
        
        // Process liabilities
        liabilities.forEach(liability => {
          const startEntries = balanceHistory
            .filter(entry => entry.accountId === liability.id && entry.date <= startDate)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          
          const endEntries = balanceHistory
            .filter(entry => entry.accountId === liability.id && entry.date <= endDate)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          
          const startBalance = startEntries.length > 0 ? startEntries[0].balance : 0;
          const endBalance = endEntries.length > 0 ? endEntries[0].balance : 0;
          
          startDateLiabilities += startBalance;
          endDateLiabilities += endBalance;
          
          const change = endBalance - startBalance;
          const changePercent = startBalance !== 0 
            ? (change / Math.abs(startBalance)) * 100 
            : 0;
          
          accountChanges.push({
            id: liability.id,
            name: liability.name,
            type: 'liability',
            startBalance,
            endBalance,
            change,
            changePercent
          });
        });
        
        // Calculate total changes
        const assetsChange = endDateAssets - startDateAssets;
        const assetsChangePercent = startDateAssets !== 0 
          ? (assetsChange / Math.abs(startDateAssets)) * 100 
          : 0;
        
        const liabilitiesChange = endDateLiabilities - startDateLiabilities;
        const liabilitiesChangePercent = startDateLiabilities !== 0 
          ? (liabilitiesChange / Math.abs(startDateLiabilities)) * 100 
          : 0;
        
        setComparison({
          netWorthChange,
          netWorthChangePercent,
          assetsChange,
          assetsChangePercent,
          liabilitiesChange,
          liabilitiesChangePercent,
          accountChanges
        });
      }
    }
  }, [startDate, endDate, getHistoricalNetWorth, assets, liabilities, balanceHistory]);
  
  // Prepare data for financial trends chart based on selected metrics and time range
  useEffect(() => {
    const historicalData = getHistoricalNetWorth();
    
    let filteredData = [...historicalData];
    
    // Apply time range filter
    if (timeRange !== "all") {
      const now = new Date();
      let filterDate = new Date();
      
      switch (timeRange) {
        case "1m":
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case "3m":
          filterDate.setMonth(now.getMonth() - 3);
          break;
        case "6m":
          filterDate.setMonth(now.getMonth() - 6);
          break;
        case "1y":
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filteredData = filteredData.filter(item => 
        new Date(item.date) >= filterDate
      );
    }
    
    // Format data for recharts
    const formattedData = filteredData.map(item => {
      const datum: any = {
        date: format(new Date(item.date), 'MMM dd, yyyy'),
        netWorth: item.netWorth,
      };
      
      // Add assets total if needed
      if (selectedMetrics.includes("assets")) {
        let assetsTotal = 0;
        assets.forEach(asset => {
          const entries = balanceHistory
            .filter(entry => entry.accountId === asset.id && entry.date <= item.date)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          
          if (entries.length > 0) {
            assetsTotal += entries[0].balance;
          }
        });
        datum.assets = assetsTotal;
      }
      
      // Add liabilities total if needed
      if (selectedMetrics.includes("liabilities")) {
        let liabilitiesTotal = 0;
        liabilities.forEach(liability => {
          const entries = balanceHistory
            .filter(entry => entry.accountId === liability.id && entry.date <= item.date)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          
          if (entries.length > 0) {
            liabilitiesTotal += entries[0].balance;
          }
        });
        datum.liabilities = liabilitiesTotal;
      }
      
      // Add individual account balances if needed
      const accountIds = selectedMetrics.filter(metric => 
        metric.startsWith('asset:') || metric.startsWith('liability:')
      );
      
      accountIds.forEach(accountId => {
        const [type, id] = accountId.split(':');
        const entries = balanceHistory
          .filter(entry => entry.accountId === id && entry.date <= item.date)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        
        if (entries.length > 0) {
          datum[accountId] = entries[0].balance;
        } else {
          datum[accountId] = 0;
        }
      });
      
      return datum;
    });
    
    setTrendData(formattedData);
  }, [timeRange, selectedMetrics, getHistoricalNetWorth, assets, liabilities, balanceHistory]);

  // Group balance updates by date for transaction log
  const balanceUpdatesByDate = balanceHistory.reduce((acc: any, entry) => {
    if (!acc[entry.date]) {
      acc[entry.date] = [];
    }
    
    const accountInfo = assets.find(a => a.id === entry.accountId) || 
                        liabilities.find(l => l.id === entry.accountId);
    
    if (accountInfo) {
      acc[entry.date].push({
        ...entry,
        accountName: accountInfo.name,
        accountType: assets.some(a => a.id === entry.accountId) ? 'asset' : 'liability'
      });
    }
    
    return acc;
  }, {});
  
  // Sort dates for transaction log (newest first)
  const sortedDates = Object.keys(balanceUpdatesByDate).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0 
    }).format(amount);
  };

  return (
    <Tabs defaultValue="historical" className="w-full space-y-6">
      <TabsList className="grid w-full grid-cols-3 bg-[#1A1F2C]/60">
        <TabsTrigger value="historical">Historical Analysis</TabsTrigger>
        <TabsTrigger value="trends">Financial Trends</TabsTrigger>
        <TabsTrigger value="log">Transaction Log</TabsTrigger>
      </TabsList>
      
      {/* Historical Analysis Tab */}
      <TabsContent value="historical" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Start Date</label>
            <Select value={startDate} onValueChange={setStartDate}>
              <SelectTrigger className="bg-[#1A1F2C]/60 border-[#1A1F2C]">
                <SelectValue placeholder="Select start date" />
              </SelectTrigger>
              <SelectContent>
                {availableDates.map((date) => (
                  <SelectItem key={`start-${date}`} value={date}>
                    {format(new Date(date), 'MMM dd, yyyy')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">End Date</label>
            <Select value={endDate} onValueChange={setEndDate}>
              <SelectTrigger className="bg-[#1A1F2C]/60 border-[#1A1F2C]">
                <SelectValue placeholder="Select end date" />
              </SelectTrigger>
              <SelectContent>
                {availableDates.map((date) => (
                  <SelectItem key={`end-${date}`} value={date}>
                    {format(new Date(date), 'MMM dd, yyyy')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Net Worth Comparison */}
          <Card className="bg-[#1A1F2C]/60 border-[#1A1F2C]/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <span className="mr-2">Net Worth Change</span>
                {comparison.netWorthChange >= 0 ? 
                  <TrendingUp className="h-4 w-4 text-green-500" /> : 
                  <TrendingDown className="h-4 w-4 text-red-500" />
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold mb-1">
                {formatCurrency(comparison.netWorthChange)}
              </div>
              <div className={cn(
                "text-sm flex items-center",
                comparison.netWorthChangePercent >= 0 ? "text-green-500" : "text-red-500"
              )}>
                {comparison.netWorthChangePercent >= 0 ? 
                  <ArrowUpRight className="h-4 w-4 mr-1" /> : 
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                }
                {Math.abs(comparison.netWorthChangePercent).toFixed(1)}%
              </div>
            </CardContent>
          </Card>
          
          {/* Assets Comparison */}
          <Card className="bg-[#1A1F2C]/60 border-[#1A1F2C]/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <span className="mr-2">Assets Change</span>
                {comparison.assetsChange >= 0 ? 
                  <TrendingUp className="h-4 w-4 text-green-500" /> : 
                  <TrendingDown className="h-4 w-4 text-red-500" />
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold mb-1 text-green-500">
                {formatCurrency(comparison.assetsChange)}
              </div>
              <div className={cn(
                "text-sm flex items-center",
                comparison.assetsChange >= 0 ? "text-green-500" : "text-red-500"
              )}>
                {comparison.assetsChange >= 0 ? 
                  <ArrowUpRight className="h-4 w-4 mr-1" /> : 
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                }
                {Math.abs(comparison.assetsChangePercent).toFixed(1)}%
              </div>
            </CardContent>
          </Card>
          
          {/* Liabilities Comparison */}
          <Card className="bg-[#1A1F2C]/60 border-[#1A1F2C]/80">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center">
                <span className="mr-2">Liabilities Change</span>
                {comparison.liabilitiesChange <= 0 ? 
                  <TrendingUp className="h-4 w-4 text-green-500" /> : 
                  <TrendingDown className="h-4 w-4 text-red-500" />
                }
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold mb-1 text-red-500">
                {formatCurrency(comparison.liabilitiesChange)}
              </div>
              <div className={cn(
                "text-sm flex items-center",
                comparison.liabilitiesChange <= 0 ? "text-green-500" : "text-red-500"
              )}>
                {comparison.liabilitiesChange <= 0 ? 
                  <ArrowUpRight className="h-4 w-4 mr-1" /> : 
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                }
                {Math.abs(comparison.liabilitiesChangePercent).toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Individual account changes */}
        <h3 className="text-lg font-medium mb-3">Individual Account Changes</h3>
        <div className="space-y-3">
          {comparison.accountChanges.map((account) => (
            <div 
              key={account.id}
              className="p-3 bg-[#1A1F2C]/40 rounded-lg border border-[#1A1F2C]/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
            >
              <div className="flex items-center">
                <Badge variant={account.type === 'asset' ? 'outline' : 'destructive'} className="mr-2">
                  {account.type === 'asset' ? 'Asset' : 'Liability'}
                </Badge>
                <span className="font-medium">{account.name}</span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="text-sm text-muted-foreground">
                  From: {formatCurrency(account.startBalance)}
                </div>
                <div className="text-sm text-muted-foreground">
                  To: {formatCurrency(account.endBalance)}
                </div>
                <div className={cn(
                  "flex items-center",
                  (account.type === 'asset' && account.change >= 0) || (account.type === 'liability' && account.change <= 0) 
                    ? "text-green-500" 
                    : "text-red-500"
                )}>
                  {account.change >= 0 ? "+" : ""}{formatCurrency(account.change)} ({Math.abs(account.changePercent).toFixed(1)}%)
                </div>
              </div>
            </div>
          ))}
        </div>
      </TabsContent>
      
      {/* Financial Trends Tab */}
      <TabsContent value="trends" className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">Metrics to Display</label>
            <Select 
              value={selectedMetrics.join(',')}
              onValueChange={(value) => setSelectedMetrics(value ? value.split(',') : ["netWorth"])}
            >
              <SelectTrigger className="bg-[#1A1F2C]/60 border-[#1A1F2C]">
                <SelectValue placeholder="Select metrics" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="netWorth">Net Worth</SelectItem>
                <SelectItem value="netWorth,assets,liabilities">All Totals</SelectItem>
                <SelectItem value="assets">Total Assets</SelectItem>
                <SelectItem value="liabilities">Total Liabilities</SelectItem>
                {/* Could add individual accounts here if needed */}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Time Range</label>
            <div className="flex gap-2">
              <button 
                onClick={() => setTimeRange("1m")}
                className={cn(
                  "px-2 py-1 text-xs rounded-md",
                  timeRange === "1m" ? "bg-[#9b87f5] text-white" : "bg-[#1A1F2C] hover:bg-[#1A1F2C]/80"
                )}
              >
                1 Month
              </button>
              <button 
                onClick={() => setTimeRange("3m")}
                className={cn(
                  "px-2 py-1 text-xs rounded-md",
                  timeRange === "3m" ? "bg-[#9b87f5] text-white" : "bg-[#1A1F2C] hover:bg-[#1A1F2C]/80"
                )}
              >
                3 Months
              </button>
              <button 
                onClick={() => setTimeRange("6m")}
                className={cn(
                  "px-2 py-1 text-xs rounded-md",
                  timeRange === "6m" ? "bg-[#9b87f5] text-white" : "bg-[#1A1F2C] hover:bg-[#1A1F2C]/80"
                )}
              >
                6 Months
              </button>
              <button 
                onClick={() => setTimeRange("1y")}
                className={cn(
                  "px-2 py-1 text-xs rounded-md",
                  timeRange === "1y" ? "bg-[#9b87f5] text-white" : "bg-[#1A1F2C] hover:bg-[#1A1F2C]/80"
                )}
              >
                1 Year
              </button>
              <button 
                onClick={() => setTimeRange("all")}
                className={cn(
                  "px-2 py-1 text-xs rounded-md",
                  timeRange === "all" ? "bg-[#9b87f5] text-white" : "bg-[#1A1F2C] hover:bg-[#1A1F2C]/80"
                )}
              >
                All Time
              </button>
            </div>
          </div>
        </div>
        
        <Card className="bg-[#1A1F2C]/60 border-[#1A1F2C]/80">
          <CardHeader>
            <CardTitle>Financial Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={trendData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A1F2C" />
                  <XAxis dataKey="date" stroke="#9b87f5" />
                  <YAxis stroke="#9b87f5" />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#1A1F2C',
                      border: '1px solid #2A2F42',
                      borderRadius: '8px'
                    }} 
                    formatter={(value: number) => [formatCurrency(value)]}
                  />
                  <Legend />
                  {selectedMetrics.includes('netWorth') && (
                    <Line type="monotone" dataKey="netWorth" name="Net Worth" stroke="#9b87f5" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 6 }} />
                  )}
                  {selectedMetrics.includes('assets') && (
                    <Line type="monotone" dataKey="assets" name="Total Assets" stroke="#33C3F0" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 6 }} />
                  )}
                  {selectedMetrics.includes('liabilities') && (
                    <Line type="monotone" dataKey="liabilities" name="Total Liabilities" stroke="#FF6B6B" strokeWidth={2} dot={{ r: 2 }} activeDot={{ r: 6 }} />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* Transaction Log Tab */}
      <TabsContent value="log" className="space-y-4">
        <h3 className="text-lg font-medium mb-3">Balance Update History</h3>
        
        {sortedDates.map(date => (
          <div key={date} className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <CalendarIcon className="h-4 w-4 text-[#9b87f5]" />
              <h4 className="font-medium">{format(new Date(date), 'MMMM dd, yyyy')}</h4>
            </div>
            
            <div className="space-y-2 pl-6 border-l border-[#1A1F2C]">
              {balanceUpdatesByDate[date].map((update: any) => (
                <div 
                  key={update.id}
                  className="p-3 bg-[#1A1F2C]/40 rounded-lg border border-[#1A1F2C]/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                >
                  <div className="flex items-center">
                    <Badge variant={update.accountType === 'asset' ? 'outline' : 'destructive'} className="mr-2">
                      {update.accountType === 'asset' ? 'Asset' : 'Liability'}
                    </Badge>
                    <span className="font-medium">{update.accountName}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div className="text-sm text-muted-foreground">
                      {formatCurrency(update.balance)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </TabsContent>
    </Tabs>
  );
};
