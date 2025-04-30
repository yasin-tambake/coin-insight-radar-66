
// Type definitions
export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  roi: {
    times: number;
    currency: string;
    percentage: number;
  } | null;
  last_updated: string;
  price_change_percentage_7d_in_currency?: number;
  price_change_percentage_30d_in_currency?: number;
  sparkline_in_7d?: {
    price: number[];
  };
}

export interface CoinDetail extends Coin {
  description?: { en: string };
  links?: {
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
    subreddit_url: string;
    repos_url: { github: string[] };
  };
  market_data?: {
    current_price: { [key: string]: number };
    ath: { [key: string]: number };
    atl: { [key: string]: number };
    market_cap: { [key: string]: number };
    total_volume: { [key: string]: number };
    high_24h: { [key: string]: number };
    low_24h: { [key: string]: number };
  };
  tickers?: Array<{
    base: string;
    target: string;
    last: number;
    volume: number;
    market: { name: string; identifier: string };
  }>;
  community_data?: {
    facebook_likes: number;
    twitter_followers: number;
    reddit_average_posts_48h: number;
    reddit_average_comments_48h: number;
    reddit_subscribers: number;
    reddit_accounts_active_48h: number;
  };
  developer_data?: {
    forks: number;
    stars: number;
    subscribers: number;
    total_issues: number;
    closed_issues: number;
    pull_requests_merged: number;
    pull_request_contributors: number;
    code_additions_deletions_4_weeks: {
      additions: number;
      deletions: number;
    };
    commit_count_4_weeks: number;
  };
}

export interface ChartData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export interface NewsArticle {
  source?: { id: string | null; name: string };
  author?: string;
  title: string;
  description?: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  content?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  sentimentScore?: number;
}

export interface SentimentAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number;
  trend: 'bullish' | 'bearish' | 'stable' | 'volatile';
  summary: string;
}

export interface TrendingCoin {
  id: string;
  name: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
  small: string;
  large: string;
  slug: string;
  price_btc: number;
  score: number;
}

// API Endpoints
const COINGECKO_API = 'https://api.coingecko.com/api/v3';
const MOCK_NEWS_API = 'https://mock-news-api.lovable.dev'; // Made-up URL for demonstration
const MOCK_AI_API = 'https://mock-ai-api.lovable.dev'; // Made-up URL for demonstration

// Utility Functions
export const formatCurrency = (value: number | undefined | null, currency = 'usd', decimals = 2): string => {
  if (value === undefined || value === null) return 'N/A';
  
  const currencySymbol = 
    currency === 'usd' ? '$' :
    currency === 'eur' ? '€' :
    currency === 'gbp' ? '£' :
    currency === 'jpy' ? '¥' :
    currency === 'inr' ? '₹' :
    currency.toUpperCase() + ' ';
  
  // Format the number with the specified number of decimals and add commas for thousands
  return `${currencySymbol}${value.toLocaleString(undefined, { 
    minimumFractionDigits: decimals, 
    maximumFractionDigits: decimals 
  })}`;
};

export const formatPercentage = (value: number | undefined | null): string => {
  if (value === undefined || value === null) return 'N/A';
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};

// API Functions
export const fetchCoins = async (
  currency = 'usd',
  perPage = 100,
  page = 1,
  sparkline = true,
  priceChangePercentage = '7d,30d'
): Promise<Coin[]> => {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=${sparkline}&price_change_percentage=${priceChangePercentage}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch coins: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching cryptocurrency data:', error);
    throw error;
  }
};

export const fetchCoinDetail = async (coinId: string, currency = 'usd'): Promise<CoinDetail> => {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/${coinId}?localization=false&tickers=true&market_data=true&community_data=true&developer_data=true&sparkline=true`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch coin detail: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching details for ${coinId}:`, error);
    throw error;
  }
};

export const fetchCoinChart = async (
  coinId: string,
  days = 7,
  currency = 'usd'
): Promise<ChartData> => {
  try {
    const response = await fetch(
      `${COINGECKO_API}/coins/${coinId}/market_chart?vs_currency=${currency}&days=${days}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch chart data: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching chart data for ${coinId}:`, error);
    throw error;
  }
};

