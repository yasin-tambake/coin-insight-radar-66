
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { useCryptoList, useCurrencies, useTrendingCoins } from '@/hooks/useCrypto';
import { usePriceAlerts } from '@/hooks/useAlerts';
import { fetchTopGainersLosers } from '@/services/api/coinGecko';
import CoinList from '@/components/CoinList';
import TopPerformersChart from '@/components/TopPerformersChart';
import GainersLosersChart from '@/components/GainersLosersChart';
import VolumeComparisonChart from '@/components/VolumeComparisonChart';
import MarketDominanceChart from '@/components/MarketDominanceChart';
import VolatilityChart from '@/components/VolatilityChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/services/api';
import { Coin } from '@/services/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ChatbotInterface from '@/components/AiAssistant/ChatbotInterface';

const Dashboard = () => {
  const { selectedCurrency } = useCurrencies();
  const [activeTab, setActiveTab] = useState('overview');
  
  const {
    coins,
    isLoading,
    error,
    searchTerm,
    setSearchTerm,
    sortConfig,
    sortByColumn,
    favorites,
    toggleFavorite,
  } = useCryptoList(selectedCurrency);
  
  const {
    trendingCoins,
    isLoading: isLoadingTrending,
  } = useTrendingCoins();

  const { checkAlerts } = usePriceAlerts();
  
  // Fetch top gainers and losers
  const { 
    data: topMovers,
    isLoading: isLoadingMovers
  } = useQuery({
    queryKey: ['topMovers', selectedCurrency],
    queryFn: () => fetchTopGainersLosers(selectedCurrency),
    refetchInterval: 300000, // 5 minutes
  });

  // Check for price alerts whenever coin data updates
  useEffect(() => {
    if (coins && !isLoading) {
      checkAlerts(coins);
    }
  }, [coins, isLoading, checkAlerts]);

  const onSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  const onSort = (key: string) => {
    // Fix: Ensure key is a valid property of Coin
    sortByColumn(key as keyof Coin);
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold">Cryptocurrency Dashboard</h1>
            <TabsList className="bg-crypto-dark">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="charts">Charts</TabsTrigger>
              <TabsTrigger value="list">All Coins</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="space-y-6">
            {/* Top Row: Charts and trending */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Market Performance Charts */}
              <div className="lg:col-span-2">
                <TopPerformersChart 
                  coins={coins} 
                  isLoading={isLoading} 
                  currency={selectedCurrency} 
                />
              </div>
              
              {/* Trending Coins */}
              <div>
                <Card className="bg-crypto-dark border-gray-800 h-full">
                  <CardHeader>
                    <CardTitle>Trending Cryptocurrencies</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isLoadingTrending ? (
                      <div className="space-y-4">
                        {[...Array(7)].map((_, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gray-800 animate-pulse"></div>
                            <div className="flex-1">
                              <div className="h-4 w-24 bg-gray-800 animate-pulse mb-1"></div>
                              <div className="h-3 w-16 bg-gray-800 animate-pulse"></div>
                            </div>
                            <div className="h-5 w-16 bg-gray-800 animate-pulse"></div>
                          </div>
                        ))}
                      </div>
                    ) : trendingCoins && trendingCoins.length ? (
                      <div className="space-y-4">
                        {trendingCoins.slice(0, 7).map((coin, i) => (
                          <div key={coin.id} className="flex items-center gap-3">
                            <div className="flex-none flex items-center justify-center w-8 h-8 rounded-full bg-gray-800 text-sm font-medium">
                              #{i+1}
                            </div>
                            <div className="flex items-center gap-2 flex-1">
                              <img src={coin.thumb} alt={coin.name} className="h-6 w-6 rounded-full" />
                              <div>
                                <div className="font-medium">{coin.name}</div>
                                <div className="text-xs text-gray-400">{coin.symbol}</div>
                              </div>
                            </div>
                            <Badge variant="outline" className="bg-gray-800 hover:bg-gray-700">
                              Rank #{coin.market_cap_rank || 'N/A'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-400">No trending data available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {/* Second Row: Gainers/Losers and Volume */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <GainersLosersChart 
                gainers={topMovers?.gainers || []}
                losers={topMovers?.losers || []}
                isLoading={isLoadingMovers}
                currency={selectedCurrency}
              />
              <VolumeComparisonChart 
                coins={coins || []} 
                isLoading={isLoading}
                currency={selectedCurrency}
                limit={8}
              />
            </div>

            {/* Popular Cryptocurrencies */}
            <div>
              <h2 className="text-2xl font-bold mb-6">Popular Cryptocurrencies</h2>
              <CoinList
                coins={coins?.slice(0, 8) || []}
                isLoading={isLoading}
                currency={selectedCurrency}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onSearch={onSearch}
                onSort={onSort}
                sortConfig={sortConfig}
              />
            </div>
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            {/* Advanced Charts View */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <MarketDominanceChart 
                coins={coins || []} 
                isLoading={isLoading}
              />
              <VolatilityChart 
                coins={coins || []} 
                isLoading={isLoading}
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <VolumeComparisonChart 
                coins={coins || []} 
                isLoading={isLoading}
                currency={selectedCurrency}
                limit={12}
              />
            </div>

            <div className="grid grid-cols-1 gap-6">
              <TopPerformersChart 
                coins={coins} 
                isLoading={isLoading} 
                currency={selectedCurrency} 
              />
            </div>
          </TabsContent>

          <TabsContent value="list">
            {/* Main Cryptocurrency List */}
            <div>
              <h2 className="text-2xl font-bold mb-6">All Cryptocurrencies</h2>
              <CoinList
                coins={coins}
                isLoading={isLoading}
                currency={selectedCurrency}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onSearch={onSearch}
                onSort={onSort}
                sortConfig={sortConfig}
              />
            </div>
          </TabsContent>
        </Tabs>

        {/* AI Assistant */}
        <ChatbotInterface />
      </div>
    </Layout>
  );
};

export default Dashboard;
