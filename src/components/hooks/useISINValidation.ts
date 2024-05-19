import { useState, useCallback } from 'react';
import debounce from '../../utils/debounce';

export const useISINValidation = () => {
  const [isValidISIN, setIsValidISIN] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateISIN = useCallback(debounce((isin: string) => {
    const regex = /^[A-Z]{2}[A-Z0-9]{9}[0-9]$/i;   
    if (regex.test(isin)) {
      setIsValidISIN(true);
      setErrorMessage('');
    } else {
      setIsValidISIN(false);
      setErrorMessage('Invalid ISIN. It should be a 12-character alphanumeric code.');
    }
  }, 300), []);

  return { isValidISIN, errorMessage, validateISIN };
};