import { useState, useEffect, useCallback } from 'react';
import { type StockData } from '../../services/StockService';
import NotificationCard from '../NotificationCard';
import Table, { TableColumn } from '../Table';
import Button from '../Button';
import { useStockService, stockService } from '../hooks/useStockService';
import { useISINValidation } from '../hooks/useISINValidation';
import ISINInput from '../ISINInput';
import SubscribeUnsubscribeButton from '../SubscribeUnsubscribeButton';

const columns: TableColumn<StockData>[] = [
    { key: 'isin', header: 'ISIN' },
    { key: 'price', header: 'Price' },
    { key: 'bid', header: 'BID' },
    { key: 'ask', header: 'ASK' },
];

const StockSubscriber = () => {
    const { stocksData, connectionStatus } = useStockService();
    const [isinInput, setIsinInput] = useState('');
    const { isValidISIN, errorMessage, validateISIN } = useISINValidation();
    const [notification, setNotification] = useState<{ message: string; type: 'error' | 'info' } | null>(null);
    const [selectedRows, setSelectedRows] = useState<string[]>([]);

    useEffect(() => {

        if (!connectionStatus) {
            setNotification({ message: 'Connection lost. Prices may not be accurate.', type: 'error' });
        } else {
            setNotification({ message: 'Connected to the server.', type: 'info' });
        }
    }, [connectionStatus]);

    const handleISINChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setIsinInput(value);
        validateISIN(value);
    }, [validateISIN]);

    const handleBulkUnsubscribe = useCallback(() => {
        stockService.unsubscribeFromStocks(selectedRows);
        setSelectedRows([]);
    }, [selectedRows]);

    const onTableSelectionChange = useCallback((selected: StockData[]) => {
        setSelectedRows(selected.map(stock => stock.isin));
    }, []);

    return (
        <section>
            <form >
                <ISINInput value={isinInput} onChange={handleISINChange} errorMessage={errorMessage} />
                <SubscribeUnsubscribeButton
                    isin={isinInput}
                    isValidISIN={isValidISIN}
                    connectionStatus={connectionStatus}
                />
            </form>

            {stocksData.length > 0 && (
                <section>
                    <Table<StockData>
                        data={stocksData}
                        columns={columns}
                        onSelectionChange={onTableSelectionChange}
                        selectable
                    />
                    <Button
                        ariaLabel="unsubscribe from selected"
                        onClick={handleBulkUnsubscribe}
                        disabled={!selectedRows.length || !connectionStatus}
                    >
                        Unsubscribe From Selected
                    </Button>
                </section>
            )}
            {notification && <NotificationCard message={notification.message} type={notification.type} />}
        </section>
    );
};

export default StockSubscriber;
