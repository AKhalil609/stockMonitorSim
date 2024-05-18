import { type StockData, StockService } from './StockService';

const mockWebSocketSubject = {
  next: jest.fn(),
  subscribe: jest.fn()
};

jest.mock('rxjs/webSocket', () => ({
  WebSocketSubject: jest.fn(() => mockWebSocketSubject)
}));

describe('StockService', () => {
  let stockService: StockService;

  beforeEach(() => {
    stockService = new StockService();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create an instance of StockService', () => {
    expect(stockService).toBeTruthy();
  });

  it('should subscribe to a stock and update subscriptions', () => {
    const isin = 'US1234567890';
    stockService.subscribeToStock(isin);

    // Check that the WebSocket next method was called with the correct subscription message
    expect(mockWebSocketSubject.next).toHaveBeenCalledWith({ subscribe: isin });

    // Check that the subscription list has been updated
    stockService.getSubscriptions().subscribe(subscriptions => {
      expect(subscriptions).toContain(isin);
    });
  });

  it('should unsubscribe from stocks and update subscriptions', () => {
    const isins = ['US1234567890', 'US0987654321'];
    stockService.subscribeToStock(isins[0]);
    stockService.subscribeToStock(isins[1]);

    stockService.unsubscribeFromStocks(isins);

    isins.forEach(isin => {
      expect(mockWebSocketSubject.next).toHaveBeenCalledWith({ unsubscribe: isin });
    });

    stockService.getSubscriptions().subscribe(subscriptions => {
      expect(subscriptions).not.toContain(isins[0]);
      expect(subscriptions).not.toContain(isins[1]);
    });
  });

  it('should handle incoming stock messages correctly', () => {
    const stockData: StockData = {
      isin: 'US1234567890',
      price: 100,
      bid: 99,
      ask: 101
    };
    
    stockService['handleMessage'](stockData);

    stockService.getStocksData().subscribe(data => {
      expect(data).toEqual([{
        isin: 'US1234567890',
        price: 100.0000,
        bid: 99.0000,
        ask: 101.0000
      }]);
    });
  });

  it('should handle WebSocket close and attempt to reconnect', () => {
    stockService['handleSocketClose']();

    stockService.getConnectionStatus().subscribe(status => {
      expect(status).toBe(false);
    });

    // Simulate the reconnection attempt
    jest.advanceTimersByTime(5000);

    expect(mockWebSocketSubject.subscribe).toHaveBeenCalled();
  });

  it('should handle WebSocket open and resubscribe to all stocks', () => {
    const isins = ['US1234567890', 'US0987654321'];
    stockService.subscribeToStock(isins[0]);
    stockService.subscribeToStock(isins[1]);

    stockService['handleSocketOpen']();

    stockService.getConnectionStatus().subscribe(status => {
      expect(status).toBe(true);
    });

    isins.forEach(isin => {
      expect(mockWebSocketSubject.next).toHaveBeenCalledWith({ subscribe: isin });
    });
  });

  it('should audit stock data at a specific interval', (done) => {
    const stockData1: StockData = {
      isin: 'US1234567890',
      price: 100,
      bid: 99,
      ask: 101
    };
    const stockData2: StockData = {
      isin: 'US0987654321',
      price: 200,
      bid: 199,
      ask: 201
    };

    stockService['handleMessage'](stockData1);
    stockService['handleMessage'](stockData2);

    stockService.getStocksData().subscribe(data => {
      expect(data).toEqual([
        { isin: 'US1234567890', price: 100.0000, bid: 99.0000, ask: 101.0000 },
        { isin: 'US0987654321', price: 200.0000, bid: 199.0000, ask: 201.0000 }
      ]);
      done();
    });
  });
});
