import React from 'react';

interface NotificationCardProps {
  message: string;
  type: 'error' | 'info';
}

const NotificationCard = ({ message, type }: NotificationCardProps) => {
  const cardStyle: React.CSSProperties = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    padding: '10px 20px',
    borderRadius: '5px',
    backgroundColor: type === 'error' ? '#ffdddd' : '#ddffdd',
    color: type === 'error' ? '#d8000c' : '#006400',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    zIndex: 1000,
  };

  return (
    <div style={cardStyle}>
      {message}
    </div>
  );
};

export default NotificationCard;