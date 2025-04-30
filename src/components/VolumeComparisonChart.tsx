
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Coin, formatCurrency } from '@/services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';

interface VolumeComparisonChartProps {
  coins: Coin[];
  isLoading: boolean;
  currency: string;
  limit?: number;
}

const VolumeComparisonChart: React.FC<VolumeComparisonChartProps> = ({
  coins,
  isLoading,
  currency,
  limit = 10
}) => {
  // Format volume data
  const formatVolumeData = () => {
    if (!coins || coins.length === 0) return [];
    
    return coins
      .filter(coin => coin.total_volume && coin.total_volume > 0)
      .sort((a, b) => (b.total_volume || 0) - (a.total_volume || 0))
      .slice(0, limit)
      .map(coin => ({
        name: coin.symbol.toUpperCase(),
        volume: coin.total_volume,
        fullName: coin.name,
      }));
  };

  const volumeData = formatVolumeData();

  const formatYAxisTick = (value: number) => {
    if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(1)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(1)}M`;
    } else if (value >= 1e3) {
      return `$${(value / 1e3).toFixed(1)}K`;
    } else {
      return `$${value}`;
    }
  };

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const coin = payload[0].payload;
      return (
        <div className="bg-crypto-dark p-3 border border-gray-700 rounded-md">
          <p className="font-medium">{coin.fullName}</p>
          <p className="text-sm text-gray-300">
            {formatCurrency(coin.volume, currency, 0)}
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
          <CardTitle>Trading Volume (24h)</CardTitle>
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
        <CardTitle>Trading Volume (24h)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {volumeData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={volumeData}
                margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2d3748" />
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 12, fill: '#a0aec0' }}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                />
                <YAxis 
                  tickFormatter={formatYAxisTick}
                  tick={{ fontSize: 12, fill: '#a0aec0' }}
                />
                <Tooltip content={customTooltip} />
                <Bar 
                  dataKey="volume" 
                  fill="#3b82f6" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-gray-400">No volume data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VolumeComparisonChart;
