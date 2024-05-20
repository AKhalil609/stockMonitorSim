import { renderHook, act } from '@testing-library/react-hooks';
import { BehaviorSubject } from 'rxjs';
import { useStockService, stockService } from './useStockService';
import { StockData } from '../../services/StockService';

jest.mock('../../services/StockService', () => {
  return {
    StockService: jest.fn().mockImplementation(() => ({
      getStocksData: jest.fn(),
      getSubscriptions: jest.fn(),
      getConnectionStatus: jest.fn(),
    })),
  };
});

describe('useStockService', () => {
  const stocksData$ = new BehaviorSubject<StockData[]>([]);
  const subscriptions$ = new BehaviorSubject<string[]>([]);
  const connectionStatus$ = new BehaviorSubject<boolean>(false);

  beforeEach(() => {
    (stockService.getStocksData as jest.Mock).mockReturnValue(stocksData$);
    (stockService.getSubscriptions as jest.Mock).mockReturnValue(
      subscriptions$
    );
    (stockService.getConnectionStatus as jest.Mock).mockReturnValue(
      connectionStatus$
    );
  });

  it('should return initial values', () => {
    const { result } = renderHook(() => useStockService());

    expect(result.current.stocksData).toEqual([]);
    expect(result.current.subscriptions).toEqual([]);
    expect(result.current.connectionStatus).toBe(false);
  });

  it('should update stocksData when new data is emitted', () => {
    const { result } = renderHook(() => useStockService());

    act(() => {
      stocksData$.next([{ isin: '123456', price: 100, ask: 300, bid: 898 }]);
    });

    expect(result.current.stocksData).toEqual([
      { isin: '123456', price: 100, ask: 300, bid: 898 },
    ]);
  });

  it('should update subscriptions when new data is emitted', () => {
    const { result } = renderHook(() => useStockService());

    act(() => {
      subscriptions$.next(['123456']);
    });

    expect(result.current.subscriptions).toEqual(['123456']);
  });

  it('should update connectionStatus when new data is emitted', () => {
    const { result } = renderHook(() => useStockService());

    act(() => {
      connectionStatus$.next(true);
    });

    expect(result.current.connectionStatus).toBe(true);
  });

  afterEach(() => {
    stocksData$.next([]);
    subscriptions$.next([]);
    connectionStatus$.next(false);
  });
});
