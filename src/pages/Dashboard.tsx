
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { useCryptoList, useCurrencies, useTrendingCoins } from '@/hooks/useCrypto';
import { usePriceAlerts } from '@/hooks/useAlerts';
import CoinList from '@/components/CoinList';
import TopPerformersChart from '@/components/TopPerformersChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/services/api';

const Dashboard = () => {
  const { selectedCurrency } = useCurrencies();
  
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

  // Check for price alerts whenever coin data updates
  useEffect(() => {
    if (coins && !isLoading) {
      checkAlerts(coins);
    }
  }, [coins, isLoading, checkAlerts]);

  const onSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  const onSort = (key: keyof any) => {
    sortByColumn(key);
  };

  return (
    <Layout>
      <div className="space-y-8">
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
        
        {/* Main Cryptocurrency List */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Cryptocurrency Prices</h2>
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
      </div>
    </Layout>
  );
};

export default Dashboard;
