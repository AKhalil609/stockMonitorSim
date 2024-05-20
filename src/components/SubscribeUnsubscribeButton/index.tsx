import { useCallback } from 'react';
import Button from '../Button';
import { useStockService, stockService } from '../hooks/useStockService';

interface SubscribeUnsubscribeButtonProps {
  isin: string;
  isValidISIN: boolean;
  connectionStatus: boolean;
}

/**
 * Reactive button component for subscribing or unsubscribing to a stock based on its ISIN.
 *
 * @component
 * @param {string} isin - The ISIN of the stock to subscribe/unsubscribe.
 * @param {boolean} isValidISIN - Indicates if the provided ISIN is valid.
 * @param {boolean} connectionStatus - Indicates if the WebSocket connection is active.
 */
const SubscribeUnsubscribeButton = ({
  isin,
  isValidISIN,
  connectionStatus,
}: SubscribeUnsubscribeButtonProps) => {
  const { subscriptions } = useStockService();

  const isSubscribed = subscriptions.includes(isin.toUpperCase());

  const handleSubscribe = useCallback(() => {
    stockService.subscribeToStock(isin.toUpperCase());
  }, [isin]);

  const handleUnsubscribe = useCallback(() => {
    stockService.unsubscribeFromStocks([isin.toUpperCase()]);
  }, [isin]);

  return (
    <>
      {!isSubscribed && (
        <Button
          ariaLabel="subscribe"
          onClick={handleSubscribe}
          disabled={!isValidISIN || !connectionStatus || isSubscribed}
        >
          Subscribe
        </Button>
      )}
      {isSubscribed && (
        <Button
          ariaLabel="unsubscribe"
          onClick={handleUnsubscribe}
          disabled={!isSubscribed || !connectionStatus}
        >
          Unsubscribe
        </Button>
      )}
    </>
  );
};

export default SubscribeUnsubscribeButton;
