
import { useState } from 'react';
import Layout from '@/components/Layout';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useCryptoList, useCurrencies } from '@/hooks/useCrypto';
import { usePriceAlerts, PriceAlert } from '@/hooks/useAlerts';
import { formatCurrency } from '@/services/api';
import { Bell, AlertTriangle, Check, Trash2, Plus } from 'lucide-react';

const Alerts = () => {
  const { selectedCurrency, getCurrencySymbol } = useCurrencies();
  const { coins, isLoading } = useCryptoList(selectedCurrency);
  const { 
    alerts, 
    addAlert, 
    removeAlert,
    clearTriggeredAlerts
  } = usePriceAlerts();
  
  const [isCreating, setIsCreating] = useState(false);
  const [selectedCoinId, setSelectedCoinId] = useState('');
  const [alertCondition, setAlertCondition] = useState<'above' | 'below'>('above');
  const [targetPrice, setTargetPrice] = useState('');
  
  const activeAlerts = alerts.filter(alert => !alert.triggered);
  const triggeredAlerts = alerts.filter(alert => alert.triggered);
  
  // New alert form submission
  const handleSubmit = () => {
    if (!selectedCoinId || !targetPrice) return;
    
    const selectedCoin = coins.find(coin => coin.id === selectedCoinId);
    if (!selectedCoin) return;
    
    addAlert({
      coinId: selectedCoin.id,
      coinName: selectedCoin.name,
      coinSymbol: selectedCoin.symbol,
      targetPrice: parseFloat(targetPrice),
      condition: alertCondition,
      currency: selectedCurrency
    });
    
    // Reset form
    setSelectedCoinId('');
    setTargetPrice('');
    setAlertCondition('above');
    setIsCreating(false);
  };
  
  const renderAlertCard = (alert: PriceAlert, isTriggered = false) => {
    const selectedCoin = coins.find(coin => coin.id === alert.coinId);
    const currentPrice = selectedCoin?.current_price;
    
    return (
      <Card key={alert.id} className={`bg-crypto-dark border-gray-800 ${isTriggered ? 'border-green-500/30' : ''}`}>
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium text-lg flex items-center gap-2">
                {isTriggered && <Check className="text-green-500 h-5 w-5" />}
                {alert.coinName} ({alert.coinSymbol.toUpperCase()})
              </h3>
              
              <div className="mt-2 text-sm">
                <span className="text-gray-400">Alert when price is </span>
                <span className={`font-medium ${alert.condition === 'above' ? 'text-crypto-up' : 'text-crypto-down'}`}>
                  {alert.condition === 'above' ? 'above' : 'below'}
                </span>
                <span className="text-gray-400"> </span>
                <span className="font-medium">{formatCurrency(alert.targetPrice, alert.currency)}</span>
              </div>
              
              {currentPrice && (
                <div className="mt-1 text-xs text-gray-400">
                  Current price: {formatCurrency(currentPrice, selectedCurrency)}
                  {!isTriggered && (
                    <span className={`ml-2 ${
                      alert.condition === 'above' 
                        ? (currentPrice < alert.targetPrice ? 'text-yellow-500' : 'text-green-500')
                        : (currentPrice > alert.targetPrice ? 'text-yellow-500' : 'text-green-500')
                    }`}>
                      ({alert.condition === 'above' 
                        ? (currentPrice < alert.targetPrice ? `${(((alert.targetPrice - currentPrice) / currentPrice) * 100).toFixed(2)}% away` : 'Target reached')
                        : (currentPrice > alert.targetPrice ? `${(((currentPrice - alert.targetPrice) / currentPrice) * 100).toFixed(2)}% away` : 'Target reached')
                      })
                    </span>
                  )}
                </div>
              )}
              
              {isTriggered && (
                <div className="mt-2 text-xs text-green-400">
                  Triggered: {new Date(alert.createdAt).toLocaleString()}
                </div>
              )}
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeAlert(alert.id)}
              className="text-gray-400 hover:text-white hover:bg-gray-700"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };
  
  return (
    <Layout>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Price Alerts</h1>
          <p className="text-gray-400 mt-2">
            Set alerts for price movements and get notified when conditions are met
          </p>
        </div>
        
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="mr-2 h-4 w-4" />
              Create New Alert
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-crypto-dark border-gray-800">
            <DialogHeader>
              <DialogTitle>Create Price Alert</DialogTitle>
              <DialogDescription>
                Get notified when a cryptocurrency reaches your target price
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="coin">Cryptocurrency</Label>
                <Select
                  value={selectedCoinId}
                  onValueChange={setSelectedCoinId}
                >
                  <SelectTrigger id="coin" className="bg-gray-800 border-gray-700">
                    <SelectValue placeholder="Select a cryptocurrency" />
                  </SelectTrigger>
                  <SelectContent className="bg-crypto-dark border-gray-700">
                    {coins.slice(0, 100).map((coin) => (
                      <SelectItem key={coin.id} value={coin.id}>
                        {coin.name} ({coin.symbol.toUpperCase()})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="condition">Condition</Label>
                <Select
                  value={alertCondition}
                  onValueChange={(value) => setAlertCondition(value as 'above' | 'below')}
                >
                  <SelectTrigger id="condition" className="bg-gray-800 border-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-crypto-dark border-gray-700">
                    <SelectItem value="above">Price goes above</SelectItem>
                    <SelectItem value="below">Price goes below</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="price">Target Price ({getCurrencySymbol(selectedCurrency)})</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.000001"
                  value={targetPrice}
                  onChange={(e) => setTargetPrice(e.target.value)}
                  placeholder="Enter target price"
                  className="bg-gray-800 border-gray-700"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
              <Button onClick={handleSubmit}>Create Alert</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Tabs defaultValue="active">
        <TabsList className="w-full grid grid-cols-2 mb-6">
          <TabsTrigger value="active">
            Active Alerts ({activeAlerts.length})
          </TabsTrigger>
          <TabsTrigger value="history">
            Alert History ({triggeredAlerts.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="active">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="bg-crypto-dark border-gray-800">
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-5 w-40 bg-gray-800 rounded mb-3"></div>
                      <div className="h-4 w-60 bg-gray-800 rounded mb-2"></div>
                      <div className="h-3 w-36 bg-gray-800 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : activeAlerts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeAlerts.map(alert => renderAlertCard(alert))}
            </div>
          ) : (
            <Card className="bg-crypto-dark border-gray-800 border-dashed">
              <CardContent className="p-12 flex flex-col items-center justify-center text-center">
                <div className="rounded-full bg-gray-800 p-3 mb-4">
                  <Bell className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium mb-2">No active alerts</h3>
                <p className="text-gray-400 mb-6">
                  You don't have any active price alerts. Create one to get notified when price conditions are met.
                </p>
                <Button onClick={() => setIsCreating(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Alert
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="history">
          {triggeredAlerts.length > 0 ? (
            <>
              <div className="flex justify-end mb-4">
                <Button variant="outline" onClick={clearTriggeredAlerts} size="sm">
                  Clear History
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {triggeredAlerts.map(alert => renderAlertCard(alert, true))}
              </div>
            </>
          ) : (
            <Card className="bg-crypto-dark border-gray-800 border-dashed">
              <CardContent className="p-12 flex flex-col items-center justify-center text-center">
                <div className="rounded-full bg-gray-800 p-3 mb-4">
                  <AlertTriangle className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium mb-2">No alert history</h3>
                <p className="text-gray-400">
                  Your triggered alerts will appear here.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Alerts;
