
import Layout from '@/components/Layout';
import CoinList from '@/components/CoinList';
import { useCryptoList, useCurrencies } from '@/hooks/useCrypto';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Coin } from '@/services/api/types';

const Watchlist = () => {
  const {
    coins,
    isLoading,
    searchTerm,
    setSearchTerm,
    sortConfig,
    sortByColumn,
    favorites,
    toggleFavorite,
    getFavoriteCoins
  } = useCryptoList();
  
  const { selectedCurrency } = useCurrencies();
  
  const favoriteCoins = getFavoriteCoins();

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Your Watchlist</h1>
            <p className="text-gray-400">
              Track and monitor your favorite cryptocurrencies
            </p>
          </div>
          
          <Link to="/">
            <Button variant="outline">
              Browse All Cryptocurrencies
            </Button>
          </Link>
        </div>
        
        <div>
          <CoinList 
            coins={favoriteCoins}
            isLoading={isLoading}
            currency={selectedCurrency}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onSearch={setSearchTerm}
            onSort={(key) => sortByColumn(key as keyof Coin)}
            sortConfig={sortConfig}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Watchlist;
