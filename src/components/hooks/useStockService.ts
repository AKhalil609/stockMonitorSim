import { useState, useEffect } from 'react';
import { StockData, StockService } from '../../services/StockService';

export const stockService = new StockService();

export const useStockService = () => {
  const [stocksData, setStocksData] = useState<StockData[]>([]);
  const [subscriptions, setSubscriptions] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState(false);

  useEffect(() => {
    const stocksDataSub = stockService.getStocksData().subscribe(setStocksData);
    const subs = stockService.getSubscriptions().subscribe(setSubscriptions);
    const connStatus = stockService.getConnectionStatus().subscribe(setConnectionStatus);

    return () => {
      stocksDataSub.unsubscribe();
      subs.unsubscribe();
      connStatus.unsubscribe();
    };
  }, []);

  return { stocksData, subscriptions, connectionStatus };
};