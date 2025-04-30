
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  NewsArticle, 
  SentimentAnalysis,
  fetchCryptoNews, 
  fetchCoinNews, 
  analyzeSentiment
} from '@/services/api';

export function useNewsData(query = 'cryptocurrency', pageSize = 20) {
  const { 
    data: news, 
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['cryptoNews', query, pageSize],
    queryFn: () => fetchCryptoNews(query, pageSize),
    refetchInterval: 600000, // Refetch every 10 minutes
  });

  return {
    news: news || [],
    isLoading,
    error,
    refetch
  };
}

export function useCoinNews(coinName: string, coinId: string, pageSize = 10) {
  const { 
    data: news,
    isLoading: isLoadingNews,
    error: newsError,
  } = useQuery({
    queryKey: ['coinNews', coinName, pageSize],
    queryFn: () => fetchCoinNews(coinName, pageSize),
    refetchInterval: 600000, // Refetch every 10 minutes
    enabled: !!coinName,
  });

  const { 
    data: sentimentData,
    isLoading: isLoadingSentiment,
    error: sentimentError,
  } = useQuery({
    queryKey: ['sentiment', coinId, coinName],
    queryFn: () => news && news.length > 0 ? analyzeSentiment(coinName, news) : null,
    enabled: !!news && news.length > 0,
  });

  const isLoading = isLoadingNews || isLoadingSentiment;
  const error = newsError || sentimentError;

  // Process news articles with sentiment
  const [newsWithSentiment, setNewsWithSentiment] = useState<NewsArticle[]>([]);

  useEffect(() => {
    if (news && sentimentData) {
      // Apply overall sentiment to individual news articles based on content similarity
      const processedNews = news.map(article => {
        // Simple sentiment assignment based on overall trend
        // In a production app, you would analyze each article individually
        return {
          ...article,
          sentiment: sentimentData.sentiment,
          sentimentScore: sentimentData.score
        };
      });
      
      setNewsWithSentiment(processedNews);
    } else if (news) {
      setNewsWithSentiment(news);
    }
  }, [news, sentimentData]);

  return {
    news: newsWithSentiment,
    sentiment: sentimentData,
    isLoading,
    error,
  };
}
