
import { useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coin } from '@/services/api/types';
import { formatCurrency, formatPercentage } from '@/services/api/formatting';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface TopPerformersChartProps {
  coins: Coin[];
  isLoading: boolean;
  currency: string;
}

const TopPerformersChart: React.FC<TopPerformersChartProps> = ({ 
  coins,
  isLoading,
  currency 
}) => {
  const [topPerformers24h, topPerformers7d, marketShareData] = useMemo(() => {
    if (!coins || coins.length === 0) {
      return [[], [], []];
    }

    // Top performers by 24h change
    const sorted24h = [...coins]
      .filter(coin => coin.price_change_percentage_24h !== undefined && !isNaN(coin.price_change_percentage_24h))
      .sort((a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0))
      .slice(0, 5);
    
    // Top performers by 7d change
    const sorted7d = [...coins]
      .filter(coin => coin.price_change_percentage_7d_in_currency !== undefined && !isNaN(coin.price_change_percentage_7d_in_currency))
      .sort((a, b) => (b.price_change_percentage_7d_in_currency || 0) - (a.price_change_percentage_7d_in_currency || 0))
      .slice(0, 5);
    
    // Market share data
    const topByMarketCap = [...coins]
      .sort((a, b) => b.market_cap - a.market_cap)
      .slice(0, 9); // Get top 9 coins
    
    const totalMarketCap = coins.reduce((sum, coin) => sum + coin.market_cap, 0);
    const othersMarketCap = totalMarketCap - topByMarketCap.reduce((sum, coin) => sum + coin.market_cap, 0);
    
    const marketShareData = [
      ...topByMarketCap.map(coin => ({
        name: coin.symbol.toUpperCase(),
        value: coin.market_cap,
        fullName: coin.name,
        percentage: (coin.market_cap / totalMarketCap) * 100
      })),
      {
        name: 'Others',
        value: othersMarketCap,
        fullName: 'Other Cryptocurrencies',
        percentage: (othersMarketCap / totalMarketCap) * 100
      }
    ];
    
    return [sorted24h, sorted7d, marketShareData];
  }, [coins]);

  // Format data for bar charts
  const barData24h = topPerformers24h.map(coin => ({
    name: coin.symbol.toUpperCase(),
    change: coin.price_change_percentage_24h || 0,
    fullName: coin.name
  }));

  const barData7d = topPerformers7d.map(coin => ({
    name: coin.symbol.toUpperCase(),
    change: coin.price_change_percentage_7d_in_currency || 0,
    fullName: coin.name
  }));

  // Custom colors for pie chart
  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#6366f1', '#f97316', '#64748b'];

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);
    
    if (percent < 0.05) return null; // Don't show label for small segments
    
    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="12"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-crypto-dark p-3 border border-gray-700 rounded-md">
          <p className="font-medium">{payload[0].payload.fullName}</p>
          <p className="text-sm text-gray-300">
            {formatPercentage(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  const marketShareTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-crypto-dark p-3 border border-gray-700 rounded-md">
          <p className="font-medium">{payload[0].payload.fullName}</p>
          <p className="text-sm text-gray-300">
            {formatCurrency(payload[0].value, currency, 0)}
          </p>
          <p className="text-xs text-gray-400">
            {payload[0].payload.percentage.toFixed(2)}% of market
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
          <CardTitle>Market Performance</CardTitle>
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
        <CardTitle>Market Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="24h">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="24h">24h Change</TabsTrigger>
            <TabsTrigger value="7d">7d Change</TabsTrigger>
            <TabsTrigger value="market">Market Share</TabsTrigger>
          </TabsList>
          
          <TabsContent value="24h" className="h-80">
            {barData24h.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData24h}
                  margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                  layout="vertical"
                >
                  <XAxis 
                    type="number" 
                    domain={['dataMin', 'dataMax']}
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
                    {barData24h.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.change >= 0 ? '#16c784' : '#ea3943'} />
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
          
          <TabsContent value="7d" className="h-80">
            {barData7d.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData7d}
                  margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                  layout="vertical"
                >
                  <XAxis 
                    type="number" 
                    domain={['dataMin', 'dataMax']} 
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
                    {barData7d.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.change >= 0 ? '#16c784' : '#ea3943'} />
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
          
          <TabsContent value="market" className="h-80">
            {marketShareData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={marketShareData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderCustomizedLabel}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {marketShareData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={marketShareTooltip} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center">
                <p className="text-gray-400">No market cap data available</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TopPerformersChart;
