import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Coin, formatCurrency, formatPercentage } from '@/services/api';
import { TrendingUp, TrendingDown, Star } from 'lucide-react';

interface CoinCardProps {
  coin: Coin;
  currency: string;
  isFavorite: boolean;
  onToggleFavorite: (coinId: string) => void;
}

const CoinCard: React.FC<CoinCardProps> = ({ 
  coin, 
  currency, 
  isFavorite, 
  onToggleFavorite 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [previousPrice, setPreviousPrice] = useState(coin.current_price);

  useEffect(() => {
    // When price changes, trigger animation
    if (previousPrice !== coin.current_price) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 1000);
      setPreviousPrice(coin.current_price);
      return () => clearTimeout(timer);
    }
  }, [coin.current_price, previousPrice]);

  const priceChangeClass = coin.price_change_percentage_24h != null && 
    coin.price_change_percentage_24h >= 0 
    ? 'price-up' 
    : 'price-down';

  const priceChange7dClass = coin.price_change_percentage_7d_in_currency != null
    ? coin.price_change_percentage_7d_in_currency >= 0 ? 'price-up' : 'price-down'
    : 'price-neutral';

  return (
    <Card className="bg-crypto-dark border-gray-800 hover:border-gray-700 transition-all">
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-3">
            <img src={coin.image} alt={coin.name} className="h-8 w-8 rounded-full" />
            <div>
              <Link to={`/coin/${coin.id}`} className="font-medium hover:text-blue-400 transition-colors">
                {coin.name}
              </Link>
              <div className="text-xs text-gray-400 uppercase">{coin.symbol}</div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full ${isFavorite ? 'text-yellow-400' : 'text-gray-400'}`}
            onClick={() => onToggleFavorite(coin.id)}
          >
            <Star className={`h-5 w-5 ${isFavorite ? 'fill-yellow-400' : ''}`} />
          </Button>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between items-baseline">
            <div
              className={`text-lg font-bold ${
                isAnimating 
                  ? `animate-pulse-price ${
                      coin.current_price > previousPrice ? 'text-crypto-up' : 
                      coin.current_price < previousPrice ? 'text-crypto-down' : ''
                    }`
                  : ''
              }`}
            >
              {formatCurrency(coin.current_price, currency)}
            </div>
            <div className={`flex items-center ${priceChangeClass}`}>
              {coin.price_change_percentage_24h != null && coin.price_change_percentage_24h >= 0 ? (
                <TrendingUp className="h-3.5 w-3.5 mr-1" />
              ) : (
                <TrendingDown className="h-3.5 w-3.5 mr-1" />
              )}
              <span className="text-sm font-medium">
                {formatPercentage(coin.price_change_percentage_24h)}
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
            <div className="bg-gray-800 p-2 rounded">
              <div className="text-gray-400">Market Cap</div>
              <div className="font-medium truncate">
                {formatCurrency(coin.market_cap, currency, 0)}
              </div>
            </div>
            <div className="bg-gray-800 p-2 rounded">
              <div className="text-gray-400">Volume (24h)</div>
              <div className="font-medium truncate">
                {formatCurrency(coin.total_volume, currency, 0)}
              </div>
            </div>
          </div>
          
          {coin.sparkline_in_7d && coin.sparkline_in_7d.price.length > 0 && (
            <div className="mt-3 h-16 relative">
              {/* Simple sparkline visualization */}
              <div className="absolute inset-0 flex items-end">
                {coin.sparkline_in_7d.price.map((price, i) => {
                  const max = Math.max(...coin.sparkline_in_7d!.price);
                  const min = Math.min(...coin.sparkline_in_7d!.price);
                  const range = max - min;
                  const height = range === 0 
                    ? 50 
                    : ((price - min) / range) * 100;
                  
                  return (
                    <div
                      key={i}
                      style={{
                        height: `${height}%`,
                        width: `${100 / coin.sparkline_in_7d!.price.length}%`
                      }}
                      className={`${priceChange7dClass === 'price-up' ? 'bg-crypto-up' : 'bg-crypto-down'} opacity-20 mx-px`}
                    />
                  );
                })}
              </div>
              
              <div className="absolute bottom-0 left-0 text-xs text-gray-400">
                7d: 
                <span className={priceChange7dClass}>
                  {coin.price_change_percentage_7d_in_currency
                    ? formatPercentage(coin.price_change_percentage_7d_in_currency)
                    : 'N/A'}
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CoinCard;
