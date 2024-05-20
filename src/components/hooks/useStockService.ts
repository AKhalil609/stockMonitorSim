import { useState, useEffect } from 'react';
import { StockData, StockService } from '../../services/StockService';

export const stockService = new StockService();

/**
 * Custom hook for managing stock data subscriptions and connection status.
 *
 * @returns {Object} An object containing:
 * - `stocksData`: An array of stock data.
 * - `subscriptions`: An array of subscribed ISINs.
 * - `connectionStatus`: A boolean indicating the WebSocket connection status.
 */
export const useStockService = () => {
  const [stocksData, setStocksData] = useState<StockData[]>([]);
  const [subscriptions, setSubscriptions] = useState<string[]>([]);
  const [connectionStatus, setConnectionStatus] = useState(false);

  useEffect(() => {
    const stocksDataSub = stockService.getStocksData().subscribe(setStocksData);
    const subs = stockService.getSubscriptions().subscribe(setSubscriptions);
    const connStatus = stockService
      .getConnectionStatus()
      .subscribe(setConnectionStatus);

    return () => {
      stocksDataSub.unsubscribe();
      subs.unsubscribe();
      connStatus.unsubscribe();
    };
  }, []);

  return { stocksData, subscriptions, connectionStatus };
};
