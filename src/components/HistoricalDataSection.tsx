import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useFinancial } from "@/context/FinancialContext";
import { useCurrency } from "@/context/CurrencyContext";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";

export const HistoricalDataSection = () => {
  const { getHistoricalNetWorth, getTotalAssets, getTotalLiabilities } = useFinancial();
  const { formatAmount } = useCurrency();
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [historicalData, setHistoricalData] = useState<any[]>([]);
  const [comparison, setComparison] = useState({
    netWorthChange: 0,
    netWorthChangePercent: 0,
    assetsChange: 0,
    assetsChangePercent: 0,
    liabilitiesChange: 0,
    liabilitiesChangePercent: 0,
  });

  // Initialize dates and fetch data
  useEffect(() => {
    const data = getHistoricalNetWorth();
    if (data.length >= 2) {
      setStartDate(data[0].date);
      setEndDate(data[data.length - 1].date);
      setHistoricalData(data);
    }
  }, [getHistoricalNetWorth]);

  // Calculate changes when dates change
  useEffect(() => {
    if (!startDate || !endDate) return;

    const filteredData = historicalData.filter(
      item => new Date(item.date) >= new Date(startDate) && new Date(item.date) <= new Date(endDate)
    );

    if (filteredData.length >= 2) {
      const startData = filteredData[0];
      const endData = filteredData[filteredData.length - 1];

      const netWorthChange = endData.netWorth - startData.netWorth;
      const netWorthChangePercent = startData.netWorth !== 0 
        ? (netWorthChange / Math.abs(startData.netWorth)) * 100 
        : 0;

      setComparison({
        netWorthChange,
        netWorthChangePercent,
        assetsChange: endData.assets - startData.assets,
        assetsChangePercent: startData.assets !== 0 
          ? ((endData.assets - startData.assets) / Math.abs(startData.assets)) * 100 
          : 0,
        liabilitiesChange: endData.liabilities - startData.liabilities,
        liabilitiesChangePercent: startData.liabilities !== 0 
          ? ((endData.liabilities - startData.liabilities) / Math.abs(startData.liabilities)) * 100 
          : 0,
      });
    }
  }, [startDate, endDate, historicalData]);

  // Format date for display
  const formatDateForDisplay = (date: string) => {
    return format(new Date(date), "MMM dd, yyyy");
  };

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1A1F2C] border border-[#33C3F0]/20 rounded-lg p-3 shadow-lg">
          <p className="text-[#7A7F92] text-sm mb-1">{format(new Date(label), "MMM dd, yyyy")}</p>
          <p className="text-[#33C3F0] text-sm font-medium">
            Net Worth: {formatAmount(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#CBD5E1]">Historical Comparison</h3>
        <div className="flex items-center gap-2">
          <Select value={startDate} onValueChange={setStartDate}>
            <SelectTrigger className="w-[130px] text-xs h-8 bg-[#1A1F2C] border-[#33C3F0]/20">
              <SelectValue placeholder="Start date" />
            </SelectTrigger>
            <SelectContent className="bg-[#131620] border-[#33C3F0]/20 max-h-[200px]">
              {historicalData.map((item) => (
                <SelectItem 
                  key={item.date} 
                  value={item.date}
                  className="text-xs"
                >
                  {formatDateForDisplay(item.date)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <span className="text-[#7A7F92] text-xs">to</span>

          <Select value={endDate} onValueChange={setEndDate}>
            <SelectTrigger className="w-[130px] text-xs h-8 bg-[#1A1F2C] border-[#33C3F0]/20">
              <SelectValue placeholder="End date" />
            </SelectTrigger>
            <SelectContent className="bg-[#131620] border-[#33C3F0]/20 max-h-[200px]">
              {historicalData.map((item) => (
                <SelectItem 
                  key={item.date} 
                  value={item.date}
                  className="text-xs"
                >
                  {formatDateForDisplay(item.date)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-[#131620]/60 border border-[#33C3F0]/10 rounded-lg p-4 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={historicalData.filter(
              item => new Date(item.date) >= new Date(startDate) && new Date(item.date) <= new Date(endDate)
            )}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1A1F2C" />
            <XAxis 
              dataKey="date" 
              tickFormatter={(date) => format(new Date(date), "MMM dd")}
              stroke="#7A7F92"
              fontSize={12}
            />
            <YAxis 
              tickFormatter={(value) => formatAmount(value)}
              stroke="#7A7F92"
              fontSize={12}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey="netWorth" 
              stroke="#33C3F0" 
              strokeWidth={2}
              dot={{ fill: "#33C3F0", r: 4 }}
              activeDot={{ r: 6, fill: "#66EACE" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4">
        {/* Net Worth Card */}
        <Card className="bg-[#1A1F2C]/50 border-[#33C3F0]/20 shadow-lg overflow-hidden">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#33C3F0]" />
              <span>Net Worth</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex flex-col">
              <div className="text-lg sm:text-xl font-semibold text-[#33C3F0]">
                {formatAmount(comparison.netWorthChange)}
              </div>
              <div className="flex items-center">
                {comparison.netWorthChangePercent >= 0 ? (
                  <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-400 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-400 mr-1" />
                )}
                <span className={comparison.netWorthChangePercent >= 0 ? "text-green-400" : "text-red-400"}>
                  {comparison.netWorthChangePercent.toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assets Card */}
        <Card className="bg-[#1A1F2C]/50 border-[#33C3F0]/20 shadow-lg overflow-hidden">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-400" />
              <span>Assets</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex flex-col">
              <div className="text-lg sm:text-xl font-semibold text-green-400">
                {formatAmount(comparison.assetsChange)}
              </div>
              <div className="flex items-center">
                {comparison.assetsChangePercent >= 0 ? (
                  <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-400 mr-1" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-400 mr-1" />
                )}
                <span className={comparison.assetsChangePercent >= 0 ? "text-green-400" : "text-red-400"}>
                  {comparison.assetsChangePercent.toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liabilities Card */}
        <Card className="bg-[#1A1F2C]/50 border-[#33C3F0]/20 shadow-lg overflow-hidden">
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-sm sm:text-base flex items-center gap-2">
              <TrendingDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-400" />
              <span>Liabilities</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex flex-col">
              <div className="text-lg sm:text-xl font-semibold text-red-400">
                {formatAmount(comparison.liabilitiesChange)}
              </div>
              <div className="flex items-center">
                {comparison.liabilitiesChangePercent <= 0 ? (
                  <ArrowDownRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-400 mr-1" />
                ) : (
                  <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-400 mr-1" />
                )}
                <span className={comparison.liabilitiesChangePercent <= 0 ? "text-green-400" : "text-red-400"}>
                  {comparison.liabilitiesChangePercent.toFixed(1)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}; 