import React from 'react';
import TextField from '../TextField';

interface ISINInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage: string;
}

const ISINInput = ({ value, onChange, errorMessage }: ISINInputProps) => (
  <div>
    <TextField value={value} onChange={onChange} placeholder="Enter ISIN" />
    {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
  </div>
);

export default ISINInput;