import { waitFor } from '@testing-library/react';
import { validateImmediately } from '../components/hooks/useISINValidation';
import { mockWebSocketSubject } from '../utils/mocks';
import { commonSetup } from '../utils/testUtils';
import { type StockData, StockService } from './StockService';

jest.mock('../components/hooks/useISINValidation', () => ({
  validateImmediately: jest.fn(),
}));

describe('StockService', () => {
  let stockService: StockService;

  beforeEach(() => {
    stockService = new StockService();
    jest.useFakeTimers();
  });

  commonSetup();

  afterEach(() => {
    jest.clearAllMocks();
    jest.useRealTimers();
  });

  it('should create an instance of StockService', () => {
    expect(stockService).toBeTruthy();
  });

  it('should subscribe to a stock and update subscriptions if ISIN is valid', () => {
    const isin = 'DE000BASF111';
    (validateImmediately as jest.Mock).mockReturnValue(true);
    stockService.subscribeToStock(isin);

    expect(mockWebSocketSubject.next).toHaveBeenCalledWith({ subscribe: isin });

    stockService.getSubscriptions().subscribe((subscriptions) => {
      expect(subscriptions).toContain(isin);
    });
  });

  it('should unsubscribe from stocks and update subscriptions', () => {
    const isins = ['DE000BASF111', 'US0987654321'];
    stockService.subscribeToStock(isins[0]);
    stockService.subscribeToStock(isins[1]);

    stockService.unsubscribeFromStocks(isins);

    isins.forEach((isin) => {
      expect(mockWebSocketSubject.next).toHaveBeenCalledWith({
        unsubscribe: isin,
      });
    });

    stockService.getSubscriptions().subscribe((subscriptions) => {
      expect(subscriptions).not.toContain(isins[0]);
      expect(subscriptions).not.toContain(isins[1]);
    });
  });

  it('should handle incoming stock messages correctly', () => {
    const stockData: StockData[] = [
      {
        isin: 'DE000BASF111',
        price: 100,
        bid: 99,
        ask: 101,
      },
    ];

    stockService['handleBatchMessages'](stockData);

    stockService.getStocksData().subscribe((data) => {
      expect(data).toEqual([
        {
          isin: 'DE000BASF111',
          price: 100.0,
          bid: 99.0,
          ask: 101.0,
        },
      ]);
    });
  });

  it('should handle WebSocket close and attempt to reconnect', async () => {
    const reconnectSpy = jest.spyOn(
      stockService as unknown as { connectToWebSocket: () => void },
      'connectToWebSocket'
    );
    stockService['handleSocketClose']();

    stockService.getConnectionStatus().subscribe((status) => {
      expect(status).toBe(false);
    });

    jest.advanceTimersByTime(5000);

    await waitFor(() => {
      expect(reconnectSpy).toHaveBeenCalled();
    });
  });

  it('should handle WebSocket open and resubscribe to all stocks', () => {
    const isins = ['DE000BASF111', 'US0987654321'];
    (validateImmediately as jest.Mock).mockReturnValue(true);
    stockService.subscribeToStock(isins[0]);
    stockService.subscribeToStock(isins[1]);

    stockService['handleSocketOpen']();

    stockService.getConnectionStatus().subscribe((status) => {
      expect(status).toBe(true);
    });

    isins.forEach((isin) => {
      expect(mockWebSocketSubject.next).toHaveBeenCalledWith({
        subscribe: isin,
      });
    });
  });

  it('should audit stock data at a specific interval', (done) => {
    const stockData1: StockData[] = [
      {
        isin: 'DE000BASF111',
        price: 100,
        bid: 99,
        ask: 101,
      },
    ];
    const stockData2: StockData[] = [
      {
        isin: 'US0987654321',
        price: 200,
        bid: 199,
        ask: 201,
      },
    ];

    stockService['handleBatchMessages'](stockData1);
    stockService['handleBatchMessages'](stockData2);

    stockService.getStocksData().subscribe((data) => {
      expect(data).toEqual([
        { isin: 'DE000BASF111', price: 100.0, bid: 99.0, ask: 101.0 },
        { isin: 'US0987654321', price: 200.0, bid: 199.0, ask: 201.0 },
      ]);
      done();
    });
  });
});