export const fetchTrendingCoins = async (): Promise<{ coins: { item: TrendingCoin }[] }> => {
  try {
    const response = await fetch(`${COINGECKO_API}/search/trending`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch trending coins: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching trending cryptocurrencies:', error);
    throw error;
  }
};

export const fetchSupportedCurrencies = async (): Promise<{ id: string; name: string; symbol: string }[]> => {
  try {
    const response = await fetch(`${COINGECKO_API}/simple/supported_vs_currencies`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch supported currencies: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching supported currencies:', error);
    throw error;
  }
};

// News and Sentiment Analysis Mock Functions
export const fetchCryptoNews = async (query = 'cryptocurrency', pageSize = 20): Promise<NewsArticle[]> => {
  // In a real app, you would call a real news API
  // For this demo, return mock data
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock news data
    return Array(pageSize).fill(null).map((_, idx) => ({
      source: { id: null, name: 'CryptoNews' },
      author: 'Author Name',
      title: `Latest ${query} news article #${idx + 1}`,
      description: `This is a description for the latest ${query} news and market trends. It contains important information about recent developments.`,
      url: 'https://example.com/news',
      urlToImage: `https://placehold.co/600x400/1f2937/ffffff?text=${query.replace(' ', '+')}+News`,
      publishedAt: new Date().toISOString(),
      content: `Full content of the ${query} news article...`,
    }));
  } catch (error) {
    console.error(`Error fetching news for ${query}:`, error);
    throw new Error(`Failed to fetch news for ${query}`);
  }
};

export const fetchCoinNews = async (coinName: string, pageSize = 10): Promise<NewsArticle[]> => {
  // In a real app, you would call a real news API with the coin name
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Mock coin-specific news
    return Array(pageSize).fill(null).map((_, idx) => ({
      source: { id: null, name: idx % 3 === 0 ? 'CoinDesk' : idx % 3 === 1 ? 'CryptoSlate' : 'The Block' },
      author: `Reporter ${idx + 1}`,
      title: `${coinName} ${idx % 2 === 0 ? 'surges' : 'sees volatility'} as ${idx % 3 === 0 ? 'adoption increases' : 'market fluctuates'}`,
      description: `${coinName} has been in the spotlight recently due to ${idx % 2 === 0 ? 'positive developments in the ecosystem' : 'market volatility affecting investor sentiment'}.`,
      url: 'https://example.com/news',
      urlToImage: `https://placehold.co/600x400/1f2937/ffffff?text=${coinName.replace(' ', '+')}+News`,
      publishedAt: new Date(Date.now() - idx * 3600000).toISOString(),
      content: `Full content about ${coinName} and its recent developments...`,
    }));
  } catch (error) {
    console.error(`Error fetching news for ${coinName}:`, error);
    throw new Error(`Failed to fetch news for ${coinName}`);
  }
};

export const analyzeSentiment = async (
  coinName: string, 
  news: NewsArticle[]
): Promise<SentimentAnalysis> => {
  // In a real app, you would call a real AI API to analyze sentiment
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Mock sentiment data - could be made dynamic based on the coinName and date
    // This would be the entry point for real AI integration in the future
    const mockSentiments = [
      {
        sentiment: 'positive',
        score: 75,
        trend: 'bullish',
        summary: `Recent news suggests a positive outlook for ${coinName}, with increasing adoption and favorable market conditions. The overall sentiment appears bullish in the short to medium term.`
      },
      {
        sentiment: 'negative',
        score: 30,
        trend: 'bearish',
        summary: `News coverage indicates some concerns regarding ${coinName}, with market uncertainty and potential regulatory challenges. The sentiment leans bearish in the short term.`
      },
      {
        sentiment: 'neutral',
        score: 50,
        trend: 'stable',
        summary: `Analysis of recent news shows mixed signals for ${coinName}. While there are some positive developments, challenges remain. The market appears to be in a consolidation phase.`
      }
    ];
    
    // Randomly select a sentiment or base it on the current date to get consistent results
    const date = new Date();
    const sentimentIndex = (date.getDate() + coinName.length) % mockSentiments.length;
    
    return mockSentiments[sentimentIndex] as SentimentAnalysis;
  } catch (error) {
    console.error(`Error analyzing sentiment for ${coinName}:`, error);
    throw error;
  }
};

export const generateMarketCommentary = async (
  coinDetail: CoinDetail, 
  sentiment: SentimentAnalysis
): Promise<string> => {
  // In a real app, you would call a real AI API to generate commentary
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate mock commentary based on coin price and sentiment
    const priceChange = coinDetail.price_change_percentage_24h || 0;
    const isPriceUp = priceChange >= 0;
    
    const commentaries = [
      `${coinDetail.name} is currently showing ${sentiment.sentiment} signals based on recent news analysis. With a ${priceChange.toFixed(2)}% ${isPriceUp ? 'increase' : 'decrease'} in the last 24 hours, traders should ${sentiment.trend === 'bullish' ? 'consider this an opportunity for potential entry positions' : sentiment.trend === 'bearish' ? 'exercise caution and implement risk management' : 'monitor the price action for clearer signals'}.`,
      
      `Market sentiment for ${coinDetail.name} appears to be ${sentiment.sentiment}, with a sentiment score of ${sentiment.score}/100. Technical indicators and news sentiment suggest a ${sentiment.trend} trend in the near term. ${isPriceUp ? 'The recent price increase might continue if support holds.' : 'The recent dip could present a buying opportunity if key support levels hold.'}.`,
      
      `${coinDetail.name}'s current market position shows ${isPriceUp ? 'strength' : 'weakness'} with ${Math.abs(priceChange).toFixed(2)}% price ${isPriceUp ? 'gain' : 'loss'} in 24 hours. The ${sentiment.sentiment} sentiment aligns with the overall market's ${sentiment.trend} outlook. Traders may want to ${sentiment.score > 60 ? 'look for potential continuation patterns' : sentiment.score < 40 ? 'wait for a potential reversal or stabilization' : 'watch for a breakout from the current consolidation pattern'}.`
    ];
    
    // Select a commentary based on the current minute to get a bit of variety
    const commentaryIndex = new Date().getMinutes() % commentaries.length;
    return commentaries[commentaryIndex];
  } catch (error) {
    console.error(`Error generating commentary for ${coinDetail.name}:`, error);
    throw error;
  }
};
