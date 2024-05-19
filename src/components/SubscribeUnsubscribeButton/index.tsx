import { useCallback } from 'react';
import Button from '../Button';
import { useStockService, stockService } from '../hooks/useStockService';

interface SubscribeUnsubscribeButtonProps {
    isin: string;
    isValidISIN: boolean;
    connectionStatus: boolean;
}

const SubscribeUnsubscribeButton = ({ isin, isValidISIN, connectionStatus }: SubscribeUnsubscribeButtonProps) => {
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
