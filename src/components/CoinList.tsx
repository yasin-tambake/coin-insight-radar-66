
import { useState } from 'react';
import CoinCard from './CoinCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coin } from '@/services/api';
import { Search, Filter } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';

interface CoinListProps {
  coins: Coin[];
  isLoading: boolean;
  currency: string;
  favorites: string[];
  onToggleFavorite: (coinId: string) => void;
  onSearch: (term: string) => void;
  onSort: (key: keyof Coin) => void;
  sortConfig: {
    key: keyof Coin | '';
    direction: 'asc' | 'desc';
  };
}

const CoinList: React.FC<CoinListProps> = ({
  coins,
  isLoading,
  currency,
  favorites,
  onToggleFavorite,
  onSearch,
  onSort,
  sortConfig,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const handleSearch = () => {
    onSearch(searchTerm);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const filteredCoins = activeTab === 'favorites' 
    ? coins.filter(coin => favorites.includes(coin.id))
    : coins;

  const sortOptions = [
    { value: 'market_cap_rank', label: 'Market Cap Rank' },
    { value: 'price_change_percentage_24h', label: '24h Change' },
    { value: 'price_change_percentage_7d_in_currency', label: '7d Change' },
    { value: 'market_cap', label: 'Market Cap' },
    { value: 'total_volume', label: 'Volume' },
  ];

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="relative w-full md:w-96">
          <Input
            placeholder="Search by name or symbol..."
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

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Select
            value={sortConfig.key as string || 'market_cap_rank'}
            onValueChange={(value) => onSort(value as keyof Coin)}
          >
            <SelectTrigger className="w-full md:w-[180px] bg-crypto-dark border-gray-700">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Sort by" />
              </div>
            </SelectTrigger>
            <SelectContent className="bg-crypto-dark border-gray-700">
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon"
            className="bg-crypto-dark border-gray-700"
            onClick={() => onSort(sortConfig.key as keyof Coin)}
          >
            {sortConfig.direction === 'asc' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 8 4-4 4 4"/>
                <path d="M7 4v16"/>
                <path d="M11 12h4"/>
                <path d="M11 16h7"/>
                <path d="M11 20h10"/>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 16 4 4 4-4"/>
                <path d="M7 20V4"/>
                <path d="M11 4h10"/>
                <path d="M11 8h7"/>
                <path d="M11 12h4"/>
              </svg>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-crypto-dark">
          <TabsTrigger value="all" className="data-[state=active]:bg-gray-800">
            All Cryptocurrencies
          </TabsTrigger>
          <TabsTrigger value="favorites" className="data-[state=active]:bg-gray-800">
            Watchlist
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-crypto-dark border border-gray-800 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center space-x-3">
                      <Skeleton className="h-8 w-8 rounded-full bg-gray-800" />
                      <div>
                        <Skeleton className="h-4 w-24 bg-gray-800" />
                        <Skeleton className="h-3 w-10 bg-gray-800 mt-1" />
                      </div>
                    </div>
                    <Skeleton className="h-8 w-8 rounded-full bg-gray-800" />
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-6 w-20 bg-gray-800" />
                      <Skeleton className="h-4 w-16 bg-gray-800" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-3">
                      <Skeleton className="h-14 bg-gray-800 rounded" />
                      <Skeleton className="h-14 bg-gray-800 rounded" />
                    </div>
                    
                    <Skeleton className="h-16 w-full bg-gray-800 mt-3 rounded" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            activeTab === 'favorites' && filteredCoins.length === 0 ? (
              <div className="text-center py-16 bg-crypto-dark border border-gray-800 rounded-lg">
                <div className="text-6xl mb-4">⭐</div>
                <h3 className="text-xl font-medium mb-2">Your watchlist is empty</h3>
                <p className="text-gray-400 mb-6">Add cryptocurrencies to your watchlist to track them easily</p>
                <Button variant="outline" onClick={() => setActiveTab('all')}>
                  Browse Cryptocurrencies
                </Button>
              </div>
            ) : (
              filteredCoins.length === 0 ? (
                <div className="text-center py-16 bg-crypto-dark border border-gray-800 rounded-lg">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-medium mb-2">No results found</h3>
                  <p className="text-gray-400 mb-6">Try adjusting your search or filter criteria</p>
                  <Button variant="outline" onClick={() => onSearch('')}>
                    Reset Search
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredCoins.map((coin) => (
                    <CoinCard
                      key={coin.id}
                      coin={coin}
                      currency={currency}
                      isFavorite={favorites.includes(coin.id)}
                      onToggleFavorite={onToggleFavorite}
                    />
                  ))}
                </div>
              )
            )
          )}
        </div>
      </Tabs>
    </div>
  );
};

export default CoinList;
