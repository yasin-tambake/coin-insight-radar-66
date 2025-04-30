
import { SentimentAnalysis as SentimentData } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';

interface SentimentAnalysisProps {
  sentiment: SentimentData | null;
  isLoading: boolean;
  marketCommentary: string;
}

const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({
  sentiment,
  isLoading,
  marketCommentary,
}) => {
  if (isLoading) {
    return (
      <Card className="bg-crypto-dark border-gray-800">
        <CardHeader>
          <CardTitle>Market Sentiment</CardTitle>
          <CardDescription>AI-powered sentiment analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="animate-pulse">
              <div className="h-6 bg-gray-800 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-800 rounded"></div>
            </div>
            
            <div className="animate-pulse">
              <div className="h-4 bg-gray-800 rounded mb-1"></div>
              <div className="h-8 bg-gray-800 rounded"></div>
            </div>
            
            <div className="animate-pulse">
              <div className="h-4 bg-gray-800 rounded mb-1"></div>
              <div className="h-20 bg-gray-800 rounded"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!sentiment) {
    return (
      <Card className="bg-crypto-dark border-gray-800">
        <CardHeader>
          <CardTitle>Market Sentiment</CardTitle>
          <CardDescription>AI-powered sentiment analysis</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6">
          <p className="text-gray-400">
            Sentiment data is not available.
            <br />
            Please try again later.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getSentimentColor = () => {
    switch (sentiment.sentiment) {
      case 'positive':
        return 'bg-crypto-up';
      case 'negative':
        return 'bg-crypto-down';
      default:
        return 'bg-crypto-neutral';
    }
  };

  const getTrendBadge = () => {
    switch (sentiment.trend) {
      case 'bullish':
        return (
          <Badge variant="outline" className="bg-crypto-up text-white border-crypto-up flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            Bullish
          </Badge>
        );
      case 'bearish':
        return (
          <Badge variant="outline" className="bg-crypto-down text-white border-crypto-down flex items-center gap-1">
            <TrendingDown className="h-3 w-3" />
            Bearish
          </Badge>
        );
      case 'volatile':
        return (
          <Badge variant="outline" className="bg-yellow-500 text-white border-yellow-500 flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            Volatile
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="bg-crypto-neutral text-white border-crypto-neutral flex items-center gap-1">
            <ArrowRight className="h-3 w-3" />
            Stable
          </Badge>
        );
    }
  };

  return (
    <Card className="bg-crypto-dark border-gray-800">
      <CardHeader>
        <CardTitle>Market Sentiment</CardTitle>
        <CardDescription>AI-powered sentiment analysis</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-300">Sentiment Score</span>
              <span className="font-semibold">{sentiment.score}/100</span>
            </div>
            <div className="relative">
              <Progress value={sentiment.score} className="h-2 bg-gray-700" />
              <div 
                className={`absolute top-0 h-2 ${getSentimentColor()}`} 
                style={{ 
                  left: '50%', 
                  width: '2px',
                  transform: 'translateX(-50%)'
                }}
              />
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-400">
              <span>Bearish</span>
              <span>Neutral</span>
              <span>Bullish</span>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-4">
            <div className="flex justify-between mb-3">
              <span className="text-sm font-medium text-gray-300">Market Trend</span>
              {getTrendBadge()}
            </div>
            <p className="text-sm text-gray-300 leading-relaxed">
              {sentiment.summary}
            </p>
          </div>
          
          {marketCommentary && (
            <div className="border-t border-gray-800 pt-4">
              <div className="text-sm font-medium text-gray-300 mb-2">AI Market Commentary</div>
              <p className="text-sm text-gray-300 leading-relaxed italic">
                "{marketCommentary}"
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SentimentAnalysis;
