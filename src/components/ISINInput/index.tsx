import React from 'react';
import TextField from '../TextField';
import './style.scss';

interface ISINInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage: string;
}

/**
 * Component for entering and validating an ISIN (International Securities Identification Number).
 *
 * @component
 * @param {string} value - The current value of the ISIN input.
 * @param {function} onChange - Function to call when the ISIN input value changes.
 * @param {string} errorMessage - Error message to display if the ISIN is invalid.
 */
const ISINInput = ({ value, onChange, errorMessage }: ISINInputProps) => (
  <div className="input-container">
    <label htmlFor="isin-input">Enter ISIN</label>
    <TextField value={value} onChange={onChange} placeholder="Enter ISIN" />
    {errorMessage && !!value.length && (
      <div role="alert" style={{ color: 'red' }}>
        {errorMessage}
      </div>
    )}
  </div>
);

export default ISINInput;
