import { useState, useCallback, useRef } from 'react';
import debounce from '../../utils/debounce';

const regex = /^[A-Z]{2}[A-Z0-9]{9}[0-9]$/i;

/**
 * Custom hook for validating ISIN (International Securities Identification Number).
 *
 * @returns {Object} An object containing:
 * - `isValidISIN`: A boolean indicating if the ISIN is valid.
 * - `errorMessage`: A string containing the error message if the ISIN is invalid.
 * - `validateISIN`: A function to validate the ISIN input.
 */
export const useISINValidation = () => {
  const [isValidISIN, setIsValidISIN] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateISINRef = useRef(
    debounce((isin: string) => {
      if (regex.test(isin)) {
        setIsValidISIN(true);
        setErrorMessage('');
      } else {
        setIsValidISIN(false);
        setErrorMessage(
          'Invalid ISIN. It should be a 12-character alphanumeric code.'
        );
      }
    }, 300)
  );

  const validateISIN = useCallback((isin: string) => {
    validateISINRef.current(isin);
  }, []);

  return { isValidISIN, errorMessage, validateISIN };
};

/**
 * Function to immediately validate an ISIN.
 *
 * @param {string} isin - The ISIN to validate.
 * @returns {boolean} True if the ISIN is valid, false otherwise.
 */
export const validateImmediately = (isin: string) => {
  return regex.test(isin);
};
