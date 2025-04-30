
import { toast } from "sonner";
import { COINGECKO_BASE_URL } from "./config";
import { Coin, CoinDetail, ChartData, TrendingCoin } from "./types";

// Default error handling wrapper
const handleApiError = (error: any, message: string) => {
  console.error(message, error);
  toast.error(message);
  return null;
};

// CoinGecko API functions
export const fetchCoins = async (
  currency = 'usd',
  perPage = 100,
  page = 1,
  sparkline = true,
  priceChangePercentage = '7d,30d'
): Promise<Coin[]> => {
  try {
    const response = await fetch(
      `${COINGECKO_BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=${sparkline}&price_change_percentage=${priceChangePercentage}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch coins');
    }
    
    const data = await response.json();
    
    // Process data to ensure no undefined or null values
    return data.map((coin: any) => ({
      ...coin,
      current_price: coin.current_price ?? 0,
      market_cap: coin.market_cap ?? 0,
      total_volume: coin.total_volume ?? 0,
      price_change_24h: coin.price_change_24h ?? 0,
      price_change_percentage_24h: coin.price_change_percentage_24h ?? 0,
      price_change_percentage_7d_in_currency: coin.price_change_percentage_7d_in_currency ?? 0,
      price_change_percentage_30d_in_currency: coin.price_change_percentage_30d_in_currency ?? 0,
    }));
  } catch (error) {
    console.error('Error fetching coins:', error);
    toast.error('Failed to fetch cryptocurrency data');
    return [];
  }
};

export const fetchCoinDetail = async (id: string, currency = 'usd'): Promise<CoinDetail | null> => {
  try {
    const response = await fetch(
      `${COINGECKO_BASE_URL}/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch details for ${id}`);
    }
    
    return await response.json();
  } catch (error) {
    return handleApiError(error, `Failed to fetch details for ${id}`);
  }
};

export const fetchCoinChart = async (
  id: string,
  days = 7,
  currency = 'usd'
): Promise<ChartData | null> => {
  try {
    const response = await fetch(
      `${COINGECKO_BASE_URL}/coins/${id}/market_chart?vs_currency=${currency}&days=${days}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch chart data for ${id}`);
    }
    
    return await response.json();
  } catch (error) {
    return handleApiError(error, `Failed to fetch chart data for ${id}`);
  }
};

export const fetchTrendingCoins = async (): Promise<{ coins: { item: TrendingCoin }[] } | null> => {
  try {
    const response = await fetch(`${COINGECKO_BASE_URL}/search/trending`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch trending coins');
    }
    
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'Failed to fetch trending cryptocurrencies');
  }
};

export const fetchSupportedCurrencies = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${COINGECKO_BASE_URL}/simple/supported_vs_currencies`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch supported currencies');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching supported currencies:', error);
    toast.error('Failed to fetch supported currencies');
    return ['usd', 'eur', 'gbp', 'jpy', 'krw', 'cny', 'aud', 'cad', 'inr'];
  }
};

// New functions for additional visualizations
export const fetchMarketGlobal = async (): Promise<any> => {
  try {
    const response = await fetch(`${COINGECKO_BASE_URL}/global`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch global market data');
    }
    
    return await response.json();
  } catch (error) {
    return handleApiError(error, 'Failed to fetch global market data');
  }
};

export const fetchTopGainersLosers = async (
  currency = 'usd',
  perPage = 250,
  sparkline = false,
): Promise<{gainers: Coin[], losers: Coin[]}> => {
  try {
    const response = await fetch(
      `${COINGECKO_BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=1&sparkline=${sparkline}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch top gainers/losers');
    }
    
    const data: Coin[] = await response.json();
    
    // Filter out coins without price change data
    const validCoins = data.filter(coin => 
      coin.price_change_percentage_24h !== undefined && 
      coin.price_change_percentage_24h !== null
    );
    
    // Sort by percentage change
    const sortedCoins = [...validCoins].sort((a, b) => 
      (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0)
    );
    
    return {
      gainers: sortedCoins.slice(0, 5),
      losers: sortedCoins.reverse().slice(0, 5)
    };
  } catch (error) {
    console.error('Error fetching top gainers/losers:', error);
    toast.error('Failed to fetch top gainers/losers data');
    return {gainers: [], losers: []};
  }
};
