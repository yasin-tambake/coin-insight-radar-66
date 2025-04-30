
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Layout from '@/components/Layout';
import NewsFeed from '@/components/NewsFeed';
import { useNewsData } from '@/hooks/useNews';

const News = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialQuery = queryParams.get('query') || 'cryptocurrency';
  
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const { 
    news,
    isLoading,
    error,
    refetch
  } = useNewsData(searchQuery);

  const handleSearch = (term: string) => {
    setSearchQuery(term || 'cryptocurrency');
  };

  // Refetch when searchQuery changes
  useEffect(() => {
    refetch();
  }, [searchQuery, refetch]);

  if (error) {
    console.error('Error loading news data:', error);
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Cryptocurrency News</h1>
          <p className="text-gray-400">
            Latest news and updates from the world of cryptocurrencies
          </p>
        </div>
        
        <NewsFeed
          news={news}
          isLoading={isLoading}
          onSearch={handleSearch}
        />
      </div>
    </Layout>
  );
};

export default News;
