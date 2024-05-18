import { renderHook } from '@testing-library/react-hooks';
import { useISINValidation } from './useISINValidation';
import { act } from 'react';
import { waitFor } from '@testing-library/react';

jest.mock('./__mocks__/debounce');

describe('useISINValidation', () => {
    it('should initialize with default values', () => {
        const { result } = renderHook(() => useISINValidation());
        console.log(result.current);


        expect(result.current.isValidISIN).toBe(false);
        expect(result.current.errorMessage).toBe('');
    });

    it('should validate ISIN correctly', async () => {
        const { result } = renderHook(() => useISINValidation());

        act(() => {
            result.current.validateISIN('DE000BASF111');
        });

        await waitFor(() => {
            expect(result.current.isValidISIN).toBe(true);
            expect(result.current.errorMessage).toBe('');
        });
    });

    it('should invalidate incorrect ISIN and set errorMessage', async () => {
        const { result } = renderHook(() => useISINValidation());

        act(() => {
            result.current.validateISIN('INVALIDISIN');
        });

        await waitFor(() => {
            expect(result.current.isValidISIN).toBe(false);
            expect(result.current.errorMessage).toBe('Invalid ISIN. It should be a 12-character alphanumeric code.');
        })
    });

    it('should handle empty ISIN and set errorMessage', async () => {
        const { result } = renderHook(() => useISINValidation());

        act(() => {
            result.current.validateISIN('');
        });
        await waitFor(() => {
            expect(result.current.isValidISIN).toBe(false);
            expect(result.current.errorMessage).toBe('Invalid ISIN. It should be a 12-character alphanumeric code.');
        })

    });

    it('should handle null ISIN and set errorMessage', async () => {
        const { result } = renderHook(() => useISINValidation());

        act(() => {
            result.current.validateISIN(null);
        });
        await waitFor(() => {
            expect(result.current.isValidISIN).toBe(false);
            expect(result.current.errorMessage).toBe('Invalid ISIN. It should be a 12-character alphanumeric code.');
        })

    });

});
