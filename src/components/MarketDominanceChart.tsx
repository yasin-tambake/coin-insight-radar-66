
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Coin } from '@/services/api';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface MarketDominanceChartProps {
  coins: Coin[];
  isLoading: boolean;
  limit?: number;
}

const MarketDominanceChart: React.FC<MarketDominanceChartProps> = ({
  coins,
  isLoading,
  limit = 6
}) => {
  // Format market cap data
  const formatDominanceData = () => {
    if (!coins || coins.length === 0) return [];
    
    // Calculate total market cap
    const totalMarketCap = coins.reduce((sum, coin) => sum + (coin.market_cap || 0), 0);
    
    // Get top coins by market cap
    const topCoins = [...coins]
      .filter(coin => coin.market_cap && coin.market_cap > 0)
      .sort((a, b) => (b.market_cap || 0) - (a.market_cap || 0))
      .slice(0, limit - 1);
    
    // Calculate market cap for "Others"
    const topCoinsMarketCap = topCoins.reduce((sum, coin) => sum + (coin.market_cap || 0), 0);
    const othersMarketCap = totalMarketCap - topCoinsMarketCap;
    
    // Create chart data
    const chartData = topCoins.map(coin => ({
      name: coin.symbol.toUpperCase(),
      value: coin.market_cap || 0,
      fullName: coin.name,
      percentage: ((coin.market_cap || 0) / totalMarketCap) * 100,
      color: getCoinColor(coin.symbol)
    }));
    
    // Add "Others" category
    chartData.push({
      name: 'Others',
      value: othersMarketCap,
      fullName: 'Other Cryptocurrencies',
      percentage: (othersMarketCap / totalMarketCap) * 100,
      color: '#64748b'
    });
    
    return chartData;
  };

  const getCoinColor = (symbol: string) => {
    const colors: Record<string, string> = {
      btc: '#f7931a', // Bitcoin
      eth: '#627eea', // Ethereum
      usdt: '#26a17b', // Tether
      bnb: '#f3ba2f', // Binance Coin
      xrp: '#23292f', // XRP
      sol: '#00aed0', // Solana
      usdc: '#2775ca', // USD Coin
      ada: '#0033ad', // Cardano
      avax: '#e84142', // Avalanche
      doge: '#c3a634', // Dogecoin
    };
    
    return colors[symbol.toLowerCase()] || '#3b82f6';
  };

  const dominanceData = formatDominanceData();
  
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    if (percent < 0.05) return null; // Don't show labels for small segments
    
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };
  
  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-crypto-dark p-3 border border-gray-700 rounded-md">
          <p className="font-medium">{data.fullName}</p>
          <p className="text-sm text-gray-300">
            ${data.value.toLocaleString()}
          </p>
          <p className="text-sm text-gray-400">
            {data.percentage.toFixed(2)}% of market
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <Card className="bg-crypto-dark border-gray-800">
        <CardHeader>
          <CardTitle>Market Dominance</CardTitle>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="w-full h-full bg-gray-800 rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-crypto-dark border-gray-800">
      <CardHeader>
        <CardTitle>Market Dominance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {dominanceData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dominanceData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dominanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={customTooltip} />
                <Legend 
                  layout="horizontal" 
                  verticalAlign="bottom" 
                  align="center" 
                  formatter={(value) => <span style={{ color: '#a0aec0' }}>{value}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-400">No market data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketDominanceChart;
