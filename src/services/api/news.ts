
import { toast } from "sonner";
import { NEWS_API_BASE_URL, NEWS_API_KEY } from "./config";
import { NewsArticle } from "./types";

// News API functions
export const fetchCryptoNews = async (query = 'cryptocurrency', pageSize = 20): Promise<NewsArticle[]> => {
  try {
    console.log(`Fetching news for: ${query} (pageSize: ${pageSize})`);
    
    const response = await fetch(
      `${NEWS_API_BASE_URL}/everything?q=${query}&apiKey=${NEWS_API_KEY}&pageSize=${pageSize}&language=en&sortBy=publishedAt`
    );
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('News API error:', errorData);
      throw new Error(`Failed to fetch crypto news: ${errorData.message || response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`Received ${data.articles?.length || 0} news articles`);
    
    if (!data.articles || data.articles.length === 0) {
      console.log('No articles found in response');
      return [];
    }
    
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
    return data.articles || [];
  } catch (error) {
    console.error(`Error fetching news for ${coinName}:`, error);
    toast.error(`Failed to fetch news for ${coinName}`);
    return [];
  }
};
