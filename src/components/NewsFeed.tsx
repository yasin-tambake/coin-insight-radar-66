
import { useState } from 'react';
import NewsCard from './NewsCard';
import { NewsArticle } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface NewsFeedProps {
  news: NewsArticle[];
  isLoading: boolean;
  onSearch: (term: string) => void;
}

const NewsFeed: React.FC<NewsFeedProps> = ({
  news,
  isLoading,
  onSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const filteredNews = filter === 'all'
    ? news
    : news.filter(article => article.sentiment === filter);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <Input
            placeholder="Search news..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            className="bg-crypto-dark border-gray-700 focus:border-blue-500 pr-10"
          />
          <Button 
            size="icon"
            variant="ghost" 
            className="absolute right-0 top-0 h-full"
            onClick={handleSearch}
          >
            <Search className="h-4 w-4" />
          </Button>
        </div>

        <Select
          value={filter}
          onValueChange={setFilter}
        >
          <SelectTrigger className="w-full md:w-[180px] bg-crypto-dark border-gray-700">
            <SelectValue placeholder="Filter by sentiment" />
          </SelectTrigger>
          <SelectContent className="bg-crypto-dark border-gray-700">
            <SelectItem value="all">All News</SelectItem>
            <SelectItem value="positive">Positive</SelectItem>
            <SelectItem value="neutral">Neutral</SelectItem>
            <SelectItem value="negative">Negative</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-crypto-dark border border-gray-800 rounded-lg overflow-hidden">
              <Skeleton className="h-40 bg-gray-800" />
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <Skeleton className="h-3 w-16 bg-gray-800" />
                  <Skeleton className="h-3 w-24 bg-gray-800" />
                </div>
                <Skeleton className="h-5 w-full bg-gray-800 mb-2" />
                <Skeleton className="h-5 w-3/4 bg-gray-800 mb-4" />
                <Skeleton className="h-4 w-full bg-gray-800 mb-2" />
                <Skeleton className="h-4 w-full bg-gray-800 mb-2" />
                <Skeleton className="h-4 w-2/3 bg-gray-800" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        filteredNews.length === 0 ? (
          <div className="text-center py-16 bg-crypto-dark border border-gray-800 rounded-lg">
            <div className="text-6xl mb-4">📰</div>
            <h3 className="text-xl font-medium mb-2">No news found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setFilter('all');
              onSearch('');
            }}>
              Reset Search
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((article) => (
              <NewsCard key={article.url} article={article} />
            ))}
          </div>
        )
      )}
    </div>
  );
};

export default NewsFeed;
