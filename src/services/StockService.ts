import { BehaviorSubject, timer, Observable } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';
import { switchMap, catchError, bufferTime } from 'rxjs/operators';
import { validateImmediately } from '../components/hooks/useISINValidation';

export interface StockData {
  isin: string;
  price: number;
  bid: number;
  ask: number;
}

interface WebSocketMessage {
  subscribe?: string;
  unsubscribe?: string;
}

/**
 * Service for managing WebSocket connections and subscriptions to stock data.
 */

export class StockService {
  private socket$!: WebSocketSubject<StockData | WebSocketMessage>;
  private subscriptions = new BehaviorSubject<string[]>([]);
  private stocksData = new BehaviorSubject<StockData[]>([]);
  private connectionStatus = new BehaviorSubject<boolean>(false);
  private loading = new BehaviorSubject<boolean>(false);

  constructor() {
    this.connectToWebSocket();
  }

  /**
   * Establishes a WebSocket connection and sets up the observers for connection events.
   */

  private connectToWebSocket() {
    this.socket$ = new WebSocketSubject<StockData | WebSocketMessage>({
      url: 'ws://localhost:8425/',
      closeObserver: {
        next: () => this.handleSocketClose(),
      },
      openObserver: {
        next: () => this.handleSocketOpen(),
      },
    });

    this.socket$.pipe(bufferTime(1000)).subscribe({
      next: (messages: (StockData | WebSocketMessage)[]) =>
        this.handleBatchMessages(messages),
      error: (err: string) => console.error('WebSocket error:', err),
    });
  }

  /**
   * Handles the WebSocket close event.
   */

  private handleSocketClose() {
    this.connectionStatus.next(false);
    console.error('WebSocket disconnected. Attempting to reconnect...');
    this.reconnect();
  }

  /**
   * Handles the WebSocket open event.
   */

  private handleSocketOpen() {
    this.connectionStatus.next(true);
    console.log('WebSocket connected.');
    this.resubscribeAll();
  }

  /**
   * Processes incoming WebSocket messages.
   * @param message The message received from the WebSocket.
   */

  private handleBatchMessages(messages: (StockData | WebSocketMessage)[]) {
    const existingData = [...this.stocksData.value.slice()];

    messages.forEach((message) => {
      if (this.isStockData(message)) {
        const updatedMessage = {
          ...message,
          ask: Number(message.ask.toFixed(4)),
          bid: Number(message.bid.toFixed(4)),
          price: Number(message.price.toFixed(4)),
        };
        const index = existingData.findIndex(
          (stock) => stock.isin === updatedMessage.isin
        );
        if (index !== -1) {
          existingData[index] = updatedMessage;
        } else {
          existingData.push(updatedMessage);
        }
      } else {
        console.warn('Received unknown message format:', message);
      }
    });

    this.stocksData.next(existingData);
  }

  /**
   * Type guard to determine if the message is stock data.
   * @param message The message received from the WebSocket.
   * @returns True if the message is stock data, false otherwise.
   */

  private isStockData(
    message: StockData | WebSocketMessage
  ): message is StockData {
    return (message as StockData).isin !== undefined;
  }

  /**
   * Attempts to reconnect to the WebSocket after a delay.
   */

  private reconnect() {
    console.log('Attempting to reconnect...');
    timer(5000)
      .pipe(
        switchMap(() => {
          console.log('Reconnecting to WebSocket...');
          this.connectToWebSocket();
          return this.connectionStatus;
        }),
        catchError((error: string) => {
          console.error('Reconnection error:', error);
          return this.connectionStatus;
        })
      )
      .subscribe();
  }

  /**
   * Resubscribes to all current stock subscriptions.
   */

  private resubscribeAll() {
    const currentSubs = this.subscriptions.value;
    currentSubs.forEach((isin) => this.socket$.next({ subscribe: isin }));
  }

  /**
   * Subscribes to updates for a given stock.
   * @param isin The ISIN of the stock to subscribe to.
   */

  subscribeToStock(isin: string) {
    const currentSubs = this.subscriptions.value;
    if (!currentSubs.includes(isin) && validateImmediately(isin)) {
      this.loading.next(true);

      this.socket$.next({ subscribe: isin });
      this.subscriptions.next([...currentSubs, isin]);
      this.loading.next(false);
    }
  }

  /**
   * Unsubscribes from updates for given stocks.
   * @param isins The ISINs of the stocks to unsubscribe from.
   */

  unsubscribeFromStocks(isins: string[]) {
    this.loading.next(true);
    const currentSubs = this.subscriptions.value.filter(
      (sub) => !isins.includes(sub)
    );

    const updatedStocksData = this.stocksData.value.filter(
      (stock) => !isins.includes(stock.isin)
    );
    this.stocksData.next(updatedStocksData);

    isins.forEach((isin) => {
      this.socket$.next({ unsubscribe: isin });
    });

    this.subscriptions.next(currentSubs);
    this.loading.next(false);
  }

  /**
   * Returns an observable of the WebSocket connection status.
   * @returns An observable emitting the connection status.
   */

  getConnectionStatus(): Observable<boolean> {
    return this.connectionStatus.asObservable();
  }

  /**
   * Returns an observable of the current subscriptions.
   * @returns An observable emitting the current subscriptions.
   */

  getSubscriptions(): Observable<string[]> {
    return this.subscriptions.asObservable();
  }

  /**
   * Returns an observable of the current stock data, sampled every second.
   * @returns An observable emitting the current stock data.
   */

  getStocksData(): Observable<StockData[]> {
    return this.stocksData.asObservable();
  }

  /**
   * Returns an observable of the loading status (since its running locally its not really doing much)
   * @returns An observable emitting the loading status.
   */

  getLoading(): Observable<boolean> {
    return this.loading.asObservable();
  }
}
