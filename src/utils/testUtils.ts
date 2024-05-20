import { BehaviorSubject } from 'rxjs';
import { jest } from '@jest/globals';

export const stocksData$ = new BehaviorSubject([]);
export const subscriptions$ = new BehaviorSubject([]);
export const connectionStatus$ = new BehaviorSubject(true);

export const commonSetup = () => {
  afterEach(() => {
    jest.clearAllMocks();
    stocksData$.next([]);
    subscriptions$.next([]);
    connectionStatus$.next(false);
  });
};
