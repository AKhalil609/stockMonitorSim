import { renderHook } from '@testing-library/react-hooks';
import { useISINValidation, validateImmediately } from './useISINValidation';
import { act } from 'react';
import { waitFor } from '@testing-library/react';

describe('useISINValidation', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useISINValidation());

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
      expect(result.current.errorMessage).toBe(
        'Invalid ISIN. It should be a 12-character alphanumeric code.'
      );
    });
  });

  it('should handle empty ISIN and set errorMessage', async () => {
    const { result } = renderHook(() => useISINValidation());

    act(() => {
      result.current.validateISIN('');
    });
    await waitFor(() => {
      expect(result.current.isValidISIN).toBe(false);
      expect(result.current.errorMessage).toBe(
        'Invalid ISIN. It should be a 12-character alphanumeric code.'
      );
    });
  });

  it('should handle null ISIN and set errorMessage', async () => {
    const { result } = renderHook(() => useISINValidation());

    act(() => {
      result.current.validateISIN(null as unknown as string);
    });
    await waitFor(() => {
      expect(result.current.isValidISIN).toBe(false);
      expect(result.current.errorMessage).toBe(
        'Invalid ISIN. It should be a 12-character alphanumeric code.'
      );
    });
  });

  describe('validateImmediately', () => {
    it('should return true for a valid ISIN', () => {
      const validISIN = 'DE000BASF111';
      expect(validateImmediately(validISIN)).toBe(true);
    });

    it('should return false for an invalid ISIN', () => {
      const invalidISIN = 'INVALIDISIN';
      expect(validateImmediately(invalidISIN)).toBe(false);
    });

    it('should return false for an empty ISIN', () => {
      expect(validateImmediately('')).toBe(false);
    });
  });
});
