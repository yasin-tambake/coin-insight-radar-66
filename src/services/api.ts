
import { toast } from "sonner";

// API base URLs
const COINGECKO_BASE_URL = 'https://api.coingecko.com/api/v3';
const NEWS_API_BASE_URL = 'https://newsapi.org/v2';
const GROQ_API_BASE_URL = 'https://api.groq.com/openai/v1/chat/completions';

// API keys
const NEWS_API_KEY = '9bad6dd23f704786b58e38046d7d1efc';
const GROQ_API_KEY = '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';

// Interfaces
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
  price_change_percentage_7d_in_currency?: number;
  price_change_percentage_30d_in_currency?: number;
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
  last_updated: string;
  sparkline_in_7d?: {
    price: number[];
  };
}

export interface CoinDetail extends Coin {
  description: {
    en: string;
  };
  links: {
    homepage: string[];
    blockchain_site: string[];
    official_forum_url: string[];
    chat_url: string[];
    announcement_url: string[];
    twitter_screen_name: string;
    facebook_username: string;
    telegram_channel_identifier: string;
    subreddit_url: string;
    repos_url: {
      github: string[];
      bitbucket: string[];
    };
  };
  market_data: {
    current_price: {
      [key: string]: number;
    };
    market_cap: {
      [key: string]: number;
    };
    total_volume: {
      [key: string]: number;
    };
  };
}

export interface ChartData {
  prices: [number, number][];
  market_caps: [number, number][];
  total_volumes: [number, number][];
}

export interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
  sentiment?: 'positive' | 'neutral' | 'negative';
  sentimentScore?: number;
}

export interface SentimentAnalysis {
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number;
  trend: 'bullish' | 'bearish' | 'volatile' | 'stable';
  summary: string;
}

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

export const fetchTrendingCoins = async (): Promise<{ coins: { item: Coin }[] } | null> => {
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

// News API functions
export const fetchCryptoNews = async (query = 'cryptocurrency', pageSize = 20): Promise<NewsArticle[]> => {
  try {
    const response = await fetch(
      `${NEWS_API_BASE_URL}/everything?q=${query}&apiKey=${NEWS_API_KEY}&pageSize=${pageSize}&language=en&sortBy=publishedAt`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch crypto news');
    }
    
    const data = await response.json();
    return data.articles;
  } catch (error) {
    console.error('Error fetching crypto news:', error);
    toast.error('Failed to fetch cryptocurrency news');
    return [];
  }
};

export const fetchCoinNews = async (coinName: string, pageSize = 10): Promise<NewsArticle[]> => {
  try {
    const response = await fetch(
      `${NEWS_API_BASE_URL}/everything?q=${coinName} cryptocurrency&apiKey=${NEWS_API_KEY}&pageSize=${pageSize}&language=en&sortBy=publishedAt`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch news for ${coinName}`);
    }
    
    const data = await response.json();
    return data.articles;
  } catch (error) {
    console.error(`Error fetching news for ${coinName}:`, error);
    toast.error(`Failed to fetch news for ${coinName}`);
    return [];
  }
};

// Groq API functions
export const analyzeSentiment = async (
  coinName: string,
  newsArticles: NewsArticle[]
): Promise<SentimentAnalysis | null> => {
  try {
    const headlines = newsArticles.slice(0, 5).map(article => article.title).join('\n');
    const descriptions = newsArticles.slice(0, 5)
      .filter(article => article.description)
      .map(article => article.description)
      .join('\n');
    
    const prompt = `
      Given the following news headlines and descriptions about the cryptocurrency ${coinName}:
      
      Headlines:
      ${headlines}
      
      Descriptions:
      ${descriptions}
      
      Analyze the market sentiment (positive, neutral, negative), and predict the short-term trend (bullish, bearish, volatile, or stable).
      Return a JSON with the following structure:
      {
        "sentiment": "positive/neutral/negative",
        "score": 0-100 (where 0 is extremely negative, 50 is neutral, and 100 is extremely positive),
        "trend": "bullish/bearish/volatile/stable",
        "summary": "A simple 1-2 sentence explanation of the sentiment and trend prediction"
      }
    `;
    
    const response = await fetch(GROQ_API_BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a cryptocurrency market analyst specialized in sentiment analysis. Provide concise, data-driven insights.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.2,
        max_tokens: 500,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to analyze sentiment');
    }
    
    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Extract JSON from the content
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Failed to parse sentiment analysis response');
  } catch (error) {
    console.error('Error analyzing sentiment:', error);
    toast.error('Failed to analyze market sentiment');
    return null;
  }
};

export const generateMarketCommentary = async (
  coin: CoinDetail | null,
  sentimentAnalysis: SentimentAnalysis | null
): Promise<string> => {
  if (!coin || !sentimentAnalysis) return '';
  
  try {
    const prompt = `
      Generate a short market commentary for ${coin.name} (${coin.symbol.toUpperCase()}).
      
      Current Data:
      - Current Price: $${coin.current_price}
      - 24h Change: ${coin.price_change_percentage_24h.toFixed(2)}%
      - Market Cap: $${(coin.market_cap / 1e9).toFixed(2)} billion
      - Trading Volume: $${(coin.total_volume / 1e6).toFixed(2)} million
      
      Sentiment Analysis:
      - Overall Sentiment: ${sentimentAnalysis.sentiment}
      - Trend: ${sentimentAnalysis.trend}
      
      Provide a concise 2-3 sentence analysis that explains the current price action and what investors might expect in the short term. Be informative but not overly technical.
    `;
    
    const response = await fetch(GROQ_API_BASE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: 'You are a cryptocurrency market commentator providing concise insights for investors.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 150,
      }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to generate market commentary');
    }
    
    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating market commentary:', error);
    toast.error('Failed to generate market commentary');
    return '';
  }
};

// Helper functions
export const formatCurrency = (
  value: number,
  currency = 'usd',
  maximumFractionDigits = 2
): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    maximumFractionDigits,
  });
  
  return formatter.format(value);
};

export const formatPercentage = (value: number): string => {
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};

export const formatCompactNumber = (value: number): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    notation: 'compact',
    compactDisplay: 'short',
  });
  
  return formatter.format(value);
};
