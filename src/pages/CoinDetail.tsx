
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useCoinDetail, useCryptoList, useCurrencies } from '@/hooks/useCrypto';
import { useCoinNews } from '@/hooks/useNews';
import { generateMarketCommentary, formatCurrency, formatPercentage } from '@/services/api';
import Chart from '@/components/Chart';
import NewsCard from '@/components/NewsCard';
import CurrencyConverter from '@/components/CurrencyConverter';
import SentimentAnalysis from '@/components/SentimentAnalysis';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, TrendingDown, ArrowLeft } from 'lucide-react';

const CoinDetail = () => {
  const { coinId } = useParams<{ coinId: string }>();
  const { selectedCurrency, popularCurrencies } = useCurrencies();
  
  const {
    coinDetail,
    chartData,
    isLoading: isLoadingCoin,
    error: coinError,
  } = useCoinDetail(coinId || '', selectedCurrency);
  
  const { favorites, toggleFavorite } = useCryptoList();
  const isFavorite = coinId ? favorites.includes(coinId) : false;
  
  const {
    news,
    sentiment,
    isLoading: isLoadingNews,
    error: newsError,
  } = useCoinNews(coinDetail?.name || '', coinId || '');

  const [marketCommentary, setMarketCommentary] = useState('');
  const [isGeneratingCommentary, setIsGeneratingCommentary] = useState(false);

  useEffect(() => {
    const fetchMarketCommentary = async () => {
      if (coinDetail && sentiment) {
        setIsGeneratingCommentary(true);
        try {
          const commentary = await generateMarketCommentary(coinDetail, sentiment);
          setMarketCommentary(commentary);
        } catch (error) {
          console.error('Error generating market commentary:', error);
        } finally {
          setIsGeneratingCommentary(false);
        }
      }
    };
    
    fetchMarketCommentary();
  }, [coinDetail, sentiment]);

  if (coinError) {
    console.error('Error loading coin details:', coinError);
    return (
      <Layout>
        <div className="text-center py-16">
          <h2 className="text-xl font-bold mb-4">Error loading cryptocurrency data</h2>
          <p className="text-gray-400 mb-6">We couldn't load the data for this cryptocurrency.</p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const priceChangeClass = coinDetail?.price_change_percentage_24h_in_currency >= 0 
    ? 'price-up' 
    : 'price-down';

  return (
    <Layout>
      {/* Back Button */}
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link to="/" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
      
      {isLoadingCoin ? (
        <div className="space-y-8">
          {/* Coin Header - Loading */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full bg-gray-800" />
              <div>
                <Skeleton className="h-8 w-60 bg-gray-800 mb-1" />
                <Skeleton className="h-4 w-24 bg-gray-800" />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-8 w-24 bg-gray-800" />
              <Skeleton className="h-8 w-24 bg-gray-800" />
            </div>
          </div>
          
          {/* Price Info - Loading */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <Skeleton className="h-96 w-full bg-gray-800 rounded-lg" />
            </div>
            <div>
              <Skeleton className="h-96 w-full bg-gray-800 rounded-lg" />
            </div>
          </div>
          
          {/* Additional Info - Loading */}
          <div>
            <Skeleton className="h-10 w-full bg-gray-800 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-64 bg-gray-800 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      ) : (
        coinDetail && (
          <div className="space-y-8">
            {/* Coin Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-3">
                <img 
                  src={coinDetail.image} 
                  alt={coinDetail.name} 
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
                    {coinDetail.name}
                    <span className="text-lg text-gray-400">
                      {coinDetail.symbol.toUpperCase()}
                    </span>
                    <Badge variant="outline">Rank #{coinDetail.market_cap_rank}</Badge>
                  </h1>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {coinDetail.links.homepage[0] && (
                      <a
                        href={coinDetail.links.homepage[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300"
                      >
                        Official Website
                      </a>
                    )}
                    {coinDetail.links.blockchain_site[0] && (
                      <a
                        href={coinDetail.links.blockchain_site[0]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300"
                      >
                        Blockchain Explorer
                      </a>
                    )}
                    {coinDetail.links.subreddit_url && (
                      <a
                        href={coinDetail.links.subreddit_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300"
                      >
                        Reddit
                      </a>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={`${isFavorite ? 'bg-yellow-500/10 border-yellow-500/50' : ''} flex items-center gap-1`}
                  onClick={() => toggleFavorite(coinDetail.id)}
                >
                  <Star className={`h-4 w-4 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                  {isFavorite ? 'Watching' : 'Add to Watchlist'}
                </Button>
                
                <div className={`flex items-center gap-1 text-xl font-bold ${priceChangeClass}`}>
                  {coinDetail.price_change_percentage_24h >= 0 ? (
                    <TrendingUp className="h-5 w-5" />
                  ) : (
                    <TrendingDown className="h-5 w-5" />
                  )}
                  {formatPercentage(coinDetail.price_change_percentage_24h)}
                </div>
              </div>
            </div>
            
            {/* Price Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div className="bg-crypto-dark border border-gray-800 rounded-lg p-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                    <div>
                      <div className="text-gray-400">Current Price</div>
                      <div className="text-3xl font-bold">
                        {formatCurrency(coinDetail.current_price, selectedCurrency)}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-center w-full md:w-auto">
                      <div>
                        <div className="text-xs text-gray-400">24h Change</div>
                        <div className={`text-sm font-medium ${
                          coinDetail.price_change_percentage_24h >= 0 ? 'price-up' : 'price-down'
                        }`}>
                          {formatPercentage(coinDetail.price_change_percentage_24h)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">7d Change</div>
                        <div className={`text-sm font-medium ${
                          coinDetail.price_change_percentage_7d_in_currency
                            ? coinDetail.price_change_percentage_7d_in_currency >= 0
                              ? 'price-up'
                              : 'price-down'
                            : ''
                        }`}>
                          {coinDetail.price_change_percentage_7d_in_currency
                            ? formatPercentage(coinDetail.price_change_percentage_7d_in_currency)
                            : 'N/A'
                          }
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400">30d Change</div>
                        <div className={`text-sm font-medium ${
                          coinDetail.price_change_percentage_30d_in_currency
                            ? coinDetail.price_change_percentage_30d_in_currency >= 0
                              ? 'price-up'
                              : 'price-down'
                            : ''
                        }`}>
                          {coinDetail.price_change_percentage_30d_in_currency
                            ? formatPercentage(coinDetail.price_change_percentage_30d_in_currency)
                            : 'N/A'
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Chart
                    data={chartData}
                    isLoading={isLoadingCoin}
                    coinId={coinDetail.id}
                    coinName={coinDetail.name}
                    color={coinDetail.price_change_percentage_24h >= 0 ? '#16c784' : '#ea3943'}
                    currency={selectedCurrency}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-crypto-dark border border-gray-800 rounded-lg p-4">
                    <div className="text-sm text-gray-400">Market Cap</div>
                    <div className="text-lg font-bold">
                      {formatCurrency(coinDetail.market_cap, selectedCurrency, 0)}
                    </div>
                  </div>
                  
                  <div className="bg-crypto-dark border border-gray-800 rounded-lg p-4">
                    <div className="text-sm text-gray-400">Trading Volume (24h)</div>
                    <div className="text-lg font-bold">
                      {formatCurrency(coinDetail.total_volume, selectedCurrency, 0)}
                    </div>
                  </div>
                  
                  <div className="bg-crypto-dark border border-gray-800 rounded-lg p-4">
                    <div className="text-sm text-gray-400">Circulating Supply</div>
                    <div className="text-lg font-bold">
                      {coinDetail.circulating_supply.toLocaleString()} {coinDetail.symbol.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <Tabs defaultValue="sentiment">
                  <TabsList className="w-full grid grid-cols-2 bg-crypto-dark">
                    <TabsTrigger value="sentiment">Sentiment</TabsTrigger>
                    <TabsTrigger value="converter">Converter</TabsTrigger>
                  </TabsList>
                  
                  <div className="mt-4">
                    <TabsContent value="sentiment">
                      <SentimentAnalysis
                        sentiment={sentiment}
                        isLoading={isLoadingNews || isGeneratingCommentary}
                        marketCommentary={marketCommentary}
                      />
                    </TabsContent>
                    <TabsContent value="converter">
                      <CurrencyConverter
                        coinName={coinDetail.name}
                        coinSymbol={coinDetail.symbol}
                        currentPrice={coinDetail.current_price}
                        supportedCurrencies={popularCurrencies}
                      />
                    </TabsContent>
                  </div>
                </Tabs>
              </div>
            </div>
            
            {/* About */}
            <div className="bg-crypto-dark border border-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">About {coinDetail.name}</h2>
              {coinDetail.description.en ? (
                <div
                  dangerouslySetInnerHTML={{ __html: coinDetail.description.en }}
                  className="text-gray-300 space-y-4 prose prose-sm max-w-none prose-headings:text-white prose-a:text-blue-400"
                />
              ) : (
                <p className="text-gray-400">No description available.</p>
              )}
            </div>
            
            {/* News */}
            <div>
              <h2 className="text-xl font-bold mb-4">Latest {coinDetail.name} News</h2>
              {isLoadingNews ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
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
              ) : news && news.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {news.slice(0, 3).map((article) => (
                    <NewsCard key={article.url} article={article} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 bg-crypto-dark border border-gray-800 rounded-lg">
                  <p className="text-gray-400">No news available for {coinDetail.name}.</p>
                </div>
              )}
              
              {news && news.length > 3 && (
                <div className="mt-4 text-center">
                  <Link to={`/news?query=${coinDetail.name}`}>
                    <Button variant="outline">
                      View All {coinDetail.name} News
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )
      )}
    </Layout>
  );
};

export default CoinDetail;
