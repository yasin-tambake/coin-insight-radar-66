
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coin, formatCurrency, formatPercentage } from '@/services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface GainersLosersChartProps {
  gainers: Coin[];
  losers: Coin[];
  isLoading: boolean;
  currency: string;
}

const GainersLosersChart: React.FC<GainersLosersChartProps> = ({
  gainers,
  losers,
  isLoading,
  currency
}) => {
  const [activeTab, setActiveTab] = useState<'gainers' | 'losers'>('gainers');

  // Format data for charts
  const formatChartData = (coins: Coin[]) => {
    return coins.map(coin => ({
      name: coin.symbol.toUpperCase(),
      change: coin.price_change_percentage_24h || 0,
      fullName: coin.name,
      price: coin.current_price,
    }));
  };

  const gainersData = formatChartData(gainers);
  const losersData = formatChartData(losers);

  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const coin = payload[0].payload;
      return (
        <div className="bg-crypto-dark p-3 border border-gray-700 rounded-md">
          <p className="font-medium">{coin.fullName}</p>
          <p className="text-sm text-gray-300">
            {formatCurrency(coin.price, currency)}
          </p>
          <p className="text-sm font-bold" style={{ 
            color: coin.change >= 0 ? '#16c784' : '#ea3943'
          }}>
            {formatPercentage(coin.change)}
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
          <CardTitle>24h Price Change</CardTitle>
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
        <CardTitle>24h Price Change</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="gainers" value={activeTab} onValueChange={(v) => setActiveTab(v as 'gainers' | 'losers')}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="gainers" className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Top Gainers
            </TabsTrigger>
            <TabsTrigger value="losers" className="flex items-center gap-1">
              <TrendingDown className="h-4 w-4" />
              Top Losers
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="gainers" className="h-80">
            {gainersData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={gainersData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                  layout="vertical"
                >
                  <XAxis 
                    type="number" 
                    domain={[0, 'dataMax']}
                    tickFormatter={(value) => `+${value}%`} 
                    tick={{ fontSize: 12, fill: '#a0aec0' }}
                  />
                  <YAxis 
                    dataKey="name" 
                    type="category" 
                    tick={{ fontSize: 12, fill: '#a0aec0' }}
                  />
                  <Tooltip content={customTooltip} />
                  <Bar dataKey="change" barSize={20}>
                    {gainersData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#16c784" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-400">No price change data available</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="losers" className="h-80">
            {losersData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={losersData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                  layout="vertical"
                >
                  <XAxis 
                    type="number" 
                    domain={['dataMin', 0]}
                    tickFormatter={(value) => `${value}%`} 
                    tick={{ fontSize: 12, fill: '#a0aec0' }}
                  />
                  <YAxis 
                    dataKey="name" 
                    type="category"
                    tick={{ fontSize: 12, fill: '#a0aec0' }}
                  />
                  <Tooltip content={customTooltip} />
                  <Bar dataKey="change" barSize={20}>
                    {losersData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill="#ea3943" />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-400">No price change data available</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default GainersLosersChart;
