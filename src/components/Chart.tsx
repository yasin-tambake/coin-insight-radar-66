
import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { ChartData } from '@/services/api';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

interface ChartProps {
  data: ChartData | null;
  isLoading: boolean;
  coinId: string;
  coinName: string;
  color: string;
  currency: string;
  timeRange: string;
  onTimeRangeChange: (range: '1d' | '7d' | '30d' | '90d' | '1y') => void;
}

interface TransformedDataPoint {
  date: string;
  fullDate: string;
  price: number;
  volume: number;
}

const Chart: React.FC<ChartProps> = ({
  data,
  isLoading,
  coinId,
  coinName,
  color = '#3b82f6',
  currency,
  timeRange,
  onTimeRangeChange
}) => {
  const [transformedData, setTransformedData] = useState<TransformedDataPoint[]>([]);
  
  useEffect(() => {
    if (!data) return;
    
    const transformed = data.prices.map((point, idx) => {
      const date = new Date(point[0]);
      return {
        date: formatDateForTimeRange(date, timeRange),
        fullDate: date.toISOString(),
        price: point[1],
        volume: data.total_volumes[idx] ? data.total_volumes[idx][1] : 0,
      };
    });
    
    setTransformedData(transformed);
  }, [data, timeRange]);
  
  const formatDateForTimeRange = (date: Date, range: string) => {
    switch(range) {
      case '1d':
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      case '7d':
        return date.toLocaleDateString([], { weekday: 'short' });
      case '30d':
      case '90d':
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
      case '1y':
        return date.toLocaleDateString([], { month: 'short', year: '2-digit' });
      default:
        return date.toLocaleDateString();
    }
  };
  
  const currencySymbol = currency === 'usd' ? '$' :
                         currency === 'eur' ? '€' :
                         currency === 'gbp' ? '£' :
                         currency === 'jpy' ? '¥' :
                         currency === 'inr' ? '₹' :
                         currency.toUpperCase() + ' ';
  
  const formatCurrency = (value: number) => {
    return `${currencySymbol}${value.toFixed(2)}`;
  };
  
  const formatVolume = (value: number) => {
    if (value >= 1_000_000_000) {
      return `${(value / 1_000_000_000).toFixed(2)}B`;
    }
    if (value >= 1_000_000) {
      return `${(value / 1_000_000).toFixed(2)}M`;
    }
    return `${(value / 1_000).toFixed(2)}K`;
  };
  
  const handleTimeRangeChange = (range: '1d' | '7d' | '30d' | '90d' | '1y') => {
    onTimeRangeChange(range);
  };
  
  if (isLoading) {
    return (
      <Card className="bg-crypto-dark border-gray-800 w-full h-[400px]">
        <CardHeader>
          <div className="w-48 h-6 bg-gray-800 rounded animate-pulse"></div>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <div className="w-full h-full bg-gray-800 rounded animate-pulse"></div>
        </CardContent>
      </Card>
    );
  }
  
  if (!data || transformedData.length === 0) {
    return (
      <Card className="bg-crypto-dark border-gray-800">
        <CardHeader>
          <CardTitle>{coinName} Price Chart</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <p className="text-gray-400">No chart data available</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="bg-crypto-dark border-gray-800">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle>{coinName} Price Chart</CardTitle>
        <Tabs value={timeRange} onValueChange={(val) => handleTimeRangeChange(val as any)}>
          <TabsList className="bg-gray-800">
            <TabsTrigger value="1d">1D</TabsTrigger>
            <TabsTrigger value="7d">7D</TabsTrigger>
            <TabsTrigger value="30d">30D</TabsTrigger>
            <TabsTrigger value="90d">90D</TabsTrigger>
            <TabsTrigger value="1y">1Y</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={transformedData}
              margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id={`colorPrice-${coinId}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#2d3748" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: '#a0aec0' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                domain={['auto', 'auto']}
                tick={{ fontSize: 12, fill: '#a0aec0' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => formatCurrency(value)}
              />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), 'Price']}
                labelFormatter={(label) => `Date: ${label}`}
                contentStyle={{
                  backgroundColor: '#1a202c',
                  border: '1px solid #2d3748',
                  borderRadius: '4px',
                  color: '#e2e8f0',
                }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke={color}
                fillOpacity={1}
                fill={`url(#colorPrice-${coinId})`}
                activeDot={{ r: 6 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default Chart;
