
import React from 'react';
import Navbar from './Navbar';
import { Toaster } from 'sonner';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-crypto-darker text-white">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="bg-crypto-dark py-6 mt-10">
        <div className="container mx-auto px-4 text-center text-sm text-crypto-neutral">
          <p>© {new Date().getFullYear()} CoinInsightRadar. Powered by CoinGecko API, NewsAPI, and GroqAPI.</p>
          <p className="mt-2">Cryptocurrency data is provided for informational purposes only and should not be considered investment advice.</p>
        </div>
      </footer>
      <Toaster position="top-right" />
    </div>
  );
};

export default Layout;
