import React from 'react';
import TextField from '../TextField';
import "./style.scss";

interface ISINInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage: string;
}

const ISINInput = ({ value, onChange, errorMessage }: ISINInputProps) => (
  <div className='input-container'>
    <TextField value={value} onChange={onChange} placeholder="Enter ISIN" />
    {errorMessage && !!value.length && <div style={{ color: 'red' }}>{errorMessage}</div>}
  </div>
);

export default ISINInput;