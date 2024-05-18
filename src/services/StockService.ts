import { BehaviorSubject, timer, Observable } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';
import { switchMap, catchError, auditTime } from 'rxjs/operators';

export interface StockData {
  isin: string;
  price: number;
  bid: number;
  ask: number;
}

export class StockService {
  private socket$!: WebSocketSubject<any>;
  private subscriptions = new BehaviorSubject<string[]>([]);
  private stocksData = new BehaviorSubject<StockData[]>([]);
  private connectionStatus = new BehaviorSubject<boolean>(false);

  constructor() {
    this.connectToWebSocket();
  }

  private connectToWebSocket() {
    this.socket$ = new WebSocketSubject({
      url: 'ws://localhost:8425/',
      closeObserver: {
        next: () => this.handleSocketClose(),
      },
      openObserver: {
        next: () => this.handleSocketOpen(),
      },
    });

    this.socket$.subscribe({
      next: (msg: StockData) => this.handleMessage(msg),
      error: (err: any) => console.error('WebSocket error:', err),
    });
  }

  private handleSocketClose() {
    this.connectionStatus.next(false);
    console.error('WebSocket disconnected. Attempting to reconnect...');
    this.reconnect();
  }

  private handleSocketOpen() {
    this.connectionStatus.next(true);
    console.log('WebSocket connected.');
    this.resubscribeAll();
  }

  private handleMessage(message: StockData) {
    const updatedMessage = {
      ...message,
      ask: Number(message.ask.toFixed(4)),
      bid: Number(message.bid.toFixed(4)),
      price: Number(message.price.toFixed(4)),
    };
    const existingData = this.stocksData.value;
    const index = existingData.findIndex(stock => stock.isin === updatedMessage.isin);
    if (index !== -1) {
      existingData[index] = updatedMessage;
    } else {
      existingData.push(updatedMessage);
    }
    this.stocksData.next([...existingData]);
  }

  private reconnect() {
    timer(5000)
      .pipe(
        switchMap(() => {
          console.log('Reconnecting to WebSocket...');
          this.connectToWebSocket();
          return this.connectionStatus;
        }),
        catchError(error => {
          console.error('Reconnection error:', error);
          return this.connectionStatus;
        })
      )
      .subscribe();
  }

  private resubscribeAll() {
    const currentSubs = this.subscriptions.value;
    currentSubs.forEach(isin => this.socket$.next({ subscribe: isin }));
  }

  subscribeToStock(isin: string) {
    const currentSubs = this.subscriptions.value;
    if (!currentSubs.includes(isin)) {
      this.socket$.next({ subscribe: isin });
      this.subscriptions.next([...currentSubs, isin]);
    }
  }

  unsubscribeFromStocks(isins: string[]) {
    const currentSubs = this.subscriptions.value.filter(sub => !isins.includes(sub));
    isins.forEach(isin => {
      this.socket$.next({ unsubscribe: isin });
    });
    this.subscriptions.next(currentSubs);

    const updatedStocksData = this.stocksData.value.filter(stock => !isins.includes(stock.isin));
    this.stocksData.next(updatedStocksData);
  }

  getConnectionStatus(): Observable<boolean> {
    return this.connectionStatus.asObservable();
  }

  getSubscriptions(): Observable<string[]> {
    return this.subscriptions.asObservable();
  }

  getStocksData(): Observable<StockData[]> {
    return this.stocksData.asObservable().pipe(auditTime(1000));
  }
}
