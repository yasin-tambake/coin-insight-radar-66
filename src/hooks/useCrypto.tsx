
import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Coin, 
  CoinDetail, 
  ChartData,
  TrendingCoin,
  fetchCoins, 
  fetchCoinDetail, 
  fetchCoinChart, 
  fetchTrendingCoins,
  fetchSupportedCurrencies
} from '@/services/api';

export function useCryptoList(
  currency = 'usd',
  perPage = 100,
  page = 1,
  sparkline = true,
  priceChangePercentage = '7d,30d'
) {
  const { 
    data: coins, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['cryptoList', currency, perPage, page],
    queryFn: () => fetchCoins(currency, perPage, page, sparkline, priceChangePercentage),
    refetchInterval: 60000, // Refetch every minute
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Coin | '';
    direction: 'asc' | 'desc';
  }>({ key: 'market_cap_rank', direction: 'asc' });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>([]);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('cryptoFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('cryptoFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Filter and sort coins
  useEffect(() => {
    if (!coins) return;

    let filtered = [...coins];

    // Apply search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        coin => coin.name.toLowerCase().includes(search) || 
               coin.symbol.toLowerCase().includes(search)
      );
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (a[sortConfig.key as keyof Coin] < b[sortConfig.key as keyof Coin]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key as keyof Coin] > b[sortConfig.key as keyof Coin]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredCoins(filtered);
  }, [coins, searchTerm, sortConfig]);

  // Toggle favorite
  const toggleFavorite = useCallback((coinId: string) => {
    setFavorites(prev => {
      if (prev.includes(coinId)) {
        return prev.filter(id => id !== coinId);
      } else {
        return [...prev, coinId];
      }
    });
  }, []);

  // Get favorite coins
  const getFavoriteCoins = useCallback(() => {
    if (!coins) return [];
    return coins.filter(coin => favorites.includes(coin.id));
  }, [coins, favorites]);

  // Sort by column
  const sortByColumn = useCallback((key: keyof Coin) => {
    setSortConfig(prevSortConfig => ({
      key,
      direction:
        prevSortConfig.key === key && prevSortConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    }));
  }, []);

  return {
    coins: filteredCoins,
    isLoading,
    error,
    refetch,
    searchTerm,
    setSearchTerm,
    sortConfig,
    sortByColumn,
    favorites,
    isFavorite: (coinId: string) => favorites.includes(coinId),
    toggleFavorite,
    getFavoriteCoins,
  };
}

export function useCoinDetail(coinId: string, currency = 'usd') {
  const {
    data: coinDetail,
    isLoading: isLoadingDetail,
    error: detailError,
  } = useQuery({
    queryKey: ['coinDetail', coinId, currency],
    queryFn: () => fetchCoinDetail(coinId, currency),
    enabled: !!coinId,
    refetchInterval: 60000, // Refetch every minute
  });

  const {
    data: chartData,
    isLoading: isLoadingChart,
    error: chartError,
  } = useQuery({
    queryKey: ['coinChart', coinId, currency],
    queryFn: () => fetchCoinChart(coinId, 7, currency),
    enabled: !!coinId,
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  const isLoading = isLoadingDetail || isLoadingChart;
  const error = detailError || chartError;

  return {
    coinDetail,
    chartData,
    isLoading,
    error,
  };
}

export function useTrendingCoins() {
  const { 
    data: trendingData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['trendingCoins'],
    queryFn: fetchTrendingCoins,
    refetchInterval: 3600000, // Refetch every hour
  });

  const trendingCoins = trendingData?.coins?.map(item => item.item) || [];

  return {
    trendingCoins,
    isLoading,
    error,
  };
}

export function useCurrencies() {
  const { 
    data: currencies,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['supportedCurrencies'],
    queryFn: fetchSupportedCurrencies,
  });

  const [selectedCurrency, setSelectedCurrency] = useState('usd');

  const popularCurrencies = [
    { code: 'usd', name: 'US Dollar', symbol: '$' },
    { code: 'eur', name: 'Euro', symbol: '€' },
    { code: 'gbp', name: 'British Pound', symbol: '£' },
    { code: 'jpy', name: 'Japanese Yen', symbol: '¥' },
    { code: 'inr', name: 'Indian Rupee', symbol: '₹' },
  ];

  const getCurrencySymbol = useCallback((code: string) => {
    const currency = popularCurrencies.find(c => c.code === code);
    return currency?.symbol || code.toUpperCase();
  }, []);

  return {
    currencies: currencies || [],
    popularCurrencies,
    isLoading,
    error,
    selectedCurrency,
    setSelectedCurrency,
    getCurrencySymbol,
  };
}
