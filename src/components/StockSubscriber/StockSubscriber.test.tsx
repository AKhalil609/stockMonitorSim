import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BehaviorSubject } from 'rxjs';
import { useISINValidation } from '../hooks/useISINValidation';
import { stockService, useStockService } from '../hooks/useStockService';
import StockSubscriber from './';

jest.mock('../hooks/useStockService', () => ({
  useStockService: jest.fn(),
  stockService: {
    subscribeToStock: jest.fn(),
    unsubscribeFromStocks: jest.fn()
  }
}));

jest.mock('../hooks/useISINValidation', () => ({
  useISINValidation: jest.fn().mockReturnValue({
    isValidISIN: false,
    errorMessage: '',
    validateISIN: jest.fn()
  })
}));

describe('StockSubscriber', () => {
  const stocksData$ = new BehaviorSubject([]);
  const subscriptions$ = new BehaviorSubject([]);
  const connectionStatus$ = new BehaviorSubject(true);

  beforeEach(() => {
    (useStockService as jest.Mock).mockReturnValue({
      stocksData: stocksData$.value,
      subscriptions: subscriptions$.value,
      connectionStatus: connectionStatus$.value
    });
  });

  it('should render initial state correctly', () => {
    render(<StockSubscriber />);

    expect(screen.getByLabelText('subscribe')).toBeDisabled();
    expect(screen.getByText('Connected to the server.')).toBeInTheDocument();
  });

  it('should enable subscribe button when ISIN is valid and connection is active', () => {
    (useISINValidation as jest.Mock).mockReturnValue({
      isValidISIN: true,
      errorMessage: '',
      validateISIN: jest.fn()
    });

    render(<StockSubscriber />);

    fireEvent.change(screen.getByPlaceholderText('Enter ISIN'), { target: { value: 'validISIN' } });

    expect(screen.getByLabelText('subscribe')).toBeEnabled();
  });

  it('should display error message when connection is lost', async () => {
    (useStockService as jest.Mock).mockReturnValue({
        stocksData: [],
        subscriptions: [],
        connectionStatus: false,
      });
    render(<StockSubscriber />);

    await waitFor(() => {
        expect(screen.getByText('Connection lost. Prices may not be accurate.')).toBeInTheDocument();
      });
  });

  it('should call subscribeToStock when subscribe button is clicked', () => {
    (useISINValidation as jest.Mock).mockReturnValue({
      isValidISIN: true,
      errorMessage: '',
      validateISIN: jest.fn()
    });

    render(<StockSubscriber />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'validISIN' } });
    fireEvent.click(screen.getByLabelText('subscribe'));

    expect(stockService.subscribeToStock).toHaveBeenCalledWith('VALIDISIN');
  });

  it('should call unsubscribeFromStocks when unsubscribe button is clicked', async () => {
    (useStockService as jest.Mock).mockReturnValue({
        stocksData: [],
        subscriptions: ['DE000BASF111'],
        connectionStatus: true,
      });
    render(<StockSubscriber />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'DE000BASF111' } });
    fireEvent.click(screen.getByLabelText('unsubscribe'));
    await waitFor(() => {
        expect(stockService.unsubscribeFromStocks).toHaveBeenCalledWith(['DE000BASF111']);

    })
  });

  it('should call unsubscribeFromStocks for selected rows', () => {
    const stocksData = [
      { isin: 'DE000BASF111', price: 100, bid: 99, ask: 101 },
      { isin: 'DE000BASF112', price: 200, bid: 199, ask: 201 }
    ];
    (useStockService as jest.Mock).mockReturnValue({
        stocksData: stocksData,
        subscriptions: ['DE000BASF111', 'DE000BASF112'],
        connectionStatus: true,
      });

    render(<StockSubscriber />);

    fireEvent.click(screen.getByLabelText('DE000BASF111-checkbox'));
    fireEvent.click(screen.getByLabelText('unsubscribe from selected'));

    expect(stockService.unsubscribeFromStocks).toHaveBeenCalledWith(['DE000BASF111']);
  });

  afterEach(() => {
    stocksData$.next([]);
    subscriptions$.next([]);
    connectionStatus$.next(true);
  });
});
