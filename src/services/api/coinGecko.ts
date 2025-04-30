
import { Coin } from './types';

// Define the top gainers/losers interface
export interface TopMovers {
  gainers: Coin[];
  losers: Coin[];
}

export const fetchTopGainersLosers = async (currency = 'usd'): Promise<TopMovers> => {
  try {
    // Fetch the top 100 coins
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch coins: ${response.statusText}`);
    }
    
    const data: Coin[] = await response.json();
    
    // Filter out coins with no price change data
    const coinsWithPriceChange = data.filter(
      coin => coin.price_change_percentage_24h !== null && coin.price_change_percentage_24h !== undefined
    );
    
    // Sort by price change percentage
    const sortedByPriceChange = [...coinsWithPriceChange].sort(
      (a, b) => (b.price_change_percentage_24h || 0) - (a.price_change_percentage_24h || 0)
    );
    
    // Get top 5 gainers (highest positive change)
    const gainers = sortedByPriceChange.filter(
      coin => (coin.price_change_percentage_24h || 0) > 0
    ).slice(0, 5);
    
    // Get top 5 losers (highest negative change)
    const losers = [...sortedByPriceChange]
      .filter(coin => (coin.price_change_percentage_24h || 0) < 0)
      .reverse()
      .slice(0, 5);
    
    return { gainers, losers };
    
  } catch (error) {
    console.error('Error fetching top gainers/losers:', error);
    return { gainers: [], losers: [] };
  }
};
