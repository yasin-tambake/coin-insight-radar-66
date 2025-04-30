import { useState, useEffect, useCallback, useRef } from 'react';
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
import { toast } from "sonner";

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
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Coin | '';
    direction: 'asc' | 'desc';
  }>({ key: 'market_cap_rank', direction: 'asc' });
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>([]);
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);
  const [currentPage, setCurrentPage] = useState(page);

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

  // Filter and sort coins with debounced search
  const debouncedSearch = useCallback((term: string) => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = setTimeout(() => {
      if (!coins) return;
      
      let filtered = [...coins];
      
      // Apply search filter
      if (term) {
        const search = term.toLowerCase();
        filtered = filtered.filter(
          coin => coin.name.toLowerCase().includes(search) || 
                 coin.symbol.toLowerCase().includes(search)
        );
      }
      
      // Apply sorting
      if (sortConfig.key) {
        filtered.sort((a, b) => {
          // Handle potential undefined values
          const valueA = a[sortConfig.key as keyof Coin];
          const valueB = b[sortConfig.key as keyof Coin];
          
          if (valueA === undefined && valueB === undefined) return 0;
          if (valueA === undefined) return sortConfig.direction === 'asc' ? -1 : 1;
          if (valueB === undefined) return sortConfig.direction === 'asc' ? 1 : -1;
          
          if (valueA < valueB) {
            return sortConfig.direction === 'asc' ? -1 : 1;
          }
          if (valueA > valueB) {
            return sortConfig.direction === 'asc' ? 1 : -1;
          }
          return 0;
        });
      }
      
      setFilteredCoins(filtered);
    }, 300); // 300ms debounce
  }, [coins, sortConfig]);

  // Update filtered coins when coins data, search term or sort config changes
  useEffect(() => {
    debouncedSearch(searchTerm);
    
    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [coins, searchTerm, sortConfig, debouncedSearch]);

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

  // Change page
  const changePage = useCallback((newPage: number) => {
    setCurrentPage(newPage);
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
    currentPage,
    changePage,
  };
}

export function useCoinDetail(coinId: string, currency = 'usd') {
  const [timeRange, setTimeRange] = useState<'1d' | '7d' | '30d' | '90d' | '1y'>('7d');
  
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
    refetch: refetchChart
  } = useQuery({
    queryKey: ['coinChart', coinId, currency, timeRange],
    queryFn: () => {
      let days = 7;
      switch(timeRange) {
        case '1d': days = 1; break;
        case '7d': days = 7; break;
        case '30d': days = 30; break;
        case '90d': days = 90; break;
        case '1y': days = 365; break;
      }
      return fetchCoinChart(coinId, days, currency);
    },
    enabled: !!coinId,
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  const isLoading = isLoadingDetail || isLoadingChart;
  const error = detailError || chartError;

  // Trigger chart data refetch when timeRange changes
  useEffect(() => {
    if (coinId) {
      refetchChart();
    }
  }, [timeRange, coinId, refetchChart]);

  return {
    coinDetail,
    chartData,
    isLoading,
    error,
    timeRange,
    setTimeRange
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
