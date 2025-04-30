
import { toast } from "sonner";
import { COINGECKO_BASE_URL } from "./config";
import { Coin, CoinDetail, ChartData, TrendingCoin } from "./types";

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
    
    return await response.json();
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
    console.error(`Error fetching coin details for ${id}:`, error);
    toast.error(`Failed to fetch details for ${id}`);
    return null;
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
    console.error(`Error fetching chart data for ${id}:`, error);
    toast.error(`Failed to fetch chart data for ${id}`);
    return null;
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
    console.error('Error fetching trending coins:', error);
    toast.error('Failed to fetch trending cryptocurrencies');
    return null;
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
