
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useCurrencies } from '@/hooks/useCrypto';
import { usePriceAlerts } from '@/hooks/useAlerts';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, User, Bell } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { popularCurrencies, selectedCurrency, setSelectedCurrency, getCurrencySymbol } = useCurrencies();
  const { getActiveAlerts } = usePriceAlerts();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const activeAlerts = getActiveAlerts();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'News', path: '/news' },
    { name: 'Watchlist', path: '/watchlist' },
  ];

  return (
    <nav className="bg-crypto-dark border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 text-transparent bg-clip-text">
                CoinInsightRadar
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex space-x-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    isActive(link.path)
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {/* Currency selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="bg-gray-800 border-gray-700">
                  {getCurrencySymbol(selectedCurrency)} {selectedCurrency.toUpperCase()}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-gray-800 border-gray-700">
                {popularCurrencies.map((currency) => (
                  <DropdownMenuItem
                    key={currency.code}
                    className={`${selectedCurrency === currency.code ? 'bg-gray-700' : ''} hover:bg-gray-700`}
                    onClick={() => setSelectedCurrency(currency.code)}
                  >
                    {currency.symbol} {currency.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Search */}
            <Link to="/search" className="p-2 rounded-full hover:bg-gray-700">
              <Search className="h-5 w-5 text-gray-300" />
            </Link>

            {/* Alerts */}
            <Link to="/alerts" className="p-2 rounded-full hover:bg-gray-700 relative">
              <Bell className="h-5 w-5 text-gray-300" />
              {activeAlerts.length > 0 && (
                <Badge className="absolute -top-1 -right-1 px-1 min-w-[18px] h-[18px] text-[10px] flex items-center justify-center bg-blue-500 border-crypto-dark">
                  {activeAlerts.length}
                </Badge>
              )}
            </Link>

            {/* User menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-gray-800 border-gray-700">
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <Link to="/profile" className="w-full">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-700">
                    <Link to="/settings" className="w-full">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="hover:bg-gray-700" onClick={() => logout()}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-crypto-dark border-t border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(link.path)
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            
            <Link
              to="/alerts"
              className={`flex justify-between items-center px-3 py-2 rounded-md text-base font-medium ${
                isActive('/alerts')
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <span>Alerts</span>
              {activeAlerts.length > 0 && (
                <Badge className="px-1 min-w-[18px] h-[18px] text-[10px] flex items-center justify-center bg-blue-500">
                  {activeAlerts.length}
                </Badge>
              )}
            </Link>

            <div className="border-t border-gray-700 pt-4 pb-3">
              <div className="flex items-center justify-between px-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="bg-gray-800 border-gray-700">
                      {getCurrencySymbol(selectedCurrency)} {selectedCurrency.toUpperCase()}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-56 bg-gray-800 border-gray-700">
                    {popularCurrencies.map((currency) => (
                      <DropdownMenuItem
                        key={currency.code}
                        className={`${selectedCurrency === currency.code ? 'bg-gray-700' : ''} hover:bg-gray-700`}
                        onClick={() => setSelectedCurrency(currency.code)}
                      >
                        {currency.symbol} {currency.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {user ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    className="bg-red-600 hover:bg-red-700"
                    onClick={() => logout()}
                  >
                    Logout
                  </Button>
                ) : (
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      Sign In
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
