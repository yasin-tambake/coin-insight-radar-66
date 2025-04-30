
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Coin } from '@/services/api';

export interface PriceAlert {
  id: string;
  coinId: string;
  coinName: string;
  coinSymbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
  currency: string;
  createdAt: string;
  triggered?: boolean;
}

export function usePriceAlerts() {
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);

  // Load alerts from localStorage
  useEffect(() => {
    const savedAlerts = localStorage.getItem('cryptoPriceAlerts');
    if (savedAlerts) {
      setAlerts(JSON.parse(savedAlerts));
    }
  }, []);

  // Save alerts to localStorage
  useEffect(() => {
    localStorage.setItem('cryptoPriceAlerts', JSON.stringify(alerts));
  }, [alerts]);

  // Add new alert
  const addAlert = (alert: Omit<PriceAlert, 'id' | 'createdAt'>) => {
    const newAlert: PriceAlert = {
      ...alert,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      triggered: false
    };
    
    setAlerts(prev => [...prev, newAlert]);
    
    toast.success('Price alert created', {
      description: `You'll be notified when ${alert.coinSymbol.toUpperCase()} goes ${alert.condition} ${alert.currency === 'usd' ? '$' : ''}${alert.targetPrice}`,
    });
    
    return newAlert;
  };

  // Remove alert
  const removeAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
    toast.success('Price alert removed');
  };

  // Check alerts against current prices
  const checkAlerts = (coins: Coin[]) => {
    if (alerts.length === 0 || !coins || coins.length === 0) return;
    
    const updatedAlerts = [...alerts];
    let hasTriggeredAlerts = false;
    
    for (const alert of updatedAlerts) {
      // Skip already triggered alerts
      if (alert.triggered) continue;
      
      // Find matching coin
      const coin = coins.find(c => c.id === alert.coinId);
      if (!coin) continue;
      
      // Check if alert condition is met
      const currentPrice = coin.current_price;
      const isTriggered = alert.condition === 'above'
        ? currentPrice >= alert.targetPrice
        : currentPrice <= alert.targetPrice;
      
      if (isTriggered) {
        // Mark as triggered
        alert.triggered = true;
        hasTriggeredAlerts = true;
        
        // Show notification
        toast.info(`Price Alert: ${alert.coinName}`, {
          description: `${alert.coinSymbol.toUpperCase()} is now ${alert.condition} ${alert.currency === 'usd' ? '$' : ''}${alert.targetPrice}`,
          duration: 8000,
        });
      }
    }
    
    if (hasTriggeredAlerts) {
      setAlerts(updatedAlerts);
    }
  };
  
  // Get active (non-triggered) alerts
  const getActiveAlerts = () => {
    return alerts.filter(alert => !alert.triggered);
  };

  // Clear triggered alerts
  const clearTriggeredAlerts = () => {
    setAlerts(prev => prev.filter(alert => !alert.triggered));
  };

  return {
    alerts,
    addAlert,
    removeAlert,
    checkAlerts,
    getActiveAlerts,
    clearTriggeredAlerts
  };
}
