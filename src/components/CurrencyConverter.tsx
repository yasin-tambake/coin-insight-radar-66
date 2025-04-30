
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CurrencyConverterProps {
  coinName: string;
  coinSymbol: string;
  currentPrice: number;
  supportedCurrencies: {
    code: string;
    name: string;
    symbol: string;
  }[];
}

const CurrencyConverter: React.FC<CurrencyConverterProps> = ({
  coinName,
  coinSymbol,
  currentPrice,
  supportedCurrencies,
}) => {
  const [amount, setAmount] = useState('1');
  const [fromType, setFromType] = useState<'crypto' | 'fiat'>('crypto');
  const [toCurrency, setToCurrency] = useState('usd');
  const [result, setResult] = useState('');

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^[0-9]*\.?[0-9]*$/.test(value)) {
      setAmount(value);
    }
  };

  const toggleFromType = () => {
    setFromType(prev => prev === 'crypto' ? 'fiat' : 'crypto');
  };

  useEffect(() => {
    calculateConversion();
  }, [amount, fromType, toCurrency, currentPrice]);

  const calculateConversion = () => {
    if (!amount || isNaN(Number(amount))) {
      setResult('Enter a valid amount');
      return;
    }

    const numericAmount = parseFloat(amount);
    
    if (fromType === 'crypto') {
      const fiatValue = numericAmount * currentPrice;
      const currency = supportedCurrencies.find(c => c.code === toCurrency) || 
                     { code: 'usd', name: 'US Dollar', symbol: '$' };
                     
      setResult(`${numericAmount} ${coinSymbol.toUpperCase()} = ${currency.symbol}${fiatValue.toFixed(2)} ${currency.code.toUpperCase()}`);
    } else {
      const cryptoValue = numericAmount / currentPrice;
      const currency = supportedCurrencies.find(c => c.code === toCurrency) || 
                     { code: 'usd', name: 'US Dollar', symbol: '$' };
                     
      setResult(`${currency.symbol}${numericAmount} ${currency.code.toUpperCase()} = ${cryptoValue.toFixed(8)} ${coinSymbol.toUpperCase()}`);
    }
  };

  return (
    <Card className="bg-crypto-dark border-gray-800">
      <CardHeader>
        <CardTitle>Currency Converter</CardTitle>
        <CardDescription>
          Convert between {coinName} and fiat currencies
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <Input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Amount"
              className="col-span-2 bg-gray-800 border-gray-700"
            />
            <Button 
              variant="secondary" 
              onClick={toggleFromType}
              className="bg-gray-800 border-gray-700 hover:bg-gray-700"
            >
              {fromType === 'crypto' ? coinSymbol.toUpperCase() : toCurrency.toUpperCase()}
            </Button>
          </div>
          
          <div className="flex items-center justify-center py-2">
            <div className="bg-gray-800 p-2 rounded-full">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 10v4"/>
                <path d="M11 10v4"/>
                <path d="M2 18V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z"/>
                <path d="m15 10 2 2 2-2"/>
                <path d="M17 14v-4"/>
              </svg>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-3">
              <Select
                value={toCurrency}
                onValueChange={setToCurrency}
              >
                <SelectTrigger className="bg-gray-800 border-gray-700">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent className="bg-crypto-dark border-gray-700">
                  {supportedCurrencies.map((currency) => (
                    <SelectItem key={currency.code} value={currency.code}>
                      {currency.symbol} {currency.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch border-t border-gray-800 pt-4">
        <div className="text-center font-medium bg-gray-800 p-3 rounded-md">
          {result || 'Enter an amount to convert'}
        </div>
        <div className="text-xs text-gray-400 text-center mt-2">
          Exchange rate: 1 {coinSymbol.toUpperCase()} = {supportedCurrencies.find(c => c.code === 'usd')?.symbol}{currentPrice.toFixed(2)} USD
        </div>
      </CardFooter>
    </Card>
  );
};

export default CurrencyConverter;
