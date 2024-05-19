import { render, screen, fireEvent } from '@testing-library/react';
import ISINInput from './';

describe('ISINInput', () => {
  it('should display error message for invalid ISIN', () => {
    const errorMessage = 'Invalid ISIN';
    render(<ISINInput value="asdf" onChange={() => {}} errorMessage={errorMessage} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it('should call onChange when input changes', () => {
    const handleChange = jest.fn();
    render(<ISINInput value="" onChange={handleChange} errorMessage="" />);
    fireEvent.change(screen.getByPlaceholderText('Enter ISIN'), { target: { value: 'US0378331005' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});