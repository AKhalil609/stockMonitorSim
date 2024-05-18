import { type ReactNode } from 'react';
import "./style.scss";

interface CardProps {
    children: ReactNode;
  }

const Card = ({children}:CardProps) => {
  return (
    <div className="card">{children}</div>
  )
}

export default Card;