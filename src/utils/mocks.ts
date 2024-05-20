import { jest } from '@jest/globals';
import { useStockService } from '../components/hooks/useStockService';
import { useISINValidation } from '../components/hooks/useISINValidation';
import { StockData } from '../services/StockService';
import { of } from 'rxjs';

export const mockWebSocketSubject = {
  next: jest.fn(),
  subscribe: jest.fn(),
  pipe: jest.fn(() => of()),
};

jest.mock('rxjs/webSocket', () => ({
  WebSocketSubject: jest.fn(() => mockWebSocketSubject),
}));

jest.mock('../components/hooks/useStockService', () => ({
  useStockService: jest.fn(),
  stockService: {
    subscribeToStock: jest.fn(),
    unsubscribeFromStocks: jest.fn(),
  },
}));

jest.mock('../components/hooks/useISINValidation', () => ({
  useISINValidation: jest.fn().mockReturnValue({
    isValidISIN: false,
    errorMessage: '',
    validateISIN: jest.fn(),
  }),
  validateImmediately: jest.fn(),
}));

export const mockUseStockService = (
  stocksData: StockData[],
  subscriptions: string[],
  connectionStatus: boolean
) => {
  (useStockService as jest.Mock).mockReturnValue({
    stocksData,
    subscriptions,
    connectionStatus,
  });
};

export const mockUseISINValidation = (
  isValidISIN: boolean,
  errorMessage: string
) => {
  (useISINValidation as jest.Mock).mockReturnValue({
    isValidISIN,
    errorMessage,
    validateISIN: jest.fn(),
  });
};

export const stockService = {
  subscribeToStock: jest.fn(),
  unsubscribeFromStocks: jest.fn(),
};
