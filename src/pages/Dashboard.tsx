
import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import CoinList from '@/components/CoinList';
import { useCryptoList, useCurrencies, useTrendingCoins } from '@/hooks/useCrypto';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { keyof } from '@/lib/utils';

const Dashboard = () => {
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
  } = useCryptoList();
  
  const {
    selectedCurrency,
    setSelectedCurrency,
    currencies,
  } = useCurrencies();
  
  const {
    trendingCoins,
    isLoading: isTrendingLoading
  } = useTrendingCoins();

  if (error) {
    console.error('Error loading cryptocurrency data:', error);
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Cryptocurrency Dashboard</h1>
          <p className="text-gray-400">
            Real-time cryptocurrency prices, market data, and insights.
          </p>
        </div>
        
        {/* Market Overview */}
        <Card className="bg-crypto-dark border-gray-800">
          <CardHeader>
            <CardTitle>Market Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {isLoading ? (
                <>
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="h-24 bg-gray-800 rounded-md" />
                  ))}
                </>
              ) : (
                <>
                  <div className="bg-gray-800 p-4 rounded-md">
                    <div className="text-sm text-gray-400 mb-1">Total Cryptocurrencies</div>
                    <div className="text-2xl font-bold">{coins?.length || "N/A"}</div>
                  </div>
                  
                  <div className="bg-gray-800 p-4 rounded-md">
                    <div className="text-sm text-gray-400 mb-1">Total Market Cap</div>
                    <div className="text-2xl font-bold">
                      {coins ? `$${(coins.reduce((sum, coin) => sum + coin.market_cap, 0) / 1e12).toFixed(2)}T` : "N/A"}
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 p-4 rounded-md">
                    <div className="text-sm text-gray-400 mb-1">24h Volume</div>
                    <div className="text-2xl font-bold">
                      {coins ? `$${(coins.reduce((sum, coin) => sum + coin.total_volume, 0) / 1e9).toFixed(2)}B` : "N/A"}
                    </div>
                  </div>
                  
                  <div className="bg-gray-800 p-4 rounded-md">
                    <div className="text-sm text-gray-400 mb-1">Your Watchlist</div>
                    <div className="text-2xl font-bold">
                      {favorites?.length || 0} Coins
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Trending Coins */}
        <Card className="bg-crypto-dark border-gray-800">
          <CardHeader>
            <CardTitle>Trending Cryptocurrencies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-gray-800">
                    <th className="px-4 py-3 font-medium text-gray-400">Coin</th>
                    <th className="px-4 py-3 font-medium text-gray-400">Price</th>
                    <th className="px-4 py-3 font-medium text-gray-400">Market Cap Rank</th>
                    <th className="px-4 py-3 font-medium text-gray-400">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {isTrendingLoading ? (
                    Array(5).fill(0).map((_, i) => (
                      <tr key={i} className="border-b border-gray-800">
                        <td className="px-4 py-3">
                          <Skeleton className="h-6 w-40 bg-gray-800" />
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton className="h-6 w-24 bg-gray-800" />
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton className="h-6 w-20 bg-gray-800" />
                        </td>
                        <td className="px-4 py-3">
                          <Skeleton className="h-6 w-16 bg-gray-800" />
                        </td>
                      </tr>
                    ))
                  ) : trendingCoins && trendingCoins.length > 0 ? (
                    trendingCoins.slice(0, 5).map((coin, index) => (
                      <tr key={coin.id} className="border-b border-gray-800">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            {coin.thumb && (
                              <img 
                                src={coin.thumb} 
                                alt={coin.name} 
                                className="w-6 h-6 rounded-full mr-2"
                              />
                            )}
                            <div>
                              <div className="font-medium">{coin.name}</div>
                              <div className="text-xs text-gray-400">{coin.symbol}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          {coin.price_btc ? `₿${coin.price_btc.toFixed(8)}` : 'N/A'}
                        </td>
                        <td className="px-4 py-3">
                          {coin.market_cap_rank ? `#${coin.market_cap_rank}` : 'N/A'}
                        </td>
                        <td className="px-4 py-3">
                          <div className="inline-flex items-center px-2 py-1 rounded bg-gray-700 text-xs">
                            {index + 1}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-3 text-center text-gray-400">
                        No trending coins available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
        
        {/* Cryptocurrency List */}
        <div>
          <h2 className="text-xl font-bold mb-4">All Cryptocurrencies</h2>
          <CoinList 
            coins={coins || []}
            isLoading={isLoading}
            currency={selectedCurrency}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onSearch={setSearchTerm}
            onSort={(key) => sortByColumn(key)}
            sortConfig={sortConfig}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
