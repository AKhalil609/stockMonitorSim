import { type ReactNode } from 'react';
import './style.scss';

interface ButtonProps {
  children: ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
  ariaLabel?: string;
}

const Button = ({ children, onClick, disabled, ariaLabel }: ButtonProps) => {
  return (
    <button
      aria-label={ariaLabel}
      onClick={onClick}
      className="button"
      disabled={disabled}
    >
      <span className="button-content">{children}</span>
    </button>
  );
};

export default Button;
