
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NewsArticle } from '@/services/api';
import { TrendingUp, TrendingDown, CircleCheck } from 'lucide-react';
import placeholderImage from '/placeholder.svg';

interface NewsCardProps {
  article: NewsArticle;
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const [imageError, setImageError] = useState(false);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Date(date).toLocaleString();
  };
  
  const getSentimentBadge = () => {
    if (!article.sentiment) return null;
    
    switch (article.sentiment) {
      case 'positive':
        return (
          <Badge variant="outline" className="bg-crypto-up text-white border-crypto-up flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Positive
          </Badge>
        );
      case 'negative':
        return (
          <Badge variant="outline" className="bg-crypto-down text-white border-crypto-down flex items-center gap-1">
            <TrendingDown className="h-3 w-3" />
            Negative
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-crypto-neutral text-white border-crypto-neutral flex items-center gap-1">
            <CircleCheck className="h-3 w-3" />
            Neutral
          </Badge>
        );
    }
  };
  
  return (
    <Card className="bg-crypto-dark border-gray-800 hover:border-gray-700 transition-all overflow-hidden">
      <div className="relative h-40 w-full overflow-hidden">
        <img
          src={!imageError && article.urlToImage ? article.urlToImage : placeholderImage}
          alt={article.title}
          className="object-cover w-full h-full"
          onError={() => setImageError(true)}
        />
        {article.sentiment && (
          <div className="absolute top-2 right-2">
            {getSentimentBadge()}
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
          <span>{article.source?.name || 'Unknown Source'}</span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>
        
        <h3 className="text-base font-semibold leading-tight mb-2 line-clamp-2">
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-blue-400 transition-colors"
          >
            {article.title}
          </a>
        </h3>
        
        <p className="text-sm text-gray-300 line-clamp-3 mb-3">
          {article.description || 'No description available'}
        </p>
        
        <a 
          href={article.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors inline-flex items-center mt-auto"
        >
          Read more
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="ml-1">
            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
