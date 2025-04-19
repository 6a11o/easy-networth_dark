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
import { useCurrency } from "@/context/CurrencyContext";

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
  
  const { formatAmount } = useCurrency();
  
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

  // Sort historical data for the log (newest first)
  const historicalLogData = [...getHistoricalNetWorth()].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="w-full space-y-10">
      
      {/* SECTION 1: Historical Analysis */}
      <div id="historical-data" className="bg-[#131620]/90 border border-[#33C3F0]/20 rounded-xl p-4 sm:p-6 shadow-2xl backdrop-blur-xl hover:shadow-xl transition-all scroll-mt-20">
        <Tabs defaultValue="trends" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 sm:mb-6 bg-[#1A1F2C] border border-[#33C3F0]/10 p-1">
            <TabsTrigger value="trends" className="text-xs sm:text-sm">Money Habits</TabsTrigger>
            <TabsTrigger value="comparison" className="text-xs sm:text-sm">Historical Data</TabsTrigger>
          </TabsList>
          
          {/* FINANCIAL TRENDS TAB */}
          <TabsContent value="trends" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-full sm:w-36 text-xs sm:text-sm h-8 sm:h-9 bg-[#1A1F2C] border-[#33C3F0]/20">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#131620] border-[#33C3F0]/20">
                    <SelectItem value="all" className="text-xs sm:text-sm">All time</SelectItem>
                    <SelectItem value="1m" className="text-xs sm:text-sm">Last month</SelectItem>
                    <SelectItem value="3m" className="text-xs sm:text-sm">Last 3 months</SelectItem>
                    <SelectItem value="6m" className="text-xs sm:text-sm">Last 6 months</SelectItem>
                    <SelectItem value="1y" className="text-xs sm:text-sm">Last year</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select 
                  value={selectedMetrics.join(',')} 
                  onValueChange={(value) => setSelectedMetrics(value.split(','))}
                >
                  <SelectTrigger className="w-full sm:w-44 text-xs sm:text-sm h-8 sm:h-9 bg-[#1A1F2C] border-[#33C3F0]/20">
                    <SelectValue placeholder="Select metrics" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#131620] border-[#33C3F0]/20">
                    <SelectItem value="netWorth" className="text-xs sm:text-sm">Net Worth</SelectItem>
                    <SelectItem value="netWorth,assets,liabilities" className="text-xs sm:text-sm">All financials</SelectItem>
                    <SelectItem value="assets" className="text-xs sm:text-sm">Assets only</SelectItem>
                    <SelectItem value="liabilities" className="text-xs sm:text-sm">Liabilities only</SelectItem>
                    {/* Individual accounts could be added here */}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {selectedMetrics.includes('netWorth') && (
                  <Badge variant="outline" className="bg-[#33C3F0]/10 border-[#33C3F0]/30 text-[#33C3F0] text-[10px] sm:text-xs">
                    Net Worth
                  </Badge>
                )}
                {selectedMetrics.includes('assets') && (
                  <Badge variant="outline" className="bg-green-400/10 border-green-400/30 text-green-400 text-[10px] sm:text-xs">
                    Assets
                  </Badge>
                )}
                {selectedMetrics.includes('liabilities') && (
                  <Badge variant="outline" className="bg-red-400/10 border-red-400/30 text-red-400 text-[10px] sm:text-xs">
                    Liabilities
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="w-full h-[250px] sm:h-[350px] mb-4 sm:mb-6 bg-[#0F1119]/70 rounded-lg border border-[#33C3F0]/10 p-2 sm:p-4 overflow-hidden">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    axisLine={{ stroke: 'rgba(255, 255, 255, 0.4)' }} 
                    tickLine={{ stroke: 'rgba(255, 255, 255, 0.4)' }}
                    tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 10 }}
                    dy={10}
                    minTickGap={30}
                    height={40}
                  />
                  <YAxis 
                    axisLine={{ stroke: 'rgba(255, 255, 255, 0.4)' }} 
                    tickLine={{ stroke: 'rgba(255, 255, 255, 0.4)' }}
                    tick={{ fill: 'rgba(255, 255, 255, 0.7)', fontSize: 10 }}
                    width={50}
                    tickFormatter={(value) => `${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#131620', borderColor: 'rgba(51, 195, 240, 0.3)', color: '#fff', fontSize: '12px', borderRadius: '4px' }}
                    labelStyle={{ fontWeight: 'bold', marginBottom: '4px' }}
                  />
                  <Legend
                    verticalAlign="top"
                    height={30}
                    iconSize={12}
                    iconType="circle"
                    fontSize={11}
                  />
                  {selectedMetrics.includes('netWorth') && (
                    <Line 
                      type="monotone" 
                      dataKey="netWorth" 
                      name="Net Worth" 
                      stroke="#33C3F0" 
                      strokeWidth={2} 
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                  )}
                  {selectedMetrics.includes('assets') && (
                    <Line 
                      type="monotone" 
                      dataKey="assets" 
                      name="Assets" 
                      stroke="#4ade80" 
                      strokeWidth={2} 
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                  )}
                  {selectedMetrics.includes('liabilities') && (
                    <Line 
                      type="monotone" 
                      dataKey="liabilities" 
                      name="Liabilities" 
                      stroke="#f87171" 
                      strokeWidth={2} 
                      dot={false}
                      activeDot={{ r: 6 }}
                    />
                  )}
                  {/* Add lines for individual accounts if selected */}
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div id="what-i-did" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              <Card className="bg-[#1A1F2C]/50 border-[#33C3F0]/20 shadow-lg">
                <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-[#33C3F0]" />
                    <span>Net Worth Growth</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                  {trendData.length >= 2 ? (
                    <>
                      <div className="flex items-baseline gap-1 mb-1">
                        <span className="text-xl sm:text-2xl font-bold">
                          {formatAmount(trendData[trendData.length - 1].netWorth - trendData[0].netWorth)}
                        </span>
                      </div>
                      <div className="flex items-center">
                        {trendData[trendData.length - 1].netWorth - trendData[0].netWorth > 0 ? (
                          <>
                            <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-400 mr-1" />
                            <span className="text-green-400 text-xs sm:text-sm">
                              {((trendData[trendData.length - 1].netWorth - trendData[0].netWorth) / 
                                Math.abs(trendData[0].netWorth) * 100).toFixed(1)}% increase
                            </span>
                          </>
                        ) : (
                          <>
                            <ArrowDownRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-400 mr-1" />
                            <span className="text-red-400 text-xs sm:text-sm">
                              {((trendData[trendData.length - 1].netWorth - trendData[0].netWorth) / 
                                Math.abs(trendData[0].netWorth) * 100).toFixed(1)}% decrease
                            </span>
                          </>
                        )}
                      </div>
                    </>
                  ) : (
                    <p className="text-[#7A7F92] text-xs sm:text-sm">Need at least two data points</p>
                  )}
                </CardContent>
              </Card>
              
              <Card className="bg-[#1A1F2C]/50 border-[#33C3F0]/20 shadow-lg">
                <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-3">
                  <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#33C3F0]" />
                    <span>Time Period</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                  {trendData.length >= 2 ? (
                    <>
                      <div className="text-base sm:text-lg font-medium">
                        {trendData[0].date} - {trendData[trendData.length - 1].date}
                      </div>
                      <div className="text-[#7A7F92] text-xs sm:text-sm mt-1">
                        {trendData.length} data points
                      </div>
                    </>
                  ) : (
                    <p className="text-[#7A7F92] text-xs sm:text-sm">No data available</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          {/* TIME COMPARISON TAB */}
          <TabsContent value="comparison" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col xs:flex-row gap-3 mb-4">
              <Select value={startDate} onValueChange={setStartDate}>
                <SelectTrigger className="w-full text-xs sm:text-sm h-8 sm:h-9 bg-[#1A1F2C] border-[#33C3F0]/20">
                  <SelectValue placeholder="Start date" />
                </SelectTrigger>
                <SelectContent className="bg-[#131620] border-[#33C3F0]/20 max-h-[200px]">
                  {availableDates.map(date => (
                    <SelectItem key={`start-${date}`} value={date} className="text-xs sm:text-sm">
                      {format(new Date(date), 'MMM dd, yyyy')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={endDate} onValueChange={setEndDate}>
                <SelectTrigger className="w-full text-xs sm:text-sm h-8 sm:h-9 bg-[#1A1F2C] border-[#33C3F0]/20">
                  <SelectValue placeholder="End date" />
                </SelectTrigger>
                <SelectContent className="bg-[#131620] border-[#33C3F0]/20 max-h-[200px]">
                  {availableDates.map(date => (
                    <SelectItem key={`end-${date}`} value={date} className="text-xs sm:text-sm">
                      {format(new Date(date), 'MMM dd, yyyy')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4">
              <Card className="bg-[#1A1F2C]/50 border-[#33C3F0]/20 shadow-lg overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                    <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#33C3F0]" />
                    <span>Net Worth</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex flex-col">
                    <div className={cn(
                      "text-lg sm:text-xl font-semibold",
                      comparison.netWorthChange > 0 ? "text-green-400" : 
                      comparison.netWorthChange < 0 ? "text-red-400" : ""
                    )}>
                      {formatAmount(comparison.netWorthChange)}
                    </div>
                    <div className="flex items-center">
                      {comparison.netWorthChange > 0 ? (
                        <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-400 mr-1" />
                      ) : comparison.netWorthChange < 0 ? (
                        <ArrowDownRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-400 mr-1" />
                      ) : null}
                      <span className={cn(
                        "text-xs sm:text-sm",
                        comparison.netWorthChange > 0 ? "text-green-400" : 
                        comparison.netWorthChange < 0 ? "text-red-400" : "text-[#7A7F92]"
                      )}>
                        {comparison.netWorthChange !== 0 
                          ? `${comparison.netWorthChangePercent > 0 ? "+" : ""}${comparison.netWorthChangePercent.toFixed(1)}%` 
                          : "No change"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-[#1A1F2C]/50 border-[#33C3F0]/20 shadow-lg overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                    <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-400" />
                    <span>Assets</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex flex-col">
                    <div className={cn(
                      "text-lg sm:text-xl font-semibold",
                      comparison.assetsChange > 0 ? "text-green-400" : 
                      comparison.assetsChange < 0 ? "text-red-400" : ""
                    )}>
                      {formatAmount(comparison.assetsChange)}
                    </div>
                    <div className="flex items-center">
                      {comparison.assetsChange > 0 ? (
                        <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-400 mr-1" />
                      ) : comparison.assetsChange < 0 ? (
                        <ArrowDownRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-400 mr-1" />
                      ) : null}
                      <span className={cn(
                        "text-xs sm:text-sm",
                        comparison.assetsChange > 0 ? "text-green-400" : 
                        comparison.assetsChange < 0 ? "text-red-400" : "text-[#7A7F92]"
                      )}>
                        {comparison.assetsChange !== 0 
                          ? `${comparison.assetsChangePercent > 0 ? "+" : ""}${comparison.assetsChangePercent.toFixed(1)}%` 
                          : "No change"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-[#1A1F2C]/50 border-[#33C3F0]/20 shadow-lg overflow-hidden">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-sm sm:text-base flex items-center gap-2">
                    <TrendingDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-400" />
                    <span>Liabilities</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex flex-col">
                    <div className={cn(
                      "text-lg sm:text-xl font-semibold",
                      comparison.liabilitiesChange < 0 ? "text-green-400" : 
                      comparison.liabilitiesChange > 0 ? "text-red-400" : ""
                    )}>
                      {formatAmount(comparison.liabilitiesChange)}
                    </div>
                    <div className="flex items-center">
                      {comparison.liabilitiesChange < 0 ? (
                        <ArrowDownRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-400 mr-1" />
                      ) : comparison.liabilitiesChange > 0 ? (
                        <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-400 mr-1" />
                      ) : null}
                      <span className={cn(
                        "text-xs sm:text-sm",
                        comparison.liabilitiesChange < 0 ? "text-green-400" : 
                        comparison.liabilitiesChange > 0 ? "text-red-400" : "text-[#7A7F92]"
                      )}>
                        {comparison.liabilitiesChange !== 0 
                          ? `${comparison.liabilitiesChange < 0 ? "-" : "+"}${Math.abs(comparison.liabilitiesChangePercent).toFixed(1)}%` 
                          : "No change"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Account Changes Section for smaller screens */}
            <div className="mt-4 overflow-auto">
              <h3 className="text-sm sm:text-base font-medium mb-2 sm:mb-3">Account Changes</h3>
              <div className="min-w-full">
                <div className="bg-[#1A1F2C]/50 rounded-lg border border-[#33C3F0]/20">
                  <div className="grid grid-cols-4 gap-2 p-3 text-xs font-medium text-[#7A7F92]">
                    <div>Account</div>
                    <div className="text-right">Start</div>
                    <div className="text-right">End</div>
                    <div className="text-right">Change</div>
                  </div>
                  <div className="divide-y divide-[#33C3F0]/10">
                    {comparison.accountChanges.length > 0 ? (
                      comparison.accountChanges.map(account => (
                        <div 
                          key={account.id}
                          className="grid grid-cols-4 gap-2 p-3 text-xs hover:bg-[#1A1F2C]/70"
                        >
                          <div className="font-medium truncate" title={account.name}>
                            <span className={account.type === 'asset' ? 'text-green-400' : 'text-red-400'}>
                              {account.type === 'asset' ? '+ ' : '− '}
                            </span>
                            {account.name}
                          </div>
                          <div className="text-right font-mono">{formatAmount(account.startBalance)}</div>
                          <div className="text-right font-mono">{formatAmount(account.endBalance)}</div>
                          <div className="text-right">
                            <span className={cn(
                              "font-medium",
                              account.type === 'asset' ? 
                                (account.change > 0 ? 'text-green-400' : account.change < 0 ? 'text-red-400' : '') :
                                (account.change < 0 ? 'text-green-400' : account.change > 0 ? 'text-red-400' : '')
                            )}>
                              {account.change !== 0 ? 
                                `${account.change > 0 ? '+' : ''}${account.changePercent.toFixed(1)}%` : 
                                '-'
                              }
                            </span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-center text-xs text-[#7A7F92]">
                        No account data available for comparison
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* SECTION 3: Activity Log (What I Did) */}
      <div id="what-i-did" className="bg-[#131620]/90 border border-[#33C3F0]/20 rounded-xl p-6 shadow-2xl backdrop-blur-xl space-y-4 scroll-mt-20">
        <h3 className="text-xl font-semibold text-[#CBD5E1] mb-4">What I Did</h3>
        <div className="bg-[#131620]/60 border border-[#33C3F0]/10 rounded-lg shadow-md">
          <div className="p-4 border-b border-[#33C3F0]/10 grid grid-cols-3 gap-4 font-medium text-sm text-[#7A7F92]">
            <div>Date</div>
            <div className="text-right">Net Worth</div>
            <div className="text-right">Change</div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {historicalLogData.map((item, index) => {
              // Calculate change from the next item in the sorted list (which is the previous chronological item)
              const previousItem = index + 1 < historicalLogData.length ? historicalLogData[index + 1] : null;
              const change = previousItem ? item.netWorth - previousItem.netWorth : 0;
              const changePercent = previousItem && previousItem.netWorth !== 0 
                ? (change / Math.abs(previousItem.netWorth)) * 100 
                : 0;
                
              const isLastItem = index === historicalLogData.length - 1;
              
              return (
                <div 
                  key={item.date}
                  className={`grid grid-cols-3 gap-4 p-4 text-sm ${!isLastItem ? 'border-b border-[#1A1F2C]/60' : ''} hover:bg-[#1A1F2C]/40 transition-colors duration-150`}
                >
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                    {format(new Date(item.date), 'MMM dd, yyyy')}
                  </div>
                  <div className="text-right font-medium">
                    {formatAmount(item.netWorth)}
                  </div>
                  <div className={cn(
                    "text-right flex justify-end items-center",
                    change >= 0 ? "text-green-500" : "text-red-500"
                  )}>
                    {previousItem ? (
                      <>
                        {change >= 0 ? 
                          <ArrowUpRight className="h-3.5 w-3.5 mr-1" /> : 
                          <ArrowDownRight className="h-3.5 w-3.5 mr-1" />
                        }
                        {formatAmount(change)} ({changePercent.toFixed(1)}%)
                      </>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
