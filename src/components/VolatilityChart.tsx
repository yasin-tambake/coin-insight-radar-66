
import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Coin } from '@/services/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface VolatilityChartProps {
  coins: Coin[];
  isLoading: boolean;
  limit?: number;
}

const VolatilityChart: React.FC<VolatilityChartProps> = ({
  coins,
  isLoading,
  limit = 5
}) => {
  const volatilityData = useMemo(() => {
    if (!coins || coins.length === 0) return [];
    
    // Calculate volatility (we'll use price range high_24h/low_24h as a proxy for volatility)
    const coinsWithVolatility = coins
      .filter(coin => coin.high_24h && coin.low_24h && coin.current_price)
      .map(coin => {
        const volatility = ((coin.high_24h - coin.low_24h) / coin.current_price) * 100;
        return {
          ...coin,
          volatility,
          range_percentage: volatility
        };
      })
      .sort((a, b) => b.volatility - a.volatility)
      .slice(0, limit);
    
    return coinsWithVolatility;
  }, [coins, limit]);
  
  const chartData = useMemo(() => {
    return volatilityData.map(coin => ({
      name: coin.symbol.toUpperCase(),
      volatility: parseFloat(coin.volatility.toFixed(2)),
      fullName: coin.name,
    }));
  }, [volatilityData]);
  
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-crypto-dark p-3 border border-gray-700 rounded-md">
          <p className="font-medium">{data.fullName}</p>
          <p className="text-sm text-gray-300">
            Volatility: {data.volatility.toFixed(2)}%
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
          <CardTitle>Price Volatility (24h)</CardTitle>
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
        <CardTitle>Price Volatility (24h)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#2d3748" />
                <XAxis dataKey="name" tick={{ fill: '#a0aec0' }} />
                <YAxis 
                  tickFormatter={(value) => `${value}%`}
                  domain={[0, 'auto']}
                  tick={{ fill: '#a0aec0' }}
                />
                <Tooltip content={customTooltip} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="volatility"
                  stroke="#f59e0b"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-400">No volatility data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VolatilityChart;
